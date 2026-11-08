import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MapPin, Calendar, Clock, Check, Phone, Coffee, Loader2 } from 'lucide-react'
import { Page } from '../components/ui'
import { Shimmer } from '../components/Skeleton'
import { useStore, useLocalized } from '../context/StoreContext'
import { useApi } from '../lib/useApi'
import { api } from '../lib/api'

const TIMES = ['10:00', '11:30', '13:00', '15:00', '16:30', '18:00', '19:30', '21:00']

function Step({ n, title, children, delay = 0 }) {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.7 }} className="glass rounded-3xl p-6 md:p-8">
      <h2 className="mb-5 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/50 font-display text-lg text-gold-400">{n}</span>
        <span className="eyebrow">{title}</span>
      </h2>
      {children}
    </motion.section>
  )
}

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export default function Appointments() {
  const { t, i18n } = useTranslation()
  const L = useLocalized()
  const [params] = useSearchParams()
  const { toast, toastError, user } = useStore()
  const [boutiqueId, setBoutique] = useState(null)
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [form, setForm] = useState({ interest: params.get('watch') || '', notes: '' })
  const [done, setDone] = useState(null)
  const [saving, setSaving] = useState(false)

  const { data: bData, loading: bLoading } = useApi('/boutiques')
  const boutiques = bData?.boutiques || []
  const catalogue = useApi('/watches?sort=featured').data?.watches || []
  const mine = useApi('/appointments', { cache: false })
  const taken = useApi(boutiqueId && date ? `/appointments?boutiqueId=${boutiqueId}&date=${iso(date)}` : null, { cache: false })
  const takenSet = new Set(taken.data?.taken || [])

  const locale = i18n.language === 'ar' ? 'ar-AE' : 'en-GB'
  const days = useMemo(() => {
    const out = []
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    for (let i = 1; i <= 21; i++) {
      const x = new Date(d)
      x.setDate(d.getDate() + i)
      out.push(x)
    }
    return out
  }, [])
  const fmt = (d, o) => d.toLocaleDateString(locale, o)

  const submit = async (e) => {
    e.preventDefault()
    if (!boutiqueId || !date || !time) return toast(t('appt.missing'), 'error')
    setSaving(true)
    try {
      const { appointment } = await api('/appointments', {
        method: 'POST',
        body: { boutiqueId, date: iso(date), time, watchId: form.interest || null, notes: form.notes },
      })
      const city = L(appointment.boutique.city, appointment.boutique.cityAr)
      setDone({ city, date: fmt(date, { weekday: 'long', day: 'numeric', month: 'long' }), time })
      toast(`${t('toast.booked')} · ${city} · ${time}`)
      setTime(null)
      setForm((f) => ({ ...f, notes: '' }))
      mine.reload()
      taken.reload()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      toastError(err)
      if (err.code === 'slot_taken') taken.reload()
    } finally {
      setSaving(false)
    }
  }

  const upcoming = (mine.data?.appointments || []).filter((a) => a.status !== 'cancelled' && new Date(a.time) > new Date())

  return (
    <Page>
      <section className="relative overflow-hidden">
        <div className="tex-marble absolute inset-0 -z-10 opacity-70" />
        <div className="mx-auto max-w-7xl px-5 pb-10 pt-14 md:px-8 md:pt-20">
          <p className="eyebrow mb-4">{t('appt.eyebrow')}</p>
          <h1 className="font-display text-5xl font-light leading-none md:text-7xl">{t('appt.title')}</h1>
          <p className="mt-5 flex max-w-lg items-center gap-2 text-sm text-muted"><Coffee className="h-4 w-4 shrink-0 text-gold-400" strokeWidth={1.4} />{t('appt.subtitle')}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <AnimatePresence>
          {done && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
              <div className="flex items-center gap-4 rounded-3xl border border-gold-400/50 bg-gold-400/10 p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-400 text-midnight-950"><Check className="h-6 w-6" /></span>
                <div>
                  <p className="font-display text-2xl">{t('appt.success')}</p>
                  <p className="text-sm text-muted">{t('appt.successText', done)}</p>
                </div>
                <button onClick={() => setDone(null)} className="ms-auto text-xs text-muted hover:text-gold-400">{t('common.close')}</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <Step n="1" title={t('appt.boutique')}>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {bLoading && !boutiques.length && Array.from({ length: 6 }, (_, i) => <Shimmer key={i} className="h-[118px] !rounded-2xl" />)}
                {boutiques.map((b) => (
                  <button type="button" key={b.id} onClick={() => { setBoutique(b.id); setTime(null) }} className={`group relative overflow-hidden rounded-2xl border p-5 text-start transition-all duration-500 ${boutiqueId === b.id ? 'border-gold-400 bg-gold-400/10 shadow-glow' : 'border-gold-400/20 hover:border-gold-400/60'}`} aria-pressed={boutiqueId === b.id}>
                    {boutiqueId === b.id && <Check className="absolute end-4 top-4 h-4 w-4 text-gold-400" />}
                    <p className="font-display text-2xl">{L(b.city, b.cityAr)}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted"><MapPin className="h-3 w-3 shrink-0 text-gold-400" />{L(b.address, b.addressAr)}</p>
                    <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted" dir="ltr"><Phone className="h-3 w-3" />{b.whatsapp}</p>
                    <p className="mt-1 text-[10px] text-muted/80" dir="ltr">{b.openingHours}</p>
                  </button>
                ))}
              </div>
            </Step>

            <Step n="2" title={t('appt.date')} delay={0.1}>
              <div className="no-scrollbar -mx-2 flex gap-2 overflow-x-auto px-2 pb-2">
                {days.map((d) => {
                  const sel = date && iso(d) === iso(date)
                  const fri = d.getDay() === 5
                  return (
                    <button type="button" key={iso(d)} onClick={() => { setDate(d); setTime(null) }} className={`flex w-[68px] shrink-0 flex-col items-center rounded-2xl border py-3 transition-all duration-300 ${sel ? 'border-gold-400 bg-gold-400 text-midnight-950' : 'border-gold-400/20 hover:border-gold-400/60'}`}>
                      <span className={`text-[10px] uppercase ${sel ? '' : 'text-muted'}`}>{fmt(d, { weekday: 'short' })}</span>
                      <span className="font-display text-2xl leading-tight">{fmt(d, { day: 'numeric' })}</span>
                      <span className={`text-[10px] ${sel ? '' : 'text-muted'}`}>{fmt(d, { month: 'short' })}</span>
                      {fri && <span className={`mt-1 h-1 w-1 rounded-full ${sel ? 'bg-midnight-950' : 'bg-gold-400'}`} />}
                    </button>
                  )
                })}
              </div>
            </Step>

            <Step n="3" title={t('appt.time')} delay={0.2}>
              {!date || !boutiqueId ? (
                <p className="flex items-center gap-2 text-sm text-muted"><Calendar className="h-4 w-4 text-gold-400" />{t('appt.missing')}</p>
              ) : (
                <div className={`grid grid-cols-3 gap-2 transition-opacity sm:grid-cols-4 ${taken.loading ? 'opacity-50' : ''}`}>
                  {TIMES.map((tm) => {
                    const off = takenSet.has(tm)
                    return (
                      <button type="button" key={tm} disabled={off || taken.loading} onClick={() => setTime(tm)} dir="ltr" className={`flex items-center justify-center gap-1.5 rounded-xl border py-3 text-sm transition-all duration-300 ${time === tm ? 'border-gold-400 bg-gold-400 text-midnight-950' : off ? 'cursor-not-allowed border-gold-400/10 text-muted/40 line-through' : 'border-gold-400/20 hover:border-gold-400/60'}`} title={off ? t('appt.booked') : undefined}>
                        <Clock className="h-3.5 w-3.5" strokeWidth={1.4} />{tm}
                      </button>
                    )
                  })}
                </div>
              )}
            </Step>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <Step n="4" title={t('appt.details')} delay={0.3}>
              <div className="space-y-4">
                {user && <p className="rounded-xl border border-gold-400/20 px-4 py-3 text-sm">{t('appt.signedInAs', { name: user.fullName })}<span className="mt-0.5 block text-xs text-muted" dir="ltr">{user.phone}</span></p>}
                <select className="input-luxe" value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })} aria-label={t('appt.interest')}>
                  <option value="" className="bg-midnight-900 text-ivory-100">{t('appt.interest')}</option>
                  {catalogue.map((w) => <option key={w.id} value={w.id} className="bg-midnight-900 text-ivory-100">{w.brand.name} — {w.model}</option>)}
                </select>
                <textarea className="input-luxe min-h-[90px] resize-none" placeholder={t('appt.notes')} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                <button type="submit" disabled={saving} className="btn-gold w-full !py-4">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" strokeWidth={1.5} />}{t('appt.confirm')}
                </button>
              </div>
            </Step>
            {upcoming.length > 0 && (
              <div className="glass mt-6 rounded-3xl p-6">
                <p className="eyebrow mb-4">{t('appt.upcoming')}</p>
                <ul className="space-y-3">
                  {upcoming.slice(0, 4).map((a) => (
                    <li key={a.id} className="flex items-center justify-between border-b border-gold-400/10 pb-3 text-sm last:border-0">
                      <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-gold-400" />{L(a.boutique.city, a.boutique.cityAr)}</span>
                      <span className="text-muted" dir="ltr">{a.date} · {a.localTime}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </form>
      </div>
    </Page>
  )
}
