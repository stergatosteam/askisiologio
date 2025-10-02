'use client';
import { Exercise, WeightMode } from '@/types/plan';
import { usePlan } from '@/store/usePlan';

function toTime(value?: number) {
  if (!value || value <= 0) return '';
  const m = Math.floor(value / 60);
  const s = value % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
function parseTime(input: string) {
  if (!input) return undefined;
  if (/^\d+$/.test(input)) return Math.max(0, parseInt(input, 10));
  const m = input.split(':');
  if (m.length !== 2) return undefined;
  const mm = parseInt(m[0] || '0', 10);
  const ss = parseInt(m[1] || '0', 10);
  if (Number.isNaN(mm) || Number.isNaN(ss)) return undefined;
  return Math.max(0, mm * 60 + ss);
}

export default function ExerciseList({
  dayId,
  sectionIndex,
  exercises,
}: {
  dayId: string;
  sectionIndex: number;
  exercises: Exercise[];
}) {
  const { updateDay, plan } = usePlan();

  const patchExercises = (next: Exercise[]) => {
    const day = plan.days.find((d) => d.id === dayId)!;
    const sections = day.sections.map((s, i) =>
      i === sectionIndex ? { ...s, exercises: next } : s
    );
    updateDay(dayId, { sections });
  };

  const update = (id: string, patch: Partial<Exercise>) =>
    patchExercises(exercises.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const remove = (id: string) =>
    patchExercises(exercises.filter((e) => e.id !== id));

  return (
    <div className="space-y-4">
      {exercises.map((ex) => {
        const timeVal = toTime(ex.timeSec);
        return (
          <div key={ex.id} className="p-3 border rounded-md flex flex-col gap-2 bg-white text-black">
            <label className="space-y-1">
              <span className="text-xs text-brand-gray-dark">Όνομα άσκησης</span>
              <input className="w-full" value={ex.name} onChange={(e) => update(ex.id, { name: e.target.value })} placeholder="Π.χ. Back Squat" />
            </label>

            <label className="space-y-1">
              <span className="text-xs text-brand-gray-dark">Σετ</span>
              <input className="w-full" type="number" min={0} value={ex.sets ?? ''} onChange={(e) => update(ex.id, { sets: Number(e.target.value) })} placeholder="Σετ" />
            </label>

            <label className="space-y-1">
              <span className="text-xs text-brand-gray-dark">Επαναλήψεις</span>
              <input className="w-full" value={ex.reps || ''} onChange={(e) => update(ex.id, { reps: e.target.value })} placeholder="π.χ. 8-10" />
            </label>

            <label className="space-y-1">
              <span className="text-xs text-brand-gray-dark">Χρόνος</span>
              <input className="w-full" value={timeVal} onChange={(e) => update(ex.id, { timeSec: parseTime(e.target.value) })} placeholder="mm:ss ή δευτ. (π.χ. 45)" />
            </label>

            <div className="flex gap-2">
              <label className="space-y-1 flex-1">
                <span className="text-xs text-brand-gray-dark">Κιλά</span>
                <input className="w-full" type="number" min={0} step="0.5" value={ex.weightKg ?? ''} onChange={(e) => update(ex.id, { weightKg: e.target.value === '' ? undefined : Number(e.target.value) })} placeholder="Kg" />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-brand-gray-dark">Τρόπος</span>
                <select className="w-full" value={ex.weightMode || 'total'} onChange={(e) => update(ex.id, { weightMode: e.target.value as WeightMode })}>
                  <option value="total">Συνολικά</option>
                  <option value="per-side">Ανά πλευρά</option>
                </select>
              </label>
            </div>

            <div className="flex gap-2 items-end">
              <label className="space-y-1 flex-1">
                <span className="text-xs text-brand-gray-dark">Σημειώσεις</span>
                <input className="w-full" placeholder="Links γίνονται κλικαμπλ στο PDF" value={ex.notes || ''} onChange={(e) => update(ex.id, { notes: e.target.value })} />
              </label>
              <button className="text-red-600 font-bold h-10 px-3 border rounded-md" onClick={() => remove(ex.id)}>✕</button>
            </div>
          </div>
        );
      })}
      {exercises.length === 0 && <p className="text-sm text-brand-gray-dark">Καμία άσκηση ακόμη.</p>}
    </div>
  );
}
