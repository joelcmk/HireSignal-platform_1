'use client'

import { useTransition } from 'react'
import { clearAllJobs } from './actions'
import styles from "../page.module.css"

export default function ClearJobsButton() {
  const [isPending, startTransition] = useTransition()

  const handleClear = async () => {
    if (!confirm('Are you sure you want to clear all suggested jobs? This cannot be undone.')) return

    startTransition(async () => {
      try {
        const result = await clearAllJobs()
        if (result?.success) {
          alert('All jobs cleared successfully.')
        } else if (result?.error) {
          alert(`Error: ${result.error}`)
        }
      } catch (e: any) {
        alert(`Failed: ${e.message}`)
      }
    })
  }

  return (
    <button 
      onClick={handleClear} 
      className={styles.secondarySmall} 
      style={{ color: '#ef4444', borderColor: '#ef4444' }}
      disabled={isPending}
    >
      {isPending ? 'Clearing...' : '🗑️ Clear Queue'}
    </button>
  )
}
