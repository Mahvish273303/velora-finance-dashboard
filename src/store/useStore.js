import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { initialTransactions } from '../data/transactions'

const defaultFilters = {
  search: '',
  type: 'all',
  sortBy: 'date',
  sortOrder: 'desc',
}

const validRoles = ['viewer', 'admin']
const MAX_ACTIVITY_ITEMS = 6

const createActivity = (message) => ({
  id: crypto.randomUUID(),
  message,
  timestamp: new Date().toISOString(),
})

const appendActivity = (activities, message) =>
  [createActivity(message), ...activities].slice(0, MAX_ACTIVITY_ITEMS)

export const useStore = create(
  persist(
    (set) => ({
      transactions: initialTransactions,
      role: 'viewer',
      theme: 'light',
      filters: defaultFilters,
      recentActivities: [],
      toast: null,
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
          recentActivities: appendActivity(
            state.recentActivities,
            `Added ${transaction.category} (${transaction.type}) for $${transaction.amount}.`,
          ),
          toast: { type: 'success', message: 'Transaction added successfully.' },
        })),
      deleteTransaction: (id) =>
        set((state) => {
          const target = state.transactions.find((transaction) => transaction.id === id)
          const deletedMessage = target
            ? `Deleted ${target.category} (${target.type}) for $${target.amount}.`
            : 'Deleted a transaction.'

          return {
            transactions: state.transactions.filter((transaction) => transaction.id !== id),
            recentActivities: appendActivity(state.recentActivities, deletedMessage),
            toast: { type: 'success', message: 'Transaction deleted successfully.' },
          }
        }),
      setRole: (role) =>
        set((state) => {
          const nextRole = validRoles.includes(role) ? role : 'viewer'
          return {
            role: nextRole,
            recentActivities: appendActivity(
              state.recentActivities,
              `Switched access role to ${nextRole}.`,
            ),
            toast: {
              type: 'success',
              message: `Role switched to ${nextRole}.`,
            },
          }
        }),
      setTheme: (theme) => set({ theme }),
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
      clearFilters: () => set({ filters: defaultFilters }),
      setToast: (toast) => set({ toast }),
      clearToast: () => set({ toast: null }),
    }),
    {
      name: 'finance-dashboard-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        filters: state.filters,
        theme: state.theme,
        recentActivities: state.recentActivities,
      }),
    },
  ),
)
