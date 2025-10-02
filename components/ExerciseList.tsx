'use client';
import { Exercise, WeightMode } from '@/types/plan';
import { usePlan } from '@/store/usePlan';

const TIME_PRESETS: { label: string; value: number }[] = [
  { label: '20s', value: 20 },
  { label: '30s', value: 30 },
  { label: '40s', value: 40 },
  { label: '45s', value: 45 },
  { label: '1:00', value: 60 },
  { label: '1:30', value: 90 },
  { label: '2:00', value: 120 },
  { label: '3:00', value: 180 },
];

function toTime(value?: number) {
  if (!value || value <= 0) return '';
  const m = Math.floor(value / 60);
  const s = value % 60;
  return m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${s}`;
}
function parseTime(input: string) {
  const trimmed = (input || '').trim();
  if (!trimmed) return undefined;
  // καθαρά δευτερόλεπτα
  if (/^\d+$/.test(trimmed)) return Math.max(0, parseInt(trimmed, 10));
  // mm:ss
  const m = trimmed.split(':');
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
        const selectedPresetValue =
          TIME_PRESETS.find((p) => p.value === (ex.timeSec ?? -1))?.value ?? 'custom';

        return (
          <div key={ex.id} className="p-3 border rounded-md flex flex-col gap-2 bg-white text-black">
            <label className="space-y-1">
              <span className="text-xs text-brand-gray-dark">Όνομα άσκησης</span>
              <input
                className="w-full"
                value={ex.name}
                onChange={(e) => update(ex.id, { name: e.target.value })}
                placeholder="Π.χ. Back Squat"
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs text-brand-gray-dark">Σετ</span>
              <input
                className="w-full"
                type="number"
                min={0}
                value={ex.sets ?? ''}
                onChange={(e) => update(ex.id, { sets: Number(e.target.value) })}
                placeholder="Σετ"
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs text-brand-gray-dark">Επαναλήψεις</span>
              <input
                className="w-full"
                value={ex.reps || ''}
                onChange={(e) => update(ex.id, { reps: e.target.value })}
                placeholder="π.χ. 8-10"
              />
            </label>

            {/* ΧΡΟΝΟΣ: dropdown presets + προσαρμοσμένο */}
            <div className="space-y-1">
              <span className="text-xs text-brand-gray-dark">Χρόνος</span>
              <div className="flex gap-2">
                <select
                  className="w-1/2 rounded-md border border-brand-gray-light px-2 py-2"
                  value={selectedPresetValue as any}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'custom') {
                      // Μένουμε ως έχει, ο χρήστης μπορεί να συμπληρώσει κάτω το custom πεδίο
                      return;
                    }
                    const num = Number(val);
                    if (!Number.isNaN(num)) {
                      update(ex.id, { timeSec: num });
                    }
                  }}
                >
                  <option value="custom">— Επιλογή χρόνου —</option>
                  {TIME_PRESETS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>

                <input
                  className="flex-1 rounded-md border border-brand-gray-light px-2 py-2"
                  placeholder="mm:ss ή δευτ. (π.χ. 45 ή 1:00)"
                  value={timeVal}
                  onChange={(e) => update(ex.id, { timeSec: parseTime(e.target.value) })}
                />
              </div>
              <p className="text-[11px] text-brand-gray-dark">
                Διάλεξε από τη λίστα ή γράψε δικό σου (mm:ss ή δευτερόλεπτα).
              </p>
            </div>

            <div className="flex gap-2">
              <label className="space-y-1 flex-1">
                <span className="text-xs text-brand-gray-dark">Κιλά</span>
                <input
                  className="w-full"
                  type="number"
                  min={0}
                  step="0.5"
                  value={ex.weightKg ?? ''}
                  onChange={(e) =>
                    update(ex.id, {
                      weightKg: e.target.value === '' ? undefined : Number(e.target.value),
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
                  onChange={(e) => update(ex.id, { weightMode: e.target.value as WeightMode })}
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
