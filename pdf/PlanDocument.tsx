'use client'
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer'
import type { Plan, Exercise } from '@/types/plan'
import { ensureFontsRegistered } from './fonts'

ensureFontsRegistered();

const styles = StyleSheet.create({
  // Λευκό φόντο σε όλη τη σελίδα
  page: { padding: 24, fontSize: 11, fontFamily: 'NotoSans', backgroundColor: '#ffffff' },

  // Γραμμή λογότυπου/brand (προαιρετικά – διατήρησα όπως πριν)
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  brand: { marginLeft: 12 },
  logo: { width: 54, height: 54 },

  // 👉 Το νέο γκρι κουτί χωρίς περίγραμμα
  metaBox: {
    backgroundColor: '#f2f2f2',   // ανοιχτό γκρι
    borderRadius: 10,              // στρογγυλεμένες γωνίες
    padding: 10,                   // εσωτερικό κενό
    marginBottom: 14,              // απόσταση από τα επόμενα
  },
  metaLine: { fontSize: 12, color: '#000000', marginBottom: 4 },

  day: { marginBottom: 12, borderBottom: 1, paddingBottom: 8, borderColor: '#e5e7eb' },
  row: { flexDirection: 'row', marginBottom: 4 },
  cellHeader: { fontWeight: 'bold' },
  link: { color: '#1D4ED8', textDecoration: 'underline' },
});

const colW = ['28%', '10%', '12%', '12%', '15%', '23%']; // Άσκηση, Σετ, Επαναλ., Χρόνος, Κιλά, Σημειώσεις

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

export default function PlanDocument({ plan }: { plan: Plan }) {
  // Τραβάμε τα meta από το plan
  const trainer = plan.meta.coachName || '';
  const client = plan.meta.clientName || '';
  const date = plan.meta.startDate || '';
  const goal = plan.meta.goal || '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* (Προαιρετικό) Λογότυπο + Brand */}
        <View style={styles.headerRow}>
          <Image src="/logo-stergatos.png" style={styles.logo} />
          <View style={styles.brand}>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>STERGATOS TEAM</Text>
            <Text>{client} {goal ? `– ${goal}` : ''}</Text>
            {trainer ? <Text>{`Coach: ${trainer}`}</Text> : null}
            {plan.meta.link ? (
              <Text>
                Περισσότερα:{' '}
                <Link
                  src={plan.meta.link.startsWith('http') ? plan.meta.link : `https://${plan.meta.link}`}
