const toTimestamp = (value) => new Date(value).getTime()

export const getTotals = (transactions) =>
  transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') acc.income += transaction.amount
      if (transaction.type === 'expense') acc.expenses += transaction.amount
      acc.balance = acc.income - acc.expenses
      return acc
    },
    { income: 0, expenses: 0, balance: 0 },
  )

export const getFilteredTransactions = (transactions, filters) => {
  const { search, type, sortBy, sortOrder } = filters
  const filtered = transactions.filter((transaction) => {
    const categoryMatch = transaction.category
      .toLowerCase()
      .includes(search.toLowerCase())
    const typeMatch = type === 'all' ? true : transaction.type === type
    return categoryMatch && typeMatch
  })

  return filtered.sort((a, b) => {
    const direction = sortOrder === 'asc' ? 1 : -1
    if (sortBy === 'amount') return (a.amount - b.amount) * direction
    return (toTimestamp(a.date) - toTimestamp(b.date)) * direction
  })
}

export const getBalanceTrendData = (transactions) => {
  const sorted = [...transactions].sort((a, b) => toTimestamp(a.date) - toTimestamp(b.date))
  let runningBalance = 0

  return sorted.map((transaction) => {
    runningBalance += transaction.type === 'income' ? transaction.amount : -transaction.amount
    return {
      date: transaction.date,
      balance: runningBalance,
    }
  })
}

export const getExpenseCategoryData = (transactions) => {
  const expenseMap = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'expense') {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
    }
    return acc
  }, {})

  return Object.entries(expenseMap).map(([name, value]) => ({ name, value }))
}

export const getInsights = (transactions) => {
  if (!transactions.length) {
    return {
      highestSpendingCategory: 'N/A',
      monthOverMonthExpense: 0,
      mostFrequentCategory: 'N/A',
      largestTransaction: null,
    }
  }

  const expenseByCategory = {}
  const frequencyByCategory = {}
  const expensesByMonth = {}
  let largestTransaction = transactions[0]

  transactions.forEach((transaction) => {
    if (transaction.amount > largestTransaction.amount) largestTransaction = transaction

    frequencyByCategory[transaction.category] = (frequencyByCategory[transaction.category] || 0) + 1

    if (transaction.type === 'expense') {
      expenseByCategory[transaction.category] = (expenseByCategory[transaction.category] || 0) + transaction.amount
      const monthKey = transaction.date.slice(0, 7)
      expensesByMonth[monthKey] = (expensesByMonth[monthKey] || 0) + transaction.amount
    }
  })

  const months = Object.keys(expensesByMonth).sort()
  const currentMonth = months.at(-1)
  const previousMonth = months.at(-2)
  const currentValue = currentMonth ? expensesByMonth[currentMonth] : 0
  const previousValue = previousMonth ? expensesByMonth[previousMonth] : 0
  const monthOverMonthExpense = previousValue === 0 ? currentValue : currentValue - previousValue

  const highestSpendingCategory =
    Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
  const mostFrequentCategory =
    Object.entries(frequencyByCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

  return {
    highestSpendingCategory,
    monthOverMonthExpense,
    mostFrequentCategory,
    largestTransaction,
    currentMonth,
    previousMonth,
  }
}

export const getSmartSpendingInsight = (transactions) => {
  if (!transactions.length) {
    return {
      tone: 'neutral',
      title: 'No spending trend yet',
      detail: 'Add more records to unlock monthly spending signals.',
    }
  }

  const expenseByMonth = {}
  const foodByMonth = {}

  transactions.forEach((transaction) => {
    if (transaction.type !== 'expense') return
    const monthKey = transaction.date.slice(0, 7)
    expenseByMonth[monthKey] = (expenseByMonth[monthKey] || 0) + transaction.amount
    if (transaction.category.toLowerCase() === 'food') {
      foodByMonth[monthKey] = (foodByMonth[monthKey] || 0) + transaction.amount
    }
  })

  const months = Object.keys(expenseByMonth).sort()
  const currentMonth = months.at(-1)
  const previousMonth = months.at(-2)
  const currentExpense = currentMonth ? expenseByMonth[currentMonth] || 0 : 0
  const previousExpense = previousMonth ? expenseByMonth[previousMonth] || 0 : 0
  const currentFood = currentMonth ? foodByMonth[currentMonth] || 0 : 0
  const previousFood = previousMonth ? foodByMonth[previousMonth] || 0 : 0

  if (previousFood > 0 && currentFood > previousFood) {
    const increase = Math.round(((currentFood - previousFood) / previousFood) * 100)
    return {
      tone: 'warning',
      title: `Spending on Food increased by ${increase}%`,
      detail: 'Consider setting a weekly dining budget to balance monthly cashflow.',
    }
  }

  if (previousExpense > 0 && currentExpense < previousExpense) {
    const decrease = Math.round(((previousExpense - currentExpense) / previousExpense) * 100)
    return {
      tone: 'positive',
      title: `You saved ${decrease}% more this month`,
      detail: 'Great momentum. Keep this pace for a healthier monthly runway.',
    }
  }

  return {
    tone: 'neutral',
    title: 'Spending is stable month over month',
    detail: 'Your expenses are within the expected range. Keep monitoring key categories.',
  }
}
