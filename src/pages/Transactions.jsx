import { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import Skeleton from '../components/ui/Skeleton'
import { useStore } from '../store/useStore'
import { formatCurrency, formatDate } from '../utils/format'
import { getFilteredTransactions } from '../utils/transactionUtils'
import { usePageReady } from '../utils/usePageReady'
import { BadgeAlert, Download, Plus, Search, Shield, SlidersHorizontal, Trash2 } from 'lucide-react'

const emptyForm = {
  date: '',
  amount: '',
  category: '',
  type: 'expense',
}

function Transactions() {
  const transactions = useStore((state) => state.transactions)
  const role = useStore((state) => state.role)
  const filters = useStore((state) => state.filters)
  const setFilters = useStore((state) => state.setFilters)
  const addTransaction = useStore((state) => state.addTransaction)
  const deleteTransaction = useStore((state) => state.deleteTransaction)
  const setToast = useStore((state) => state.setToast)
  const [formValues, setFormValues] = useState(emptyForm)
  const [transactionToDelete, setTransactionToDelete] = useState(null)
  const isReady = usePageReady()

  const filteredTransactions = useMemo(
    () => getFilteredTransactions(transactions, filters),
    [transactions, filters],
  )

  const canManageTransactions = role === 'admin'

  const handleAddTransaction = (event) => {
    event.preventDefault()

    const amount = Number(formValues.amount)
    if (!formValues.date || !formValues.category || Number.isNaN(amount) || amount <= 0) {
      setToast({ type: 'error', message: 'Please enter valid transaction details.' })
      return
    }

    addTransaction({
      id: crypto.randomUUID(),
      date: formValues.date,
      amount,
      category: formValues.category.trim(),
      type: formValues.type,
    })
    setFormValues(emptyForm)
  }

  const handleDelete = () => {
    if (transactionToDelete) deleteTransaction(transactionToDelete)
    setTransactionToDelete(null)
  }

  const handleExportCsv = () => {
    const headers = ['date', 'amount', 'category', 'type']
    const rows = filteredTransactions.map((transaction) => [
      transaction.date,
      transaction.amount,
      transaction.category,
      transaction.type,
    ])
    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(','),
      )
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'velora-transactions.csv'
    anchor.click()
    URL.revokeObjectURL(url)
    setToast({ type: 'success', message: 'Transactions exported as CSV.' })
  }

  const categoryBadgeClass = (category) => {
    const colorByCategory = {
      Salary: 'bg-indigo-50 text-indigo-700',
      Freelance: 'bg-purple-50 text-purple-700',
      Food: 'bg-amber-50 text-amber-700',
      Travel: 'bg-cyan-50 text-cyan-700',
      Shopping: 'bg-pink-50 text-pink-700',
      Utilities: 'bg-emerald-50 text-emerald-700',
      Health: 'bg-rose-50 text-rose-700',
    }
    return colorByCategory[category] || 'bg-slate-100 text-slate-700'
  }

  if (!isReady) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {!canManageTransactions && (
        <Card className="border-indigo-100 bg-indigo-50/80 dark:border-indigo-900 dark:bg-indigo-500/10">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-200">
            <Shield size={16} />
            <p className="text-sm font-medium">
              Viewer mode is active. You can explore data, but adding or deleting transactions is disabled.
            </p>
          </div>
        </Card>
      )}

      {canManageTransactions && (
        <Card title="Add Transaction" subtitle="Admin controls" delay={0.04}>
          <form className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5" onSubmit={handleAddTransaction}>
            <input
              type="date"
              value={formValues.date}
              onChange={(event) => setFormValues((prev) => ({ ...prev, date: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none transition duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-indigo-900/40"
            />
            <input
              type="number"
              placeholder="Amount"
              value={formValues.amount}
              onChange={(event) => setFormValues((prev) => ({ ...prev, amount: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none transition duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-indigo-900/40"
            />
            <input
              type="text"
              placeholder="Category"
              value={formValues.category}
              onChange={(event) => setFormValues((prev) => ({ ...prev, category: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none transition duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-indigo-900/40"
            />
            <select
              value={formValues.type}
              onChange={(event) => setFormValues((prev) => ({ ...prev, type: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none transition duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-indigo-900/40"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <Button type="submit" className="gap-2">
              <Plus size={16} />
              Add Transaction
            </Button>
          </form>
        </Card>
      )}

      <Card
        title="Transactions Ledger"
        subtitle={canManageTransactions ? 'Manage records with confidence' : 'Read-only workspace'}
      >
        <div className="mb-4 flex justify-end">
          <Button variant="ghost" className="gap-2 text-xs" onClick={handleExportCsv}>
            <Download size={14} />
            Export CSV
          </Button>
        </div>
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
            Search
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(event) => setFilters({ search: event.target.value })}
                placeholder="Category name..."
                className="w-full rounded-2xl border border-slate-200 bg-white/80 py-2 pl-9 pr-3 text-sm shadow-sm outline-none transition duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-indigo-900/40"
              />
            </div>
          </label>
          <Select
            label="Type filter"
            value={filters.type}
            onChange={(event) => setFilters({ type: event.target.value })}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Income', value: 'income' },
              { label: 'Expense', value: 'expense' },
            ]}
          />
          <Select
            label="Sort by"
            value={filters.sortBy}
            onChange={(event) => setFilters({ sortBy: event.target.value })}
            options={[
              { label: 'Date', value: 'date' },
              { label: 'Amount', value: 'amount' },
            ]}
          />
          <Select
            label="Order"
            value={filters.sortOrder}
            onChange={(event) => setFilters({ sortOrder: event.target.value })}
            options={[
              { label: 'Descending', value: 'desc' },
              { label: 'Ascending', value: 'asc' },
            ]}
          />
        </div>

        {!filteredTransactions.length ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white/80 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <table className="w-full min-w-[700px] border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="text-sm transition duration-300 hover:bg-indigo-50/60 dark:hover:bg-indigo-500/10"
                  >
                    <td className="border-t border-slate-100 px-4 py-3 text-slate-600 dark:border-slate-800 dark:text-slate-300">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="border-t border-slate-100 px-4 py-3 dark:border-slate-800">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${categoryBadgeClass(transaction.category)}`}
                      >
                        {transaction.category}
                      </span>
                    </td>
                    <td className="border-t border-slate-100 px-4 py-3 capitalize text-slate-500 dark:border-slate-800 dark:text-slate-300">
                      {transaction.type}
                    </td>
                    <td
                      className={`border-t border-slate-100 px-4 py-3 font-semibold dark:border-slate-800 ${
                        transaction.type === 'income'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-500 dark:text-rose-300'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="border-t border-slate-100 px-4 py-3 text-right dark:border-slate-800">
                      {canManageTransactions ? (
                        <Button
                          variant="danger"
                          onClick={() => setTransactionToDelete(transaction.id)}
                          className="gap-1 px-3 py-1.5 text-xs"
                        >
                          <Trash2 size={13} />
                          Delete
                        </Button>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                          <BadgeAlert size={12} />
                          Read-only
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-3 inline-flex items-center gap-2 text-xs text-slate-400">
          <SlidersHorizontal size={13} />
          Filters and sorting are persisted automatically
        </div>
      </Card>

      <Modal
        isOpen={Boolean(transactionToDelete)}
        title="Delete transaction?"
        description="This action cannot be undone."
        onCancel={() => setTransactionToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}

export default Transactions
