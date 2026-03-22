import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { PageTransition } from './components/ui/PageTransition'
import { LandingScreen } from './screens/LandingScreen'
import { ScanScreen } from './screens/ScanScreen'
import { ResultsScreen } from './screens/ResultsScreen'
import { WardrobeScreen } from './screens/WardrobeScreen'
import { ImpactScreen } from './screens/ImpactScreen'
import { useWardrobe } from './hooks/useWardrobe'

function AppLayout() {
  const { wardrobe } = useWardrobe()
  return (
    <>
      <Header wardrobeCount={wardrobe.length} />
      <PageTransition>
        <Routes>
          <Route path="/" element={<LandingScreen />} />
          <Route path="/scan" element={<ScanScreen />} />
          <Route path="/results" element={<ResultsScreen />} />
          <Route path="/wardrobe" element={<WardrobeScreen />} />
          <Route path="/impact" element={<ImpactScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageTransition>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-dvh flex justify-center" style={{ background: '#050705' }}>
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(139,168,112,0.05) 0%, transparent 60%)' }}
        />
        <div
          className="relative w-full max-w-[430px] min-h-dvh bg-background overflow-x-clip"
          style={{ boxShadow: '0 0 80px rgba(0,0,0,0.9), 0 0 40px rgba(139,168,112,0.04)' }}
        >
          <AppLayout />
        </div>
      </div>
    </BrowserRouter>
  )
}
