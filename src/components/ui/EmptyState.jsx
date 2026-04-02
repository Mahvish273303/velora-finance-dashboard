import { Inbox } from 'lucide-react'

function EmptyState({ message = 'No transactions available' }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm dark:bg-slate-900">
        <Inbox size={18} />
      </span>
      {message}
    </div>
  )
}

export default EmptyState
