import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected DB pool error:', err);
});

export async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS page_visits (
        id            SERIAL PRIMARY KEY,
        session_id    VARCHAR(64)   NOT NULL,
        page          VARCHAR(512)  DEFAULT '/',
        ip            VARCHAR(64),
        country       VARCHAR(100),
        country_code  VARCHAR(10),
        city          VARCHAR(150),
        region        VARCHAR(150),
        lat           FLOAT,
        lng           FLOAT,
        duration_sec  INTEGER       DEFAULT 0,
        user_agent    TEXT,
        referrer      TEXT,
        device_type   VARCHAR(50),
        browser       VARCHAR(100),
        os            VARCHAR(100),
        screen_width  INTEGER,
        screen_height INTEGER,
        is_bot        BOOLEAN       DEFAULT FALSE,
        created_at    TIMESTAMPTZ   DEFAULT NOW(),
        updated_at    TIMESTAMPTZ   DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_pv_created_at   ON page_visits (created_at);
      CREATE INDEX IF NOT EXISTS idx_pv_session_id   ON page_visits (session_id);
      CREATE INDEX IF NOT EXISTS idx_pv_country_code ON page_visits (country_code);
      CREATE INDEX IF NOT EXISTS idx_pv_device_type  ON page_visits (device_type);
    `);
    console.log('✅  Database schema ready');
  } finally {
    client.release();
  }
}
