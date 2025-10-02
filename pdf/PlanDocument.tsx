import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';
import type { Plan, Exercise } from '@/types/plan';
import { ensureFontsRegistered } from './fonts';

ensureFontsRegistered();

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 11, fontFamily: 'NotoSans', backgroundColor: '#ffffff' },

  // Logo / brand row
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  brand: { marginLeft: 12 },
  logo: { width: 54, height: 54 },

  // Meta box (trainer/client/date/goal)
  metaBox: { backgroundColor: '#f2f2f2', borderRadius: 10, padding: 10, marginBottom: 14 },
  metaLine: { fontSize: 12, color: '#000000', marginBottom: 4 },

  // Day title box
  dayTitleBox: {
    backgroundColor: '#E0F2FE',
    border: 1,
    borderColor: '#1E3A8A',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  dayTitleText: { fontSize: 12, fontWeight: 'bold', color: '#000000' },

  // Warmup section
  warmupBox: {
    backgroundColor: '#FEF9C3',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginBottom: 6,
  },
  warmupText: { fontSize: 11, color: '#000000', fontWeight: 'bold' },

  // Table headers
  tableHeaderRow: {
    flexDirection: 'row',
    marginBottom: 6,
    backgroundColor: '#000000',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  tableHeaderCell: { fontWeight: 'bold', color: '#ffffff' },

  // Day block container
  day: { marginBottom: 12, borderBottom: 1, borderColor: '#e5e7eb', paddingBottom: 8 },

  // Exercise rows with zebra striping
  exerciseRowEven: {
    flexDirection: 'row',
    marginBottom: 4,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  exerciseRowOdd: {
    flexDirection: 'row',
    marginBottom: 4,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },

  link: { color: '#1D4ED8', textDecoration: 'underline' },
});

const colW = ['28%', '10%', '12%', '12%', '15%', '23%'];

const Cell = ({ children, w }: { children: React.ReactNode; w: string }) => (
  <Text style={{ width: w }}>{children}</Text>
);

const Linkify = ({ text = '' }: { text?: string }) => {
  const parts = text.split(/(https?:\/\/[^\s)]+|www\.[^\s)]+)/gi).filter(Boolean);
  return (
    <Text>
      {parts.map((part, i) => {
        const isUrl = /^(https?:\/\/|www\.)/i.test(part);
        if (!isUrl) return <Text key={i}>{part}</Text>;
        const href = part.startsWith('http') ? part : `https://${part}`;
        return (
          <Link key={i} src={href} style={styles.link}>
            {part}
          </Link>
        );
      })}
    </Text>
  );
};

function fmtTime(e: Exercise) {
  if (!e.timeSec) return '';
  const m = Math.floor(e.timeSec / 60);
  const s = (e.timeSec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
function fmtKg(e: Exercise) {
  if (e.weightKg == null) return '';
  const mode = e.weightMode === 'per-side' ? 'ανά πλευρά' : 'συνολικά';
  return `${e.weightKg} kg (${mode})`;
}

export default function PlanDocument({ plan }: { plan: Plan }) {
  const trainer = plan.meta.coachName || '';
  const client = plan.meta.clientName || '';
  const date = plan.meta.startDate || '';
  const goal = plan.meta.goal || '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo + brand (ΜΟΝΟ ο τίτλος – χωρίς client/coach/goal/link) */}
        <View style={styles.headerRow}>
          <Image src="/logo-stergatos.png" style={styles.logo} />
          <View style={styles.brand}>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>STERGATOS TEAM</Text>
          </View>
        </View>

        {/* Meta box με όλα τα στοιχεία */}
        <View style={styles.metaBox}>
          <Text style={styles.metaLine}>Trainer: {trainer}</Text>
          <Text style={styles.metaLine}>Client: {client}</Text>
          <Text style={styles.metaLine}>Date: {date}</Text>
          <Text style={styles.metaLine}>Goal: {goal}</Text>
        </View>

        {/* Days */}
        {plan.days.map((d, i) => (
          <View key={d.id} style={styles.day}>
            {/* Day title */}
            <View style={styles.dayTitleBox}>
              <Text style={styles.dayTitleText}>{`${i + 1}. ${d.name}`}</Text>
            </View>

            {/* Table headers */}
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, { width: colW[0] }]}>Άσκηση</Text>
              <Text style={[styles.tableHeaderCell, { width: colW[1] }]}>Σετ</Text>
              <Text style={[styles.tableHeaderCell, { width: colW[2] }]}>Επαναλ.</Text>
              <Text style={[styles.tableHeaderCell, { width: colW[3] }]}>Χρόνος</Text>
              <Text style={[styles.tableHeaderCell, { width: colW[4] }]}>Κιλά</Text>
              <Text style={[styles.tableHeaderCell, { width: colW[5] }]}>Σημειώσεις</Text>
            </View>

            {/* Sections */}
            {d.sections.map((s) => {
              const isWarmup =
                s.title.toLowerCase().includes('warm') ||
                s.title.toLowerCase().includes('warm-up') ||
                s.title.toLowerCase().includes('warm up');

              return (
                <View key={s.title} style={{ marginBottom: 6 }}>
                  {isWarmup ? (
                    <View style={styles.warmupBox}>
                      <Text style={styles.warmupText}>{s.title}</Text>
                    </View>
                  ) : (
                    <Text style={{ fontWeight: 'bold', marginBottom: 2 }}>{s.title}</Text>
                  )}

                  {s.exercises.map((e, idx) => (
                    <View
                      key={e.id}
                      style={idx % 2 === 0 ? styles.exerciseRowEven : styles.exerciseRowOdd}
                    >
                      <Cell w={colW[0]}>{e.name}</Cell>
                      <Cell w={colW[1]}>{e.sets ?? ''}</Cell>
                      <Cell w={colW[2]}>{e.reps ?? ''}</Cell>
                      <Cell w={colW[3]}>{fmtTime(e)}</Cell>
                      <Cell w={colW[4]}>{fmtKg(e)}</Cell>
                      <Text style={{ width: colW[5] }}>
                        <Linkify text={e.notes ?? ''} />
                      </Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        ))}
      </Page>
    </Document>
  );
}
