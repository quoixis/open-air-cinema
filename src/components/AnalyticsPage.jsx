import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Header from "./Header";
import {
  fetchAnalytics,
  selectRegistrationsByDate,
  selectRegistrationsByEvent,
} from "../store/analyticsSlice";

function AnalyticsPage() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.analytics.loading);
  const error = useSelector((state) => state.analytics.error);

  const byDate = useSelector(selectRegistrationsByDate);
  const byEvent = useSelector(selectRegistrationsByEvent);

  const total = useSelector((state) => state.analytics.registrations.length);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  const uniqueEvents = byEvent.length;

  const maxDay = byDate.length
    ? byDate.reduce((max, d) => (d.count > max.count ? d : max), byDate[0])
    : null;

  return (
    <div className="app">
      <Header showSearch={false} />

      <div className="analytics-page">
        <h2 className="analytics-title">Аналітика реєстрацій</h2>

        {loading && (
          <div className="spinner-wrapper">
            <div className="spinner" />
            <p>Завантаження даних...</p>
          </div>
        )}

        {error && <div className="error-toast">Помилка: {error}</div>}

        {!loading && !error && total > 0 && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-number">{total}</span>
                <span className="stat-label">Всього реєстрацій</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{uniqueEvents}</span>
                <span className="stat-label">Подій з реєстраціями</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{maxDay ? maxDay.count : 0}</span>
                <span className="stat-label">
                  Макс. за день ({maxDay ? maxDay.date : "—"})
                </span>
              </div>
            </div>

            <div className="chart-wrapper">
              <h3 className="chart-title">Активність реєстрацій на події за датами</h3>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={byDate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  
                  <XAxis
                    dataKey="date"
                    stroke="#999"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(val) => val.slice(5)}
                  />
                  <YAxis stroke="#999" tick={{ fontSize: 12 }} />

                  <Tooltip
                    contentStyle={{
                      background: "#1c1c1c",
                      border: "1px solid #333",
                      borderRadius: 8
                    }}
                    labelStyle={{ color: "#eaeaea" }}
                    itemStyle={{ color: "#ff3b6a" }}
                  />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Реєстрацій"
                    stroke="#ff3b6a"
                    strokeWidth={2}
                    dot={{ fill: "#ff3b6a", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-wrapper">
              <h3 className="chart-title">Реєстрації по подіях</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={byEvent}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis
                    dataKey="title"
                    stroke="#999"
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="#999" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "#1c1c1c",
                      border: "1px solid #333",
                      borderRadius: 8
                    }}
                    labelStyle={{ color: "#eaeaea" }}
                    itemStyle={{ color: "#ff3b6a" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="count"
                    name="Реєстрацій"
                    fill="#ff3b6a"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AnalyticsPage;