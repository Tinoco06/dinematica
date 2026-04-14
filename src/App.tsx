import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { Navigation } from '@/components/layout/Navigation'
import { Loader } from '@/components/ui/Loader'
import { CustomCursor } from '@/components/layout/CustomCursor'
import { Home } from '@/pages/Home'
import { ProjectDetail } from '@/pages/ProjectDetail'

function AnimatedRoutes({ isReady }: { isReady: boolean }) {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home isReady={isReady} />} />
          <Route path="/proyecto/:slug" element={<ProjectDetail />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <BrowserRouter>
      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}

      <CustomCursor />

      <SmoothScroll>
        <Navigation isReady={!isLoading} />

        <AnimatedRoutes isReady={!isLoading} />
      </SmoothScroll>
    </BrowserRouter>
  )
}

export default App
