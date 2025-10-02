import Link from 'next/link'

export default function Home() {
  return (
    <main className="container grid gap-6 md:grid-cols-[1.2fr_1fr]">
      <section className="card p-8 bg-brand-black text-white border-none">
        <div className="mb-4">
          <img src="/logo-stergatos.png" width="56" height="56" alt="Stergatos Team" />
        </div>
        <h1 className="text-3xl font-bold">Fitness Plan Generator</h1>
        <p className="text-brand-gray">Single-screen editor, local autosave, PDF export</p>
        <p className="text-brand-gray mb-6 mt-2">Φτιάξε προπονητικά πλάνα γρήγορα και καθαρά.</p>
        <Link href="/editor" className="btn btn-primary">Create New Plan</Link>
      </section>

      <section className="card p-8">
        <h2 className="text-xl font-semibold mb-4">UI Elements</h2>
        <div className="flex gap-3 mb-2">
          <button className="btn btn-primary">+ Add day</button>
          <button className="btn btn-secondary">Export to PDF</button>
        </div>
        <p className="badge-muted">All changes saved</p>
      </section>
    </main>
  )
}
