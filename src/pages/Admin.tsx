import { useState, useEffect, useCallback } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Users, Eye, Clock, Globe, Monitor, Smartphone, Tablet,
  TrendingUp, MapPin, ExternalLink, RefreshCw, Lock, BarChart2,
  Calendar,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Overview {
  total_visits: string;
  unique_sessions: string;
  avg_duration_sec: string;
  visits_today: string;
  visits_7d: string;
  unique_countries: string;
}

interface DailyVisit { date: string; visits: string; sessions: string }
interface CountryRow { country: string; country_code: string; visits: string; sessions: string }
interface DeviceRow  { device: string; visits: string }
interface BrowserRow { browser: string; visits: string }
interface ReferrerRow{ referrer: string; visits: string }
interface RecentVisit {
  session_id: string; page: string; country: string; city: string;
  device_type: string; browser: string; duration_sec: number;
  referrer: string; created_at: string;
}
interface HourlyRow  { dow: string; hour: string; visits: string }

interface StatsData {
  overview: Overview;
  dailyVisits: DailyVisit[];
  topCountries: CountryRow[];
  deviceBreakdown: DeviceRow[];
  browserBreakdown: BrowserRow[];
  topReferrers: ReferrerRow[];
  recentVisits: RecentVisit[];
  hourlyHeatmap: HourlyRow[];
  generatedAt: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CHART_COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];
