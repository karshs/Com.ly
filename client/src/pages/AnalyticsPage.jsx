import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { analyticsApi } from '../api/analytics.api';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { ArrowLeft } from 'lucide-react';
import './AnalyticsPage.css';

const PIE_COLORS = ['#0c56e9', '#3b82f6', '#93c5fd', '#cbd5e1'];

export const AnalyticsPage = () => {
  const { linkId } = useParams();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [timeseries, setTimeseries] = useState([]);
  const [devices, setDevices] = useState([]);
  const [referrers, setReferrers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllAnalytics = async () => {
      try {
        setLoading(true);
        const [overviewRes, timeseriesRes, devicesRes, referrersRes] = await Promise.all([
          analyticsApi.getOverview(linkId),
          analyticsApi.getTimeseries(linkId),
          analyticsApi.getDevices(linkId),
          analyticsApi.getReferrers(linkId),
        ]);

        setOverview(overviewRes);
        setTimeseries(timeseriesRes.data || []);
        setDevices(devicesRes.data || []);
        setReferrers(referrersRes.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };

    if (linkId) {
      fetchAllAnalytics();
    }
  }, [linkId]);

  if (loading) {
    return (
      <div className="analytics-container">
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>
          Loading link analytics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-container">
        <Link to="/dashboard" className="analytics-back-link">
          <ArrowLeft size={16} /> Back to Links
        </Link>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      {/* Top Navigation */}
      <div className="analytics-top-nav">
        <Link to="/dashboard" className="analytics-back-link">
          <ArrowLeft size={16} /> Back to all links
        </Link>
      </div>

      <div className="analytics-header">
        <h1 className="analytics-title">Performance Overview</h1>
      </div>

      {/* Overview Stat Cards */}
      <div className="analytics-stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Engagements</span>
          <span className="stat-value">{overview?.totalClicks || 0}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Active Days</span>
          <span className="stat-value">{overview?.uniqueDays || 0}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Top Device</span>
          <span className="stat-value" style={{ fontSize: '22px' }}>
            {overview?.topDevice || 'N/A'}
          </span>
        </div>
      </div>

      {/* Main Clicks Over Time Chart */}
      <div className="chart-card">
        <div className="chart-card-header">
          <h3 className="chart-card-title">Clicks Over Time (Last 30 Days)</h3>
        </div>
        <div className="chart-wrapper">
          {timeseries.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              No click timeline data yet. Share your short link to record clicks!
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeseries} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0c56e9" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0c56e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#0c56e9"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#clicksGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Devices & Referrers Breakdown Grid */}
      <div className="analytics-breakdown-grid">
        {/* Device Breakdown */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Device Types</h3>
          </div>
          <div className="chart-wrapper" style={{ height: 260 }}>
            {devices.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                No device data available.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={devices}
                    dataKey="count"
                    nameKey="device"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    {devices.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Top Traffic Referrers</h3>
          </div>
          <div className="chart-wrapper" style={{ height: 260 }}>
            {referrers.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                No referrer data available.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={referrers}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                  <YAxis type="category" dataKey="referrer" stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0c56e9" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
