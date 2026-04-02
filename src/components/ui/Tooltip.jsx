function Tooltip({ text, children }) {
  return (
    <div className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute -top-10 left-1/2 z-20 -translate-x-1/2 rounded-xl bg-slate-900 px-2.5 py-1 text-xs text-white opacity-0 shadow-lg transition duration-300 group-hover:opacity-100 dark:bg-slate-700">
        {text}
      </span>
    </div>
  )
}

export default Tooltip
