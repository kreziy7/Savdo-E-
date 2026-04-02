import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const tooltipStyle = {
  backgroundColor: "#0e2037",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  color: "#fff",
  fontSize: "12px"
};

export function UserActivityChart({ data }) {
  return (
    <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white text-sm">Haftalik foydalanuvchilar</h3>
        <span className="text-xs text-white/60">Jami va faol</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(255,255,255,0.1)" }} />
          <Line type="monotone" dataKey="users" stroke="#2563c9" strokeWidth={2} dot={false} name="Jami" />
          <Line type="monotone" dataKey="active" stroke="#1f9d67" strokeWidth={2} dot={false} name="Faol" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OrderRevenueChart({ data }) {
  return (
    <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white text-sm">Oylik buyurtmalar</h3>
        <span className="text-xs text-white/60">So'nggi 6 oy</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} formatter={(v, n) => n === "revenue" ? [`${(v / 1000000).toFixed(1)}M`, "Daromad"] : [v, "Buyurtma"]} />
          <Bar dataKey="orders" fill="#2563c9" radius={[4, 4, 0, 0]} name="Buyurtmalar" />
          <Bar dataKey="revenue" fill="#1f9d67" radius={[4, 4, 0, 0]} name="Daromad" hide />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
