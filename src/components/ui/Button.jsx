function Button({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  onClick,
  className = '',
}) {
  const styles = {
    primary:
      'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md hover:scale-105 hover:shadow-xl active:scale-95 disabled:from-indigo-300 disabled:to-violet-300 disabled:hover:scale-100 disabled:hover:shadow-md',
    ghost:
      'bg-white/70 text-slate-700 shadow-sm hover:scale-105 hover:bg-white hover:shadow-lg active:scale-95 dark:bg-slate-800/70 dark:text-slate-100 dark:hover:bg-slate-800',
    danger:
      'bg-rose-50 text-rose-600 shadow-sm hover:scale-105 hover:bg-rose-100 hover:shadow-md active:scale-95 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition duration-300 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