const DAYS_OPTIONS = [7, 14, 30, 60, 90];

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDuration(sec: number | string): string {
  const s = Number(sec) || 0;
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r ? `${m}m ${r}s` : `${m}m`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  icon: Icon, label, value, sub, color = "text-amber-500",
}: {
  icon: React.ElementType; label: string; value: string | number;
  sub?: string; color?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4 items-start">
      <div className={`p-3 rounded-xl bg-gray-50 ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

const DOW_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function HeatmapChart({ data }: { data: HourlyRow[] }) {
  // Build matrix [dow][hour] = visits
  const matrix: Record<string, Record<string, number>> = {};
  let maxVal = 0;
  data.forEach(({ dow, hour, visits }) => {
    const d = String(Math.round(Number(dow)));
    const h = String(Math.round(Number(hour)));
    if (!matrix[d]) matrix[d] = {};
    matrix[d][h] = (matrix[d][h] || 0) + Number(visits);
    if (matrix[d][h] > maxVal) maxVal = matrix[d][h];
  });

  return (
    <div className="overflow-x-auto">
      <table className="text-xs border-collapse w-full min-w-[520px]">
        <thead>
          <tr>
            <th className="w-10 text-gray-400 font-normal pb-1" />
            {Array.from({ length: 24 }, (_, h) => (
              <th key={h} className="text-gray-400 font-normal pb-1 text-center w-6">
                {h % 6 === 0 ? `${h}h` : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DOW_LABELS.map((label, d) => (
            <tr key={d}>
              <td className="text-gray-500 pr-2 py-0.5 text-right font-medium w-10">{label}</td>
              {Array.from({ length: 24 }, (_, h) => {
                const v = matrix[String(d)]?.[String(h)] || 0;
                const intensity = maxVal > 0 ? v / maxVal : 0;
                const bg = intensity === 0
                  ? "bg-gray-50"
                  : intensity < 0.25 ? "bg-amber-100"
                  : intensity < 0.5  ? "bg-amber-200"
                  : intensity < 0.75 ? "bg-amber-400"
                  : "bg-amber-600";
                return (
                  <td key={h} className={`w-6 h-5 ${bg} rounded-sm border border-white`}
                      title={`${label} ${h}:00 — ${v} visit${v !== 1 ? "s" : ""}`} />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
        <span>Less</span>
        {["bg-gray-50","bg-amber-100","bg-amber-200","bg-amber-400","bg-amber-600"].map((c,i) => (
          <span key={i} className={`w-4 h-4 rounded-sm ${c} border border-gray-200 inline-block`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/analytics/admin/stats?days=1&token=${encodeURIComponent(token)}`);
      if (res.ok) {
        sessionStorage.setItem("admin_token", token);
        onLogin(token);
      } else {
        setError("Invalid admin token. Check your ADMIN_TOKEN environment variable.");
      }
    } catch {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 mx-auto mb-6">
          <Lock size={26} className="text-amber-500" />
        </div>
        <h1 className="text-xl font-bold text-center text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 text-center mt-1 mb-6">Sol Grid India Analytics</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Admin Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold text-sm transition disabled:opacity-60"
          >
            {loading ? "Checking…" : "Sign In"}
          </button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-4">
          Set <code className="bg-gray-100 px-1 rounded">ADMIN_TOKEN</code> env var on Render.
        </p>
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

function Dashboard({ token }: { token: string }) {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [days, setDays] = useState(30);
  const [activeTab, setActiveTab] = useState<"overview"|"realtime"|"geo"|"tech">("overview");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/analytics/admin/stats?days=${days}`,
        { headers: { "x-admin-token": token } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, [days, token]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const ov = data?.overview;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <BarChart2 size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-sm leading-none">Sol Grid India</h1>
              <p className="text-xs text-gray-500">Analytics Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Days filter */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Calendar size={14} className="text-gray-400 ml-1" />
              {DAYS_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                    days === d
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
            <button
              onClick={fetchStats}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 text-amber-600 text-xs font-medium hover:bg-amber-100 transition disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            {GA_MEASUREMENT_ID && (
              <a
                href={`https://analytics.google.com/analytics/web/#/p${GA_MEASUREMENT_ID.replace("G-","")}/reports/reportinghub`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition"
              >
                <ExternalLink size={13} />
                Google Analytics
              </a>
            )}
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 flex gap-1 pb-0 border-t border-gray-100">
          {(["overview","realtime","geo","tech"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-medium capitalize border-b-2 transition ${
                activeTab === tab
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading && !data && (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 text-sm">
            Error: {error}
          </div>
        )}

        {data && (
          <>
            {/* ── Overview Tab ── */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* KPI cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <StatCard icon={Eye}       label="Total Visits"     value={Number(ov?.total_visits || 0).toLocaleString()}    color="text-amber-500" />
                  <StatCard icon={Users}     label="Unique Sessions"  value={Number(ov?.unique_sessions || 0).toLocaleString()}  color="text-blue-500" />
                  <StatCard icon={TrendingUp} label="Today"           value={Number(ov?.visits_today || 0).toLocaleString()}     color="text-green-500" />
                  <StatCard icon={BarChart2} label="Last 7 Days"      value={Number(ov?.visits_7d || 0).toLocaleString()}        color="text-purple-500" />
                  <StatCard icon={Clock}     label="Avg Duration"     value={fmtDuration(ov?.avg_duration_sec || 0)}             color="text-pink-500" />
                  <StatCard icon={Globe}     label="Countries"        value={ov?.unique_countries || 0}                          color="text-teal-500" />
                </div>

                {/* Daily visits chart */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h2 className="font-semibold text-gray-900 mb-4 text-sm">Visits Over Time</h2>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={data.dailyVisits.map((d) => ({
                      date: fmtDate(d.date),
                      Visits: Number(d.visits),
                      Sessions: Number(d.sessions),
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="Visits"   stroke="#f59e0b" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="Sessions" stroke="#3b82f6" strokeWidth={2} dot={false} strokeDasharray="4 2" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Heatmap */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h2 className="font-semibold text-gray-900 mb-4 text-sm">Activity Heatmap (IST)</h2>
                  <HeatmapChart data={data.hourlyHeatmap} />
                </div>

                {/* Recent visits table */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h2 className="font-semibold text-gray-900 mb-4 text-sm">Recent Visits</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-gray-100">
                          {["Time","Page","Location","Device","Browser","Duration","Referrer"].map((h) => (
                            <th key={h} className="pb-2 pr-4 text-gray-400 font-medium whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentVisits.map((v, i) => (
                          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                            <td className="py-2 pr-4 text-gray-500 whitespace-nowrap">{fmtDateTime(v.created_at)}</td>
                            <td className="py-2 pr-4 text-gray-700 max-w-[120px] truncate font-mono">{v.page || "/"}</td>
                            <td className="py-2 pr-4 text-gray-600 whitespace-nowrap">
                              {[v.city, v.country].filter(Boolean).join(", ") || "—"}
                            </td>
                            <td className="py-2 pr-4">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                v.device_type === "Mobile" ? "bg-blue-50 text-blue-600"
                                : v.device_type === "Tablet" ? "bg-purple-50 text-purple-600"
                                : "bg-gray-100 text-gray-600"
                              }`}>
                                {v.device_type || "—"}
                              </span>
                            </td>
                            <td className="py-2 pr-4 text-gray-600">{v.browser || "—"}</td>
                            <td className="py-2 pr-4 text-gray-600">{fmtDuration(v.duration_sec)}</td>
                            <td className="py-2 pr-4 text-gray-400 max-w-[140px] truncate">
                              {v.referrer || "Direct"}
                            </td>
                          </tr>
                        ))}
                        {data.recentVisits.length === 0 && (
                          <tr><td colSpan={7} className="py-8 text-center text-gray-400">No visits yet</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── Realtime / Referrers Tab ── */}
            {activeTab === "realtime" && (
              <div className="space-y-6">
                {/* Top Referrers */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h2 className="font-semibold text-gray-900 mb-4 text-sm flex items-center gap-2">
                    <ExternalLink size={15} className="text-amber-500" /> Top Referrers
                  </h2>
                  <div className="space-y-3">
                    {data.topReferrers.map((r, i) => {
                      const max = Number(data.topReferrers[0]?.visits || 1);
                      const pct = Math.round((Number(r.visits) / max) * 100);
                      return (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-700 truncate max-w-xs font-medium">{r.referrer}</span>
                            <span className="text-gray-500 ml-2 shrink-0">{Number(r.visits).toLocaleString()}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {data.topReferrers.length === 0 && (
                      <p className="text-gray-400 text-sm text-center py-4">No referrer data yet</p>
                    )}
                  </div>
                </div>

                {/* Google Analytics embed link */}
                {GA_MEASUREMENT_ID && (
                  <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                        <BarChart2 size={20} className="text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900 text-sm">Google Analytics 4</h3>
                        <p className="text-blue-700 text-xs mt-1 mb-3">
                          GA4 Measurement ID: <code className="bg-white px-1.5 py-0.5 rounded font-mono">{GA_MEASUREMENT_ID}</code>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: "Reports Hub", path: "reports/reportinghub" },
                            { label: "Real-time",   path: "reports/realtime" },
                            { label: "Acquisition", path: "reports/acquisition-overview" },
                            { label: "Engagement",  path: "reports/engagement-overview" },
                          ].map(({ label, path }) => (
                            <a
                              key={label}
                              href={`https://analytics.google.com/analytics/web/#/${path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-blue-600 text-xs font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition"
                            >
                              {label} <ExternalLink size={10} />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Geo Tab ── */}
            {activeTab === "geo" && (
              <div className="space-y-6">
                {/* Countries table + bar chart */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h2 className="font-semibold text-gray-900 mb-4 text-sm flex items-center gap-2">
                      <MapPin size={15} className="text-amber-500" /> Top Countries
                    </h2>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400">
                          <th className="pb-2 text-left font-medium">Country</th>
                          <th className="pb-2 text-right font-medium">Visits</th>
                          <th className="pb-2 text-right font-medium">Sessions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.topCountries.map((c, i) => (
                          <tr key={i} className="border-b border-gray-50">
                            <td className="py-2 text-gray-700 font-medium">
                              {c.country_code && (
                                <img
                                  src={`https://flagcdn.com/16x12/${c.country_code.toLowerCase()}.png`}
                                  alt={c.country}
                                  className="inline mr-2 rounded-sm"
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                              )}
                              {c.country}
                            </td>
                            <td className="py-2 text-right text-gray-600">{Number(c.visits).toLocaleString()}</td>
                            <td className="py-2 text-right text-gray-500">{Number(c.sessions).toLocaleString()}</td>
                          </tr>
                        ))}
                        {data.topCountries.length === 0 && (
                          <tr><td colSpan={3} className="py-6 text-center text-gray-400">No geo data yet</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h2 className="font-semibold text-gray-900 mb-4 text-sm">Visits by Country</h2>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart
                        data={data.topCountries.slice(0, 10).map((c) => ({
                          name: c.country,
                          Visits: Number(c.visits),
                        }))}
                        layout="vertical"
                        margin={{ left: 0, right: 20 }}
                      >
                        <XAxis type="number" tick={{ fontSize: 10 }} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                        <Tooltip />
                        <Bar dataKey="Visits" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* ── Tech Tab ── */}
            {activeTab === "tech" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Devices */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h2 className="font-semibold text-gray-900 mb-4 text-sm flex items-center gap-2">
                      <Monitor size={15} className="text-amber-500" /> Device Breakdown
                    </h2>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={data.deviceBreakdown.map((d) => ({ name: d.device, value: Number(d.visits) }))}
                          cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {data.deviceBreakdown.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-3 space-y-2">
                      {data.deviceBreakdown.map((d, i) => {
                        const Icon = d.device === "Mobile" ? Smartphone : d.device === "Tablet" ? Tablet : Monitor;
                        return (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                              <Icon size={12} className="text-gray-400" />
                              <span className="text-gray-700">{d.device}</span>
                            </div>
                            <span className="text-gray-500 font-medium">{Number(d.visits).toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Browsers */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h2 className="font-semibold text-gray-900 mb-4 text-sm flex items-center gap-2">
                      <Globe size={15} className="text-amber-500" /> Browser Breakdown
                    </h2>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={data.browserBreakdown.map((b) => ({ name: b.browser, Visits: Number(b.visits) }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="Visits" radius={[4, 4, 0, 0]}>
                          {data.browserBreakdown.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <p className="text-xs text-gray-400 text-center mt-8">
              Last updated: {fmtDateTime(data.generatedAt)} &nbsp;·&nbsp; Last {days} days &nbsp;·&nbsp; Bots excluded
            </p>
          </>
        )}
      </main>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function Admin() {
  const [token, setToken] = useState<string | null>(
    () => sessionStorage.getItem("admin_token")
  );

  if (!token) {
    return <LoginScreen onLogin={setToken} />;
  }
  return <Dashboard token={token} />;
}
