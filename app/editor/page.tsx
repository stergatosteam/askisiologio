'use client'
import PlanMetaForm from '@/components/PlanMetaForm'
import DayCard from '@/components/DayCard'
import Toolbar from '@/components/Toolbar'
import { usePlan } from '@/store/usePlan'

export default function EditorPage() {
  const { plan, addDay } = usePlan()

  return (
    <main className="container space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Training Plan Editor</h1>
        <Toolbar />
      </div>

      <PlanMetaForm />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Training days</h2>
          <button onClick={addDay} className="btn btn-primary">+ Add day</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {plan.days.map((day) => <DayCard key={day.id} day={day}/>)}
        </div>
      </section>
      <p className="text-sm text-brand-gray-dark">All changes saved</p>
    </main>
  )
}
