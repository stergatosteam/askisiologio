'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Plan, TrainingDay, Exercise } from '@/types/plan'
import { nanoid } from 'nanoid'

type PlanState = {
  plan: Plan
  setMeta: (patch: Partial<Plan['meta']>) => void
  addDay: () => void
  removeDay: (id: string) => void
  updateDay: (id: string, patch: Partial<TrainingDay>) => void
  reset: () => void
}

const newExercise = (): Exercise => ({
  id: nanoid(),
  name: 'Νέα άσκηση',
  sets: 3,
  reps: '10',
  timeSec: undefined,
  weightKg: undefined,
  weightMode: 'total',
  notes: ''
})

const newDay = (n: number): TrainingDay => ({
  id: nanoid(),
  name: `Day ${n}`,
  sections: [
    { title: 'Warm-up', exercises: [] },
    { title: 'Main', exercises: [newExercise()] },
    { title: 'Cool-down', exercises: [] }
  ]
})

const initialPlan = (): Plan => ({
  id: nanoid(),
  meta: { clientName: '', coachName: '', goal: '' },
  days: [newDay(1), newDay(2), newDay(3)],
  updatedAt: Date.now()
})

export const usePlan = create<PlanState>()(
  persist(
    (set, get) => ({
      plan: initialPlan(),
      setMeta: (patch) => set((s) => ({ plan: { ...s.plan, meta: { ...s.plan.meta, ...patch }, updatedAt: Date.now() } })),
      addDay: () => set((s) => ({ plan: { ...s.plan, days: [...s.plan.days, newDay(s.plan.days.length + 1)], updatedAt: Date.now() } })),
      removeDay: (id) => set((s) => ({ plan: { ...s.plan, days: s.plan.days.filter((d) => d.id !== id), updatedAt: Date.now() } })),
      updateDay: (id, patch) => set((s) => ({ plan: { ...s.plan, days: s.plan.days.map((d) => d.id === id ? { ...d, ...patch } : d), updatedAt: Date.now() } })),
      reset: () => set({ plan: initialPlan() })
    }),
    { name: 'fitness-plan' }
  )
)
