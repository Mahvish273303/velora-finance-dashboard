import { useEffect, useState } from 'react'

export const usePageReady = (delay = 550) => {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return isReady
}
