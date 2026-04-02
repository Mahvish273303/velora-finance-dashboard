import {
  Area,
  AreaChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { formatCurrency, formatDate } from '../../utils/format'
import { useStore } from '../../store/useStore'

function BalanceTooltipContent({ active, payload, label, theme }) {
  if (!active || !payload?.length) return null

  const isDark = theme === 'dark'
  return (
    <div
      className={`rounded-xl border px-4 py-2 shadow-lg ${
        isDark
          ? 'border-gray-700 bg-gray-900 text-gray-100'
          : 'border-gray-200 bg-white text-gray-800'
      }`}
    >
      <p className={`text-sm font-medium ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
        {formatDate(label)}
      </p>
      <p className="mt-1 text-sm font-bold text-indigo-600 dark:text-indigo-300">
        Balance: {formatCurrency(payload[0].value)}
      </p>
    </div>
  )
}

function BalanceTrendChart({ data }) {
  const theme = useStore((state) => state.theme)

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.36} />
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#CBD5E1" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => formatDate(value)}
            tick={{ fill: '#64748B', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
            tick={{ fill: '#64748B', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<BalanceTooltipContent theme={theme} />} />
          <Area type="monotone" dataKey="balance" fill="url(#balanceFill)" stroke="none" />
          <Line type="monotone" dataKey="balance" stroke="#4F46E5" strokeWidth={3} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BalanceTrendChart
