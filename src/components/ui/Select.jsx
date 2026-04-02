function Select({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
      {label}
      <select
        value={value}
        onChange={onChange}
        className="rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-slate-900 shadow-sm outline-none transition duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-900/40"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default Select
