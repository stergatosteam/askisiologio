'use client'
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer'
import type { Plan, Exercise } from '@/types/plan'
import { ensureFontsRegistered } from './fonts'

ensureFontsRegistered();

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 11, fontFamily: 'NotoSans',backgroundColor: '#ffffff', },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  brand: { marginLeft: 12 },
  headerBox: {backgroundColor: '#f2f2f2', borderRadius: 10, padding: 12, marginBottom: 20, },
  logo: { width: 54, height: 54 },
  day: { marginBottom: 12, borderBottom: 1, paddingBottom: 8 },
  row: { flexDirection: 'row', marginBottom: 4 },
  cellHeader: { fontWeight: 'bold' },
  headerText: { fontSize: 12, color: '#000000', marginBottom: 4, },
  link: { color: '#1D4ED8', textDecoration: 'underline' },
});

const colW = ['28%', '10%', '12%', '12%', '15%', '23%'];

const Cell = ({ children, w }: { children: any; w: string }) => (
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
        return <Link key={i} src={href} style={styles.link}>{part}</Link>;
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

interface Props {trainer: string; client: string; date: string; goal: string; 
}

export default function PlanDocument({ plan }: { plan: Plan }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Trainer: {trainer}</Text>
          <Text style={styles.headerText}>Client: {client}</Text>
          <Text style={styles.headerText}>Date: {date}</Text>
          <Text style={styles.headerText}>Goal: {goal}</Text>
        </View>
        <View style={styles.headerRow}>
          <Image src="/logo-stergatos.png" style={styles.logo} />
          <View style={styles.brand}>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>STERGATOS TEAM</Text>
            <Text>{plan.meta.clientName} {plan.meta.goal ? `– ${plan.meta.goal}` : ''}</Text>
            {plan.meta.coachName ? <Text>{`Coach: ${plan.meta.coachName}`}</Text> : null}
            {plan.meta.link ? (
              <Text>Περισσότερα: <Link src={plan.meta.link.startsWith('http') ? plan.meta.link : `https://${plan.meta.link}`} style={styles.link}>{plan.meta.link}</Link></Text>
            ) : null}
          </View>
        </View>

        {plan.days.map((d, i) => (
          <View key={d.id} style={styles.day}>
            <Text style={{ fontSize: 12, marginBottom: 4, fontWeight: 'bold' }}>{`${i + 1}. ${d.name}`}</Text>

            <View style={{ ...styles.row, marginBottom: 6 }}>
              <Text style={[styles.cellHeader, { width: colW[0] }]}>Άσκηση</Text>
              <Text style={[styles.cellHeader, { width: colW[1] }]}>Σετ</Text>
              <Text style={[styles.cellHeader, { width: colW[2] }]}>Επαναλ.</Text>
              <Text style={[styles.cellHeader, { width: colW[3] }]}>Χρόνος</Text>
              <Text style={[styles.cellHeader, { width: colW[4] }]}>Κιλά</Text>
              <Text style={[styles.cellHeader, { width: colW[5] }]}>Σημειώσεις</Text>
            </View>

            {d.sections.map((s) => (
              <View key={s.title} style={{ marginBottom: 6 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 2 }}>{s.title}</Text>
                {s.exercises.map((e) => (
                  <View key={e.id} style={styles.row}>
                    <Cell w={colW[0]}>{e.name}</Cell>
                    <Cell w={colW[1]}>{e.sets ?? ''}</Cell>
                    <Cell w={colW[2]}>{e.reps ?? ''}</Cell>
                    <Cell w={colW[3]}>{fmtTime(e)}</Cell>
                    <Cell w={colW[4]}>{fmtKg(e)}</Cell>
                    <Text style={{ width: colW[5] }}><Linkify text={e.notes ?? ''} /></Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  )
}
