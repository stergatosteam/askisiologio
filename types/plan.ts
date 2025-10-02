export type WeightMode = 'total' | 'per-side';

export type Exercise = {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  timeSec?: number;
  weightKg?: number;
  weightMode?: WeightMode;
  notes?: string;
};

export type DaySection = {
  title: 'Warm-up' | 'Main' | 'Cool-down';
  exercises: Exercise[];
};

export type TrainingDay = {
  id: string;
  name: string;
  sections: DaySection[];
};

export type PlanMeta = {
  clientName: string;
  coachName?: string;
  startDate?: string;
  goal?: string;
  link?: string;
  brand?: { title?: string; subtitle?: string };
};

export type Plan = {
  id: string;
  meta: PlanMeta;
  days: TrainingDay[];
  updatedAt: number;
};
