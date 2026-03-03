'use client'

import { useTransition } from 'react'
import { syncJobs } from './actions'
import styles from "../page.module.css"

export default function SyncJobsButton() {
  const [isPending, startTransition] = useTransition()

  const handleSync = async () => {
    startTransition(async () => {
      try {
        const result = await syncJobs()
        if (result?.success) {
          console.log('%c🚀 [Hiresignal Sync Successful]', 'color: #2563eb; font-weight: bold; font-size: 14px;');
          console.log(`Total Jobs Found: ${result.totalJobsFound}`);
          
          if (result.allJobs && result.allJobs.length > 0) {
            result.allJobs.forEach((source: any) => {
              console.group(`Source: ${source.url} (${source.jobsFound} jobs)`);
              if (source.jobs && source.jobs.length > 0) {
                console.table(source.jobs);
              } else {
                console.warn('No jobs extracted from this source.');
              }
              console.groupEnd();
            });
          }
          
          alert(`${result.message}\nCheck your browser console (F12) to see the full list of jobs!`);
        } else if (result?.error) {
          alert(`Sync error: ${result.error}`)
        }
      } catch (e: any) {
        alert(`Failed to sync: ${e.message}`)
      }
    })
  }

  return (
    <button 
      onClick={handleSync} 
      className={styles.primary} 
      style={{ padding: '0.5rem 1rem', width: 'auto', alignSelf: 'flex-start' }}
      disabled={isPending}
    >
      {isPending ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="spinner" style={{ 
            width: '12px', height: '12px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' 
          }} />
          Scraping...
        </span>
      ) : '🔄 Sync & Scrap Jobs'}
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  )
}
