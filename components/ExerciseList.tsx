'use client';
import { Exercise, WeightMode } from '@/types/plan';
import { usePlan } from '@/store/usePlan';

const TIME_PRESETS: { label: string; value: number }[] = [
  { label: '20s', value: 20 },
  { label: '30s', value: 30 },
  { label: '45s', value: 45 },
  { label: '1:00', value: 60 },
  { label: '1:30', value: 90 },
  { label: '2:00', value: 120 },
  { label: '2:30', value: 150 },
  { label: '3:00', value: 180 },
  { label: '3:30', value: 210 },
  { label: '4:00', value: 240 },
  { label: '4:30', value: 270 },
  { label: '5:00', value: 300 },
];

const SET_PRESETS: number[] = Array.from({ length: 11 }, (_, i) => i); // 0–10
const REP_PRESETS: (string | number)[] = ['-', ...Array.from({ length: 50 }, (_, i) => i + 1), 'MAX'];

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
        const selectedTime = TIME_PRESETS.find((p) => p.value === ex.timeSec)?.value ?? '';
        const selectedSets = ex.sets ?? '';
        const selectedReps = ex.reps ?? '';

        return (
          <div
            key={ex.id}
            className="p-3 border rounded-md flex flex-col gap-2 bg-white text-black"
          >
            <label className="space-y-1">
              <span className="text-xs text-brand-gray-dark">Όνομα άσκησης</span>
              <input
                className="w-full"
                value={ex.name}
                onChange={(e) => update(ex.id, { name: e.target.value })}
                placeholder="Π.χ. Back Squat"
              />
            </label>

            {/* Σετ με dropdown */}
            <label className="space-y-1">
              <span className="text-xs text-brand-gray-dark">Σετ</span>
              <select
                className="w-full rounded-md border border-brand-gray-light px-2 py-2"
                value={selectedSets}
                onChange={(e) => {
                  const num = Number(e.target.value);
                  update(ex.id, { sets: Number.isNaN(num) ? undefined : num });
                }}
              >
                <option value="">— Επιλογή —</option>
                {SET_PRESETS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>

            {/* Επαναλήψεις με dropdown */}
            <label className="space-y-1">
              <span className="text-xs text-brand-gray-dark">Επαναλήψεις</span>
              <select
                className="w-full rounded-md border border-brand-gray-light px-2 py-2"
                value={selectedReps}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '-') {
                    update(ex.id, { reps: '' });
                  } else {
                    update(ex.id, { reps: val });
                  }
                }}
              >
                {REP_PRESETS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>

            {/* Χρόνος */}
            <div className="space-y-1">
              <span className="text-xs text-brand-gray-dark">Χρόνος</span>
              <select
                className="w-full rounded-md border border-brand-gray-light px-2 py-2"
                value={selectedTime as any}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === '') {
                    update(ex.id, { timeSec: undefined });
                    return;
                  }
                  const num = Number(v);
                  if (!Number.isNaN(num)) update(ex.id, { timeSec: num });
                }}
              >
                <option value="">— Επιλογή χρόνου —</option>
                {TIME_PRESETS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <label className="space-y-1 flex-1">
                <span className="text-xs text-brand-gray-dark">Κιλά</span>
                <input
                  className="w-full"
                  type="number"
                  min={0}
                  step={0.5}
                  value={ex.weightKg ?? ''}
                  onChange={(e) =>
                    update(ex.id, {
                      weightKg:
                        e.target.value === '' ? undefined : Number(e.target.value),
                    })
                  }
                  placeholder="Kg"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-brand-gray-dark">Τρόπος</span>
                <select
                  className="w-full"
                  value={ex.weightMode || 'total'}
                  onChange={(e) =>
                    update(ex.id, { weightMode: e.target.value as WeightMode })
                  }
                >
                  <option value="total">Συνολικά</option>
                  <option value="per-side">Ανά πλευρά</option>
                </select>
              </label>
            </div>

            <div className="flex gap-2 items-end">
              <label className="space-y-1 flex-1">
                <span className="text-xs text-brand-gray-dark">Σημειώσεις</span>
                <input
                  className="w-full"
                  placeholder="Links γίνονται κλικαμπλ στο PDF"
                  value={ex.notes || ''}
                  onChange={(e) => update(ex.id, { notes: e.target.value })}
                />
              </label>
              <button
                className="text-red-600 font-bold h-10 px-3 border rounded-md"
                onClick={() => remove(ex.id)}
              >
                ✕
              </button>
            </div>
          </div>
        );
      })}
      {exercises.length === 0 && (
        <p className="text-sm text-brand-gray-dark">Καμία άσκηση ακόμη.</p>
      )}
    </div>
  );
}
