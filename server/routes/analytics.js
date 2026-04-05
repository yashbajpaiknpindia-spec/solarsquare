import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Resolve client IP, unwrapping Render / Cloudflare proxy headers.
 */
function getClientIP(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const first = forwarded.split(',')[0].trim();
    if (first && first !== '::1' && first !== '127.0.0.1') return first;
  }
  return req.ip || req.connection?.remoteAddress || '0.0.0.0';
}

/**
 * Identify device type from User-Agent string.
 */
function parseDevice(ua = '') {
  if (!ua) return 'Unknown';
  const u = ua.toLowerCase();
  if (/bot|crawler|spider|crawling|slurp|facebookexternalhit|linkedinbot|twitterbot/i.test(u)) return 'Bot';
  if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(u)) return 'Mobile';
  if (/tablet|ipad/i.test(u)) return 'Tablet';
  return 'Desktop';
}

/**
 * Identify browser name from User-Agent string.
 */
function parseBrowser(ua = '') {
  if (!ua) return 'Unknown';
  if (/edg\//i.test(ua)) return 'Edge';
  if (/opr\//i.test(ua)) return 'Opera';
  if (/chrome\//i.test(ua)) return 'Chrome';
  if (/safari\//i.test(ua) && !/chrome/i.test(ua)) return 'Safari';
  if (/firefox\//i.test(ua)) return 'Firefox';
  if (/msie|trident\//i.test(ua)) return 'IE';
  return 'Other';
}

/**
 * Identify OS from User-Agent.
 */
function parseOS(ua = '') {
  if (!ua) return 'Unknown';
  if (/windows nt/i.test(ua)) return 'Windows';
  if (/mac os x/i.test(ua)) return 'macOS';
  if (/android/i.test(ua)) return 'Android';
  if (/ios|iphone|ipad/i.test(ua)) return 'iOS';
  if (/linux/i.test(ua)) return 'Linux';
  return 'Other';
}

/**
 * Free IP geolocation via ip-api.com (no key needed, 45 req/min for free tier).
 */
async function geolocateIP(ip) {
  const privateRanges = [
    /^10\./, /^172\.(1[6-9]|2\d|3[01])\./, /^192\.168\./,
    /^127\./, /^::1$/, /^0\.0\.0\.0$/, /^localhost$/,
  ];
  if (privateRanges.some((r) => r.test(ip))) {
    return { country: 'Local', country_code: 'LO', city: 'Local', region: '', lat: 0, lng: 0 };
  }
  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,lat,lon`,
      { signal: AbortSignal.timeout(3000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 'success') return null;
    return {
      country:      data.country      || null,
      country_code: data.countryCode  || null,
      city:         data.city         || null,
      region:       data.regionName   || null,
      lat:          data.lat          || null,
      lng:          data.lon          || null,
    };
  } catch {
    return null;
  }
}

// ─── middleware ────────────────────────────────────────────────────────────────

function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.token;
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || token !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// ─── routes ───────────────────────────────────────────────────────────────────

/**
 * POST /api/analytics/track
 * Record a new page visit. Called by the frontend AnalyticsTracker on mount.
 */
router.post('/track', async (req, res) => {
  try {
    const {
      session_id, page = '/', referrer = '',
      screen_width, screen_height,
    } = req.body;

    if (!session_id || typeof session_id !== 'string' || session_id.length > 64) {
      return res.status(400).json({ error: 'Invalid session_id' });
    }

    const ua          = req.headers['user-agent'] || '';
    const device_type = parseDevice(ua);
    const browser     = parseBrowser(ua);
    const os          = parseOS(ua);
    const is_bot      = device_type === 'Bot';
    const ip          = getClientIP(req);

    // Fire-and-forget geo lookup
    geolocateIP(ip).then(async (geo) => {
      try {
        await pool.query(
          `INSERT INTO page_visits
            (session_id, page, ip, country, country_code, city, region, lat, lng,
             user_agent, referrer, device_type, browser, os,
             screen_width, screen_height, is_bot)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
          [
            session_id,
            page.slice(0, 512),
            ip,
            geo?.country      || null,
            geo?.country_code || null,
            geo?.city         || null,
            geo?.region       || null,
            geo?.lat          || null,
            geo?.lng          || null,
            ua.slice(0, 500),
            referrer.slice(0, 500),
            device_type,
            browser,
            os,
            screen_width  || null,
            screen_height || null,
            is_bot,
          ]
        );
      } catch (dbErr) {
        console.error('DB insert error:', dbErr.message);
      }
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Track error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

/**
 * PUT /api/analytics/track/:sessionId/duration
 * Update session duration (called on beforeunload / visibilitychange).
 */
router.put('/track/:sessionId/duration', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { duration_sec } = req.body;

    if (!sessionId || sessionId.length > 64) {
      return res.status(400).json({ error: 'Invalid session_id' });
    }
    const dur = Math.min(Math.max(parseInt(duration_sec, 10) || 0, 0), 86400);

    await pool.query(
      `UPDATE page_visits
         SET duration_sec = GREATEST(duration_sec, $1),
             updated_at   = NOW()
       WHERE session_id = $2
         AND created_at > NOW() - INTERVAL '24 hours'`,
      [dur, sessionId]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error('Duration update error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

// ─── admin stats ──────────────────────────────────────────────────────────────

/**
 * GET /api/analytics/admin/stats
 * Returns aggregated analytics for the admin dashboard.
 */
router.get('/admin/stats', requireAdmin, async (req, res) => {
  try {
    const days = Math.min(parseInt(req.query.days, 10) || 30, 90);

    const [
      overview,
      dailyVisits,
      topCountries,
      deviceBreakdown,
      browserBreakdown,
      topReferrers,
      recentVisits,
      hourlyHeatmap,
    ] = await Promise.all([
      // ── Overview KPIs ──
      pool.query(`
        SELECT
          COUNT(*)                                                   AS total_visits,
          COUNT(DISTINCT session_id)                                 AS unique_sessions,
          ROUND(AVG(duration_sec))                                   AS avg_duration_sec,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 day')  AS visits_today,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') AS visits_7d,
          COUNT(DISTINCT country_code) FILTER (WHERE country_code IS NOT NULL) AS unique_countries
        FROM page_visits
        WHERE created_at >= NOW() - ($1 || ' days')::INTERVAL
          AND is_bot = FALSE
      `, [days]),

      // ── Daily visit trend ──
      pool.query(`
        SELECT
          DATE(created_at AT TIME ZONE 'UTC') AS date,
          COUNT(*)                            AS visits,
          COUNT(DISTINCT session_id)          AS sessions
        FROM page_visits
        WHERE created_at >= NOW() - ($1 || ' days')::INTERVAL
          AND is_bot = FALSE
        GROUP BY 1
        ORDER BY 1
      `, [days]),

      // ── Top countries ──
      pool.query(`
        SELECT
          COALESCE(country, 'Unknown') AS country,
          country_code,
          COUNT(*)                     AS visits,
          COUNT(DISTINCT session_id)   AS sessions
        FROM page_visits
        WHERE created_at >= NOW() - ($1 || ' days')::INTERVAL
          AND is_bot = FALSE
        GROUP BY 1, 2
        ORDER BY 3 DESC
        LIMIT 15
      `, [days]),

      // ── Device breakdown ──
      pool.query(`
        SELECT
          COALESCE(device_type, 'Unknown') AS device,
          COUNT(*)                          AS visits
        FROM page_visits
        WHERE created_at >= NOW() - ($1 || ' days')::INTERVAL
          AND is_bot = FALSE
        GROUP BY 1
        ORDER BY 2 DESC
      `, [days]),

      // ── Browser breakdown ──
      pool.query(`
        SELECT
          COALESCE(browser, 'Unknown') AS browser,
          COUNT(*)                      AS visits
        FROM page_visits
        WHERE created_at >= NOW() - ($1 || ' days')::INTERVAL
          AND is_bot = FALSE
        GROUP BY 1
        ORDER BY 2 DESC
      `, [days]),

      // ── Top referrers ──
      pool.query(`
        SELECT
          COALESCE(NULLIF(referrer, ''), 'Direct') AS referrer,
          COUNT(*)                                  AS visits
        FROM page_visits
        WHERE created_at >= NOW() - ($1 || ' days')::INTERVAL
          AND is_bot = FALSE
        GROUP BY 1
        ORDER BY 2 DESC
        LIMIT 10
      `, [days]),

      // ── Recent visits (last 50) ──
      pool.query(`
        SELECT
          session_id,
          page,
          country,
          city,
          device_type,
          browser,
          duration_sec,
          referrer,
          created_at
        FROM page_visits
        WHERE is_bot = FALSE
        ORDER BY created_at DESC
        LIMIT 50
      `),

      // ── Hourly heatmap (hour 0-23 vs day 0-6) ──
      pool.query(`
        SELECT
          EXTRACT(DOW  FROM created_at AT TIME ZONE 'Asia/Kolkata') AS dow,
          EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Kolkata') AS hour,
          COUNT(*) AS visits
        FROM page_visits
        WHERE created_at >= NOW() - ($1 || ' days')::INTERVAL
          AND is_bot = FALSE
        GROUP BY 1, 2
        ORDER BY 1, 2
      `, [days]),
    ]);

    res.json({
      overview:         overview.rows[0],
      dailyVisits:      dailyVisits.rows,
      topCountries:     topCountries.rows,
      deviceBreakdown:  deviceBreakdown.rows,
      browserBreakdown: browserBreakdown.rows,
      topReferrers:     topReferrers.rows,
      recentVisits:     recentVisits.rows,
      hourlyHeatmap:    hourlyHeatmap.rows,
      generatedAt:      new Date().toISOString(),
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

export default router;
