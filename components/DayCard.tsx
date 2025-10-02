'use client'
import { TrainingDay, Exercise } from '@/types/plan'
import { usePlan } from '@/store/usePlan'
import { nanoid } from 'nanoid'
import ExerciseList from './ExerciseList'

export default function DayCard({ day }: { day: TrainingDay }) {
  const { removeDay, updateDay } = usePlan()

  const addExercise = (sectionIdx: number) => {
    const ex: Exercise = {
      id: nanoid(),
      name: 'Νέα άσκηση',
      sets: 3,
      reps: '10',
      timeSec: undefined,
      weightKg: undefined,
      weightMode: 'total',
      notes: ''
    }
    const sections = day.sections.map((s, i) =>
      i === sectionIdx ? { ...s, exercises: [...s.exercises, ex] } : s
    )
    updateDay(day.id, { sections })
  }

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <input
          className="text-lg font-medium outline-none"
          value={day.name}
          onChange={(e) => updateDay(day.id, { name: e.target.value })}
        />
        <button className="text-red-600" onClick={() => removeDay(day.id)}>Remove</button>
      </div>

      {day.sections.map((section, idx) => (
        <div key={section.title} className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{section.title}</h4>
            <button className="btn btn-primary" onClick={() => addExercise(idx)}>+ Add exercise</button>
          </div>
          <ExerciseList dayId={day.id} sectionIndex={idx} exercises={section.exercises}/>
        </div>
      ))}
    </div>
  )
}
