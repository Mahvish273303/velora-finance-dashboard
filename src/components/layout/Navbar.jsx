import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Bell, Moon, ShieldCheck, Sun, UserCircle2 } from 'lucide-react'
import { useStore } from '../../store/useStore'
import Tooltip from '../ui/Tooltip'
import Logo from '../ui/Logo'
import Select from '../ui/Select'

const navLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/insights', label: 'Insights' },
]

function Navbar() {
  const roleInStore = useStore((state) => state.role)
  const theme = useStore((state) => state.theme)
  const setRole = useStore((state) => state.setRole)
  const setTheme = useStore((state) => state.setTheme)
  const [selectedRole, setSelectedRole] = useState(roleInStore)

  useEffect(() => {
    setSelectedRole(roleInStore)
  }, [roleInStore])

  const handleRoleChange = (event) => {
    const nextRole = event.target.value
    setSelectedRole(nextRole)
    setRole(nextRole)
  }

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const isAdmin = roleInStore === 'admin'
  const displayName = isAdmin ? 'Mahvish Pathan' : 'Viewer Mode'
  const roleLabel = isAdmin ? 'Admin' : 'Viewer'

  return (
    <header className="mb-6 rounded-2xl border-b border-gray-100 bg-white/80 p-4 shadow-md backdrop-blur-md transition duration-300 dark:border-gray-800 dark:bg-slate-900/70">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Logo />

        <nav className="order-3 w-full md:order-2 md:w-auto">
          <div className="inline-flex rounded-2xl bg-slate-100/90 p-1 dark:bg-slate-800">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-2 text-sm font-semibold transition duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="order-2 flex items-end gap-2 md:order-3">
          <div>
            <Select
              label="Access"
              value={selectedRole}
              onChange={handleRoleChange}
              options={[
                { label: 'Viewer', value: 'viewer' },
                { label: 'Admin', value: 'admin' },
              ]}
            />
          </div>
          <Tooltip text="Notifications">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full p-2 text-gray-600 shadow-sm transition duration-300 hover:scale-105 hover:bg-gray-100 hover:text-indigo-600 hover:shadow-md active:scale-95 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
            >
              <Bell size={18} />
            </button>
          </Tooltip>
          <Tooltip text={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
            <button
              type="button"
              onClick={handleThemeToggle}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full p-2 text-gray-600 shadow-sm transition duration-300 hover:scale-105 hover:bg-gray-100 hover:text-indigo-600 hover:shadow-md active:scale-95 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </Tooltip>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <UserCircle2 size={18} />
            <div className="hidden sm:flex sm:flex-col sm:leading-tight">
              <span>{displayName}</span>
              <span className="text-[11px] font-normal text-gray-400">{roleLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-2xl bg-indigo-50/70 px-3 py-2 text-xs text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">
        <ShieldCheck size={15} />
        <span>
          Current mode: <span className="font-semibold capitalize">{selectedRole}</span>
        </span>
      </div>
    </header>
  )
}

export default Navbar
