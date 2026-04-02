import Card from '../components/ui/Card'
import Skeleton from '../components/ui/Skeleton'
import { useStore } from '../store/useStore'
import { buildInsights } from '../services/insightsService'
import { formatCurrency } from '../utils/format'
import { usePageReady } from '../utils/usePageReady'
import { CircleDollarSign, Layers3, TrendingDown, Trophy } from 'lucide-react'

function Insights() {
  const transactions = useStore((state) => state.transactions)
  const insights = buildInsights(transactions)
  const isReady = usePageReady()

  const monthComparisonLabel =
    insights.currentMonth && insights.previousMonth
      ? `${insights.currentMonth} vs ${insights.previousMonth}`
      : 'Latest month'

  if (!isReady) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Highest Spending Category" delay={0.03}>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{insights.highestSpendingCategory}</p>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-300">
            <TrendingDown size={18} />
          </span>
        </div>
      </Card>
      <Card title="Expense Change (MoM)" subtitle={monthComparisonLabel} delay={0.08}>
        <p
          className={`text-2xl font-bold ${
            insights.monthOverMonthExpense > 0
              ? 'text-rose-500 dark:text-rose-300'
              : 'text-emerald-600 dark:text-emerald-400'
          }`}
        >
          {insights.monthOverMonthExpense > 0 ? '+' : ''}
          {formatCurrency(insights.monthOverMonthExpense)}
        </p>
        <div className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
          <Layers3 size={18} />
        </div>
      </Card>
      <Card title="Most Frequent Category" delay={0.12}>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{insights.mostFrequentCategory}</p>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
            <Trophy size={18} />
          </span>
        </div>
      </Card>
      <Card title="Largest Transaction" delay={0.16}>
        {insights.largestTransaction ? (
          <div>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatCurrency(insights.largestTransaction.amount)}
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {insights.largestTransaction.category} ({insights.largestTransaction.type})
            </p>
            <div className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
              <CircleDollarSign size={18} />
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">No transactions available</p>
        )}
      </Card>
    </div>
  )
}

export default Insights
