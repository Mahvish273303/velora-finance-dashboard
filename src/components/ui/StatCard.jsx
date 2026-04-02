import Card from './Card'
import { formatCurrency } from '../../utils/format'
import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react'

function StatCard({ title, amount, tone = 'neutral' }) {
  const tones = {
    neutral: 'text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800',
    income: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10',
    expense: 'text-rose-500 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/10',
  }
  const icons = {
    neutral: <Wallet size={16} />,
    income: <ArrowUpRight size={16} />,
    expense: <ArrowDownRight size={16} />,
  }

  return (
    <Card className="relative overflow-hidden" delay={0.08}>
      <div className="absolute -right-6 -top-8 h-20 w-20 rounded-full bg-indigo-50 dark:bg-indigo-500/10" />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <p className={`mt-2 text-3xl font-semibold tracking-tight ${tone === 'neutral' ? 'text-slate-900 dark:text-slate-100' : ''}`}>
        {formatCurrency(amount)}
      </p>
      <div className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
        {icons[tone]}
        {tone === 'income' ? 'Incoming' : tone === 'expense' ? 'Outgoing' : 'Current'}
      </div>
    </Card>
  )
}

export default StatCard
