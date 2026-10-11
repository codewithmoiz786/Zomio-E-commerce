import { memo, useEffect, useState } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";
import api from '../utils/Api'
const COLORS = {
    primary: "#F85606",
    primaryLight: "#FFF1EC",
    dark: "#1A1A1A",
    gray: "#6B7280",
    success: "#16A34A",
    border: "#E5E7EB",
    cardBg: "#FFFFFF"
};



const INCOME_DATA = [
    { month: "Jan", income: 12000 },
    { month: "Feb", income: 18000 },
    { month: "Mar", income: 15000 },
    { month: "Apr", income: 25000 },
    { month: "May", income: 30000 },
    { month: "Jun", income: 13000 },
    { month: "Jul", income: 20000 },
    { month: "Aug", income: 24000 }
];

const STATS_CARDS = [
    { label: "Total Orders", value: "2,231", growth: "+12.5%", icon: "📦" },
    { label: "Total Sales", value: "", growth: "+17.2%", icon: "💰" },
    { label: "Total Customers", value: "", growth: "+5.4%", icon: "👥" },
    { label: "Total Products", value: "", growth: "+8.1%", icon: "🛍️" }
];

const StatCard = memo(({ label, value, growth, icon }) => {
    const isPositive = growth.startsWith("+");
    return (
        <div className="bg-white border rounded-xl p-4 sm:p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group" style={{ borderColor: COLORS.border }}>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="text-2xl sm:text-3xl rounded-xl p-3 group-hover:scale-110 transition-transform" style={{ backgroundColor: COLORS.primaryLight }}>
                        {icon}
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-medium" style={{ color: COLORS.gray }}>{label}</p>
                        <p className="mt-1 font-bold text-xl sm:text-2xl lg:text-3xl" style={{ color: COLORS.dark }}>{value}</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-1 mt-3 sm:mt-4 pt-3 border-t" style={{ borderColor: COLORS.border }}>
                <span className="text-sm font-bold" style={{ color: isPositive ? COLORS.success : "#DC2626" }}>
                    {growth}
                </span>
                <span className="text-xs" style={{ color: COLORS.gray }}>vs last week</span>
            </div>
        </div>
    );
});
StatCard.displayName = "StatCard";

export default function DashboardChart() {
    const [OrderDetails, setOrderDetails] = useState([])
    const [Customers, setCustomers] = useState(null)
    const [Product, setProduct] = useState(null)
    async function fetchAll() {
        let res1 = await api("/order/incomeCharts", { method: "GET" })
        setOrderDetails(res1)

        let res2 = await api('/auth/getAllUsers', { method: "GET" })
        setCustomers(res2.allUsers.length)

        let res3 = await api("/upload/getProducts", { method: "GET" })
        setProduct(res3.products.length)
    }
    useEffect(() => {
        fetchAll()
    }, [])

    STATS_CARDS[0].value = OrderDetails.totalOrders || 0
    STATS_CARDS[1].value = OrderDetails.sales || 0
    STATS_CARDS[2].value = Customers || 0
    STATS_CARDS[3].value = Product || 0

    const [chartHeight, setChartHeight] = useState(300);

    useEffect(() => {
        const updateHeight = () => {
            if (window.innerWidth < 640) setChartHeight(240);
            else if (window.innerWidth < 1024) setChartHeight(280);
            else setChartHeight(320);
        };
        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    const formatYAxis = (tick) => `${(tick / 1000)}k`;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-xl shadow-2xl border" style={{ borderColor: COLORS.border }}>
                    <p className="font-bold text-sm" style={{ color: COLORS.dark }}>{label}</p>
                    <p className="text-sm font-semibold mt-1" style={{ color: COLORS.primary }}>
                        PKR {payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full min-h-screen bg-[#F9FAFB] px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-5 sm:mb-6">
                    <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl" style={{ color: COLORS.dark }}> Admin dashboard</h1>
                    <p className="text-sm mt-1" style={{ color: COLORS.gray }}>Here's what's happening with your store.</p>
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-5 sm:mb-7">
                    {STATS_CARDS.map((card) => (
                        <StatCard key={card.label} {...card} />
                    ))}
                </div>

                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl border shadow-sm" style={{ borderColor: COLORS.border }}>
                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                        <h2 className="font-bold text-lg sm:text-xl" style={{ color: COLORS.dark }}>Monthly Income</h2>
                        <div className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }}>
                            Last 8 Months
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={chartHeight}>
                        <LineChart data={INCOME_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
                            <XAxis dataKey="month" stroke={COLORS.gray} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis stroke={COLORS.gray} tick={{ fontSize: 11 }} tickFormatter={formatYAxis} width={45} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: COLORS.primary, strokeWidth: 1 }} />
                            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                            <Line
                                type="monotone"
                                dataKey="income"
                                name="Income"
                                stroke={COLORS.primary}
                                strokeWidth={3}
                                fill="url(#colorIncome)"
                                dot={{ r: 4, fill: COLORS.primary, strokeWidth: 2, stroke: "#fff" }}
                                activeDot={{ r: 6, stroke: COLORS.primary, strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
