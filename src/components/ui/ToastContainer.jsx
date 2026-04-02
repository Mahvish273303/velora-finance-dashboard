import { useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { motion, AnimatePresence } from 'framer-motion'

function ToastContainer() {
  const toast = useStore((state) => state.toast)
  const clearToast = useStore((state) => state.clearToast)

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => clearToast(), 2500)
    return () => clearTimeout(timer)
  }, [toast, clearToast])

  if (!toast) return null
  const MotionDiv = motion.div

  const toneClass =
    toast.type === 'error'
      ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200'
      : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        <MotionDiv
          key={toast.message}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={`rounded-2xl px-4 py-3 text-sm font-medium shadow-xl ${toneClass}`}
        >
          {toast.message}
        </MotionDiv>
      </AnimatePresence>
    </div>
  )
}

export default ToastContainer
