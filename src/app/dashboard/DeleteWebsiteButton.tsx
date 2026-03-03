'use client'

import { useTransition } from 'react'
import { deleteWebsite } from './actions'
import styles from "../page.module.css"

interface DeleteWebsiteButtonProps {
  id: string
}

export default function DeleteWebsiteButton({ id }: DeleteWebsiteButtonProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <button 
      className={styles.deleteButton} 
      title="Delete website" 
      disabled={isPending}
      onClick={() => {
        if (confirm('Are you sure you want to remove this website?')) {
          startTransition(async () => {
            const result = await deleteWebsite(id)
            if (result?.error) {
              alert(result.error)
            }
          })
        }
      }}
    >
      {isPending ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.spinner}>
          <path d="M21 12a9 9 0 11-6.219-8.56" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
        </svg>
      )}
    </button>
  )
}
