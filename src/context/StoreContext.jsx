import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../lib/api'
import { invalidate } from '../lib/useApi'
import { currencies } from '../config/currency'

const StoreContext = createContext(null)
const PENDING_KEY = 'waqt-pending-action'

function usePersisted(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage unavailable */ }
  }, [key, value])
  return [value, setValue]
}

export function StoreProvider({ children }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  // ─── UI preferences (local, synced to the account when signed in) ───
  const [currency, setCurrencyState] = usePersisted('waqt-currency', 'AED')
  const [theme, setTheme] = usePersisted('waqt-theme', 'dark')
  const [compare, setCompare] = usePersisted('waqt-compare-v2', [])

  // ─── session + user data (from the API) ───
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [cart, setCart] = useState([]) // [{ watchId, quantity, watch }]
  const [wishlist, setWishlist] = useState([]) // [watch]
  const [cartReady, setCartReady] = useState(false)
  const [toasts, setToasts] = useState([])
  const toastId = useRef(0)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#050507' : '#f8f4ea')
  }, [theme])

  const toast = useCallback((message, type = 'success') => {
    const id = ++toastId.current
    setToasts((ts) => [...ts, { id, message, type }])
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 4200)
  }, [])
  const dismissToast = useCallback((id) => setToasts((ts) => ts.filter((x) => x.id !== id)), [])

  /** Friendly, translated message for any API error. */
  const errorText = useCallback((err) => {
    if (!err) return t('errors.generic')
    const key = `errors.${err.code}`
    return i18n.exists(key) ? t(key) : t('errors.generic')
  }, [t, i18n])
  const toastError = useCallback((err) => toast(errorText(err), 'error'), [toast, errorText])

  // ─── load private data for a signed-in user ───
  const loadPrivate = useCallback(async () => {
    const [c, w] = await Promise.all([api('/cart'), api('/wishlist')])
    setCart(c.items)
    setWishlist(w.watches)
    setCartReady(true)
  }, [])

  const applyPrefs = useCallback((u) => {
    if (!u) return
    if (u.preferredCurrency && currencies[u.preferredCurrency]) setCurrencyState(u.preferredCurrency)
    if (u.preferredLanguage && u.preferredLanguage !== i18n.language) i18n.changeLanguage(u.preferredLanguage)
  }, [i18n, setCurrencyState])

  useEffect(() => {
    let alive = true
    api('/auth/me')
      .then(async ({ user: u }) => {
        if (!alive) return
        setUser(u)
        if (u) {
          applyPrefs(u)
          await loadPrivate().catch(() => {})
        }
      })
      .catch(() => {})
      .finally(() => { if (alive) { setAuthReady(true); setCartReady(true) } })
    return () => { alive = false }
  }, [applyPrefs, loadPrivate])

  // save currency / language to the account when they change
  const savePrefs = useCallback((patch) => {
    if (!user) return
    api('/account', { method: 'PATCH', body: patch })
      .then(({ user: u }) => setUser(u))
      .catch(() => {})
  }, [user])

  const setCurrency = useCallback((c) => {
    setCurrencyState(c)
    if (user && user.preferredCurrency !== c) savePrefs({ preferredCurrency: c })
  }, [setCurrencyState, savePrefs, user])

  useEffect(() => {
    const onLang = (lng) => {
      if (user && user.preferredLanguage !== lng && (lng === 'en' || lng === 'ar')) savePrefs({ preferredLanguage: lng })
    }
    i18n.on('languageChanged', onLang)
    return () => i18n.off('languageChanged', onLang)
  }, [i18n, user, savePrefs])

  // ─── auth ───
  const runPending = useCallback(async () => {
    let pending = null
    try { pending = JSON.parse(sessionStorage.getItem(PENDING_KEY) || 'null') } catch { /* ignore */ }
    sessionStorage.removeItem(PENDING_KEY)
    if (!pending?.watchId) return
    try {
      if (pending.type === 'bag') {
        const { items } = await api('/cart', { method: 'POST', body: { watchId: pending.watchId } })
        setCart(items)
        toast(t('toast.addedBag'))
      } else if (pending.type === 'wish') {
        const { watches } = await api('/wishlist', { method: 'POST', body: { watchId: pending.watchId } })
        setWishlist(watches)
        toast(t('toast.addedWish'))
      }
    } catch (err) {
      toastError(err)
    }
  }, [t, toast, toastError])

  const afterAuth = useCallback(async (u) => {
    setUser(u)
    applyPrefs(u)
    invalidate('/stats')
    await loadPrivate().catch(() => {})
    await runPending()
    toast(t('toast.welcome', { name: u.fullName.split(' ')[0] }))
  }, [applyPrefs, loadPrivate, runPending, toast, t])

  const login = useCallback(async (email, password) => {
    const { user: u } = await api('/auth/login', { method: 'POST', body: { email, password } })
    await afterAuth(u)
    return u
  }, [afterAuth])

  const signup = useCallback(async (data) => {
    const { user: u } = await api('/auth/signup', { method: 'POST', body: { ...data, preferredLanguage: i18n.language === 'ar' ? 'ar' : 'en' } })
    await afterAuth(u)
    return u
  }, [afterAuth, i18n.language])

  const logout = useCallback(async () => {
    await api('/auth/logout', { method: 'POST' }).catch(() => {})
    setUser(null)
    setCart([])
    setWishlist([])
    toast(t('toast.signedOut'), 'info')
    navigate('/')
  }, [navigate, toast, t])

  /** If logged out: remember what they wanted, send them to sign up, and come back afterwards. */
  const gate = useCallback((pending, next) => {
    if (user) return true
    if (pending) sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending))
    toast(t('auth.gate'), 'info')
    navigate(`/signup?next=${encodeURIComponent(next || window.location.pathname + window.location.search)}`)
    return false
  }, [user, navigate, toast, t])

  // ─── bag (optimistic) ───
  const addToBag = useCallback(async (watch) => {
    if (!gate({ type: 'bag', watchId: watch.id }, `/watch/${watch.id}`)) return
    if (watch.stock <= 0) return toast(t('errors.out_of_stock'), 'error')
    const before = cart
    setCart((c) => {
      const found = c.find((x) => x.watchId === watch.id)
      return found
        ? c.map((x) => (x.watchId === watch.id ? { ...x, quantity: Math.min(x.quantity + 1, Math.max(watch.stock, 1), 5) } : x))
        : [...c, { watchId: watch.id, quantity: 1, watch }]
    })
    toast(t('toast.addedBag'))
    try {
      const { items } = await api('/cart', { method: 'POST', body: { watchId: watch.id } })
      setCart(items)
    } catch (err) {
      setCart(before)
      toastError(err)
    }
  }, [gate, cart, toast, toastError, t])

  const updateQty = useCallback(async (watchId, quantity) => {
    const before = cart
    setCart((c) => (quantity <= 0 ? c.filter((x) => x.watchId !== watchId) : c.map((x) => (x.watchId === watchId ? { ...x, quantity } : x))))
    try {
      const { items } = await api('/cart', { method: 'PATCH', body: { watchId, quantity } })
      setCart(items)
    } catch (err) {
      setCart(before)
      toastError(err)
    }
  }, [cart, toastError])

  const removeFromBag = useCallback(async (watchId) => {
    const before = cart
    setCart((c) => c.filter((x) => x.watchId !== watchId))
    try {
      const { items } = await api(`/cart?watchId=${watchId}`, { method: 'DELETE' })
      setCart(items)
    } catch (err) {
      setCart(before)
      toastError(err)
    }
  }, [cart, toastError])

  const refreshCart = useCallback(async () => {
    const { items } = await api('/cart')
    setCart(items)
    return items
  }, [])

  // ─── wishlist (optimistic) ───
  const wishIds = useMemo(() => new Set(wishlist.map((w) => w.id)), [wishlist])
  const toggleWish = useCallback(async (watch) => {
    if (!gate({ type: 'wish', watchId: watch.id }, `/watch/${watch.id}`)) return
    const has = wishIds.has(watch.id)
    const before = wishlist
    setWishlist((w) => (has ? w.filter((x) => x.id !== watch.id) : [watch, ...w]))
    toast(t(has ? 'toast.removedWish' : 'toast.addedWish'), has ? 'info' : 'success')
    try {
      const { watches } = has
        ? await api(`/wishlist?watchId=${watch.id}`, { method: 'DELETE' })
        : await api('/wishlist', { method: 'POST', body: { watchId: watch.id } })
      setWishlist(watches)
    } catch (err) {
      setWishlist(before)
      toastError(err)
    }
  }, [gate, wishIds, wishlist, toast, toastError, t])

  // ─── compare (public, stored in the browser) ───
  const toggleCompare = useCallback((id) => {
    if (compare.includes(id)) { setCompare(compare.filter((x) => x !== id)); toast(t('toast.removedCompare'), 'info'); return }
    if (compare.length >= 3) { toast(t('toast.compareFull'), 'error'); return }
    setCompare([...compare, id])
    toast(t('toast.addedCompare'))
  }, [compare, setCompare, toast, t])

  // ─── checkout ───
  const placeOrder = useCallback(async (details) => {
    const res = await api('/orders', { method: 'POST', body: { ...details, currency } })
    setCart([])
    invalidate('/watches')
    invalidate('/brands')
    invalidate('/stats')
    return res
  }, [currency])

  const bagTotal = useMemo(() => cart.reduce((s, x) => s + x.watch.price * x.quantity, 0), [cart])
  const bagCount = useMemo(() => cart.reduce((s, x) => s + x.quantity, 0), [cart])

  const value = {
    user, setUser, authReady, login, signup, logout, gate,
    cart, cartReady, bagTotal, bagCount, addToBag, updateQty, removeFromBag, refreshCart, placeOrder,
    wishlist, wishIds, toggleWish,
    compare, toggleCompare, setCompare,
    currency, setCurrency, theme, setTheme,
    toasts, toast, toastError, errorText, dismissToast,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)

export function usePrice() {
  const { currency } = useStore()
  const { i18n } = useTranslation()
  return useCallback((aed) => {
    const c = currencies[currency] || currencies.AED
    const num = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(aed * c.rate)
    return i18n.language === 'ar' ? `${num} ${c.symbolAr}` : `${c.symbol} ${num}`
  }, [currency, i18n.language])
}

/** Pick the Arabic or English variant of a value: L({ en, ar }) or L(en, ar). */
export function useLocalized() {
  const { i18n } = useTranslation()
  return useCallback((a, b) => {
    const isAr = i18n.language === 'ar'
    if (b !== undefined) return isAr && b ? b : a
    return a && typeof a === 'object' ? a[i18n.language] ?? a.en : a
  }, [i18n.language])
}
