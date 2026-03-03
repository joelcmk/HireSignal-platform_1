'use client'

import { useTransition } from 'react'
import { clearAllJobs } from './actions'

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
      disabled={isPending}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        fontSize: '0.8125rem',
        fontWeight: '600',
        color: '#ef4444',
        backgroundColor: 'transparent',
        border: '1px solid #ef4444',
        borderRadius: '8px',
        cursor: isPending ? 'not-allowed' : 'pointer',
        opacity: isPending ? 0.6 : 1,
        transition: 'all 0.2s ease',
      }}
    >
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </svg>
      {isPending ? 'Clearing...' : 'Clear Queue'}
    </button>
  )
}
