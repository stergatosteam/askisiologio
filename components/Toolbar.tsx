'use client'
import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import PlanDocument from '@/pdf/PlanDocument'
import { usePlan } from '@/store/usePlan'
import { ensureFontsRegistered } from '@/pdf/fonts'

export default function Toolbar() {
  const { plan, reset } = usePlan()
  const [gen, setGen] = useState(false)

  const generate = async (mode: 'download' | 'preview' = 'download') => {
    try {
      setGen(true)
      ensureFontsRegistered?.()

      const blob = await pdf(<PlanDocument plan={plan} />).toBlob()
      const url = URL.createObjectURL(blob)

      if (mode === 'preview') {
        window.open(url, '_blank', 'noopener,noreferrer')
      } else {
        const a = document.createElement('a')
        a.href = url
        a.download = `${plan.meta.clientName || 'plan'}.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
      }

      setTimeout(() => URL.revokeObjectURL(url), 5000)
    } catch (err) {
      console.error(err)
      alert('Αποτυχία δημιουργίας PDF. Δες το Console για λεπτομέρειες.')
    } finally {
      setGen(false)
    }
  }

  return (
    <div className="flex gap-2">
      <button className={`btn btn-secondary ${gen ? 'opacity-60 cursor-not-allowed' : ''}`} onClick={() => generate('download')} disabled={gen}>
        {gen ? 'Φτιάχνει PDF…' : 'Export to PDF'}
      </button>
      <button className="btn" onClick={() => generate('preview')} disabled={gen}>Preview PDF</button>
      <button className="btn" onClick={reset}>Start over</button>
    </div>
  )
}
