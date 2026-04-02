import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/insights', label: 'Insights' },
]

function Sidebar() {
  return (
    <aside className="w-full border-b border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="mb-6 text-xl font-bold text-slate-900 dark:text-slate-100">Velora</div>
      <nav className="flex gap-2 md:flex-col">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
