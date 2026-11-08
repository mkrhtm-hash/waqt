import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import TrustBar from './components/TrustBar'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BottomNav from './components/BottomNav'
import WhatsAppButton from './components/WhatsAppButton'
import Toaster from './components/Toaster'
import CompareTray from './components/CompareTray'
import DbStatusBanner from './components/DbStatusBanner'
import RequireAuth from './components/RequireAuth'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Brand from './pages/Brand'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Compare from './pages/Compare'
import Bag from './pages/Bag'
import Checkout from './pages/Checkout'
import Success from './pages/Success'
import Appointments from './pages/Appointments'
import Account from './pages/Account'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()
  return (
    <div className="grain relative min-h-screen overflow-x-clip">
      <ScrollToTop />
      <DbStatusBanner />
      <TrustBar />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/brands/:slug" element={<Brand />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/watch/:id" element={<Product />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          {/* signed-in clients only */}
          <Route path="/bag" element={<RequireAuth><Bag /></RequireAuth>} />
          <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
          <Route path="/success/:orderId" element={<RequireAuth><Success /></RequireAuth>} />
          <Route path="/appointments" element={<RequireAuth><Appointments /></RequireAuth>} />
          <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <CompareTray />
      <WhatsAppButton />
      <BottomNav />
      <Toaster />
    </div>
  )
}
