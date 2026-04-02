import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '../../utils/format'
import { useStore } from '../../store/useStore'

const COLORS = ['#6366F1', '#8B5CF6', '#22C55E', '#14B8A6', '#FB7185', '#F59E0B']

function ExpenseTooltipContent({ active, payload, theme }) {
  if (!active || !payload?.length) return null

  const isDark = theme === 'dark'
  const point = payload[0]

  return (
    <div
      className={`rounded-xl border px-4 py-2 shadow-lg ${
        isDark
          ? 'border-gray-700 bg-gray-900 text-gray-100'
          : 'border-gray-200 bg-white text-gray-800'
      }`}
    >
      <p className={`text-sm font-medium ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
        {point.name}
      </p>
      <p className="mt-1 text-sm font-bold text-indigo-600 dark:text-indigo-300">
        {formatCurrency(point.value)}
      </p>
    </div>
  )
}

function ExpensePieChart({ data }) {
  const theme = useStore((state) => state.theme)

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="44%"
            outerRadius={95}
            innerRadius={58}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<ExpenseTooltipContent theme={theme} />} />
          <Legend verticalAlign="bottom" iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ExpensePieChart
