import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff', // άσπρο background
    fontFamily: 'NotoSans',
    padding: 20,
  },
  headerBox: {
    backgroundColor: '#f2f2f2',   // ανοιχτό γκρι φόντο
    borderRadius: 10,             // στρογγυλεμένες άκρες
    padding: 12,                  // εσωτερικό κενό
    marginBottom: 20,             // απόσταση από επόμενο στοιχείο
  },
  headerText: {
    fontSize: 12,
    color: '#000000',             // κανονικό μαύρο κείμενο
    marginBottom: 4,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 12,
    color: '#000000',
  },
});

interface PDFProps {
  trainer: string;
  client: string;
  date: string;
  goal: string;
}

export default function PDFDocument({ trainer, client, date, goal }: PDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header box */}
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Trainer: {trainer}</Text>
          <Text style={styles.headerText}>Client: {client}</Text>
          <Text style={styles.headerText}>Date: {date}</Text>
          <Text style={styles.headerText}>Goal: {goal}</Text>
        </View>

        {/* Παράδειγμα επιπλέον sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ημέρα 1</Text>
          <Text style={styles.sectionText}>Άσκηση 1: Squats, 3x10</Text>
        </View>
      </Page>
    </Document>
  );
}
