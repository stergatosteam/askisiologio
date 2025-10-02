'use client'
import { usePlan } from '@/store/usePlan'

export default function PlanMetaForm() {
  const { plan, setMeta } = usePlan()
  const m = plan.meta

  return (
    <div className="card p-4 space-y-3">
      <h3 className="font-medium">Στοιχεία Πλάνου</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm text-brand-gray-dark">Πελάτης</span>
          <input className="w-full" value={m.clientName} onChange={(e) => setMeta({ clientName: e.target.value })}/>
        </label>
        <label className="space-y-1">
          <span className="text-sm text-brand-gray-dark">Coach</span>
          <input className="w-full" value={m.coachName || ''} onChange={(e) => setMeta({ coachName: e.target.value })}/>
        </label>
        <label className="space-y-1">
          <span className="text-sm text-brand-gray-dark">Ημερομηνία έναρξης</span>
          <input type="date" className="w-full" value={m.startDate || ''} onChange={(e) => setMeta({ startDate: e.target.value })}/>
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-brand-gray-dark">Στόχος</span>
          <input className="w-full" value={m.goal || ''} onChange={(e) => setMeta({ goal: e.target.value })}/>
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-brand-gray-dark">Link προς οδηγίες (προαιρετικό)</span>
          <input className="w-full" placeholder="https://..." value={m.link || ''} onChange={(e) => setMeta({ link: e.target.value })}/>
        </label>
      </div>
    </div>
  )
}
