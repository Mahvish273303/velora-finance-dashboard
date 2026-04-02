import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import BalanceTrendChart from '../components/charts/BalanceTrendChart'
import ExpensePieChart from '../components/charts/ExpensePieChart'
import EmptyState from '../components/ui/EmptyState'
import Skeleton from '../components/ui/Skeleton'
import { useStore } from '../store/useStore'
import {
  getBalanceTrendData,
  getExpenseCategoryData,
  getSmartSpendingInsight,
  getTotals,
} from '../utils/transactionUtils'
import { formatCurrency, formatDateTime } from '../utils/format'
import { usePageReady } from '../utils/usePageReady'
import { AlertCircle, ArrowUpRight, History, Sparkles } from 'lucide-react'

function Dashboard() {
  const transactions = useStore((state) => state.transactions)
  const totals = getTotals(transactions)
  const trendData = getBalanceTrendData(transactions)
  const expenseData = getExpenseCategoryData(transactions)
  const smartInsight = getSmartSpendingInsight(transactions)
  const recentActivities = useStore((state) => state.recentActivities)
  const isReady = usePageReady()

  if (!isReady) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-44 w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
        </div>
        <div className="grid gap-4 xl:grid-cols-5">
          <Skeleton className="h-[24rem] w-full xl:col-span-3" />
          <Skeleton className="h-[24rem] w-full xl:col-span-2" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-12">
        <Card
          className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 text-white lg:col-span-8"
          delay={0}
        >
          <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-10 -left-8 h-32 w-32 rounded-full bg-violet-400/30" />
          <p className="text-sm text-indigo-100">Total Balance</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            {formatCurrency(totals.balance)}
          </h2>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <Sparkles size={14} />
            Up 8.1% from last month
          </div>
        </Card>

        <Card className="lg:col-span-4" delay={0.1}>
          <p className="text-sm text-slate-500 dark:text-slate-400">Cashflow Summary</p>
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60">
              <span className="text-sm text-slate-500">Income</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                +{formatCurrency(totals.income)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60">
              <span className="text-sm text-slate-500">Expenses</span>
              <span className="font-semibold text-rose-500 dark:text-rose-300">
                -{formatCurrency(totals.expenses)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ArrowUpRight size={14} />
              Updated from live transaction feed
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <StatCard title="Total Income" amount={totals.income} tone="income" />
        <StatCard title="Total Expenses" amount={totals.expenses} tone="expense" />
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3" delay={0.1}>
          <div
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${
              smartInsight.tone === 'warning'
                ? 'border-amber-100 bg-amber-50/70 dark:border-amber-900/40 dark:bg-amber-500/10'
                : smartInsight.tone === 'positive'
                  ? 'border-emerald-100 bg-emerald-50/70 dark:border-emerald-900/40 dark:bg-emerald-500/10'
                  : 'border-indigo-100 bg-indigo-50/70 dark:border-indigo-900/40 dark:bg-indigo-500/10'
            }`}
          >
            <span className="mt-0.5 rounded-full bg-white p-2 text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-300">
              <AlertCircle size={16} />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{smartInsight.title}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{smartInsight.detail}</p>
            </div>
          </div>
        </Card>

        <Card title="Recent Activity" className="lg:col-span-2" delay={0.15}>
          <div className="space-y-2">
            {recentActivities.length ? (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{activity.message}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{formatDateTime(activity.timestamp)}</p>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-3 text-xs text-slate-500 dark:bg-slate-800/40 dark:text-slate-300">
                <History size={14} />
                No recent activity yet.
              </div>
            )}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-5">
        <Card title="Balance Trend" subtitle="Running balance over time" className="xl:col-span-3" delay={0.12}>
          {trendData.length ? <BalanceTrendChart data={trendData} /> : <EmptyState />}
        </Card>
        <Card
          title="Expense Breakdown"
          subtitle="Category-wise expense distribution"
          className="xl:col-span-2 xl:mt-6"
          delay={0.18}
        >
          {expenseData.length ? <ExpensePieChart data={expenseData} /> : <EmptyState />}
        </Card>
      </section>
    </div>
  )
}

export default Dashboard
