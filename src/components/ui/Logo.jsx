function Logo() {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 text-sm font-bold text-white shadow-md">
        V
      </span>
      <div className="leading-tight">
        <p className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">Velora</p>
        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Finance OS</p>
      </div>
    </div>
  )
}

export default Logo
