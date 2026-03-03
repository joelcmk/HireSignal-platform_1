'use client'

import { useTransition } from 'react'
import { hideJob, saveJob } from './actions'
import styles from './jobqueue.module.css'

interface Job {
  id: string
  title: string
  company: string
  location: string
  url: string
  status: string
  created_at: string
}

interface JobQueueProps {
  initialJobs: Job[]
}

export default function JobQueue({ initialJobs }: JobQueueProps) {
  const [isPending, startTransition] = useTransition()

  const handleHide = async (id: string) => {
    startTransition(async () => {
      try {
        const result = await hideJob(id)
        if (result?.error) {
          alert(`Error hiding job: ${result.error}`)
        }
      } catch (e: any) {
        alert(`Failed to hide job: ${e.message}`)
      }
    })
  }

  const handleSave = async (job: Job) => {
    startTransition(async () => {
      try {
        const result = await saveJob({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          url: job.url,
          created_at: job.created_at
        })
        if (result?.error) {
          alert(`Error saving job: ${result.error}`)
        } else {
          alert('Job saved successfully!')
        }
      } catch (e: any) {
        alert(`Failed to save job: ${e.message}`)
      }
    })
  }

  const handleApply = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={styles.container}>
      
      <div className={styles.queue}>
        {initialJobs && initialJobs.length > 0 ? (
          initialJobs.map(job => (
            <div key={job.id} className={styles.jobCard} style={{ opacity: isPending ? 0.7 : 1 }}>
              <div className={styles.jobInfo}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={styles.jobTitle}>{job.title}</span>
                  <span className={styles.badge}>Scraped</span>
                </div>
                <span className={styles.company}>{job.company}</span>
                <div className={styles.meta}>
                  <span>📍 {job.location || 'Remote'}</span>
                  <span>🕒 {new Date(job.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className={styles.actions}>
                <button 
                  onClick={() => handleHide(job.id)} 
                  className={styles.hideBtn}
                  disabled={isPending}
                >
                  Hide
                </button>
                <button 
                  onClick={() => handleSave(job)} 
                  className={styles.saveBtn}
                  disabled={isPending}
                >
                  Save
                </button>
                <button 
                  onClick={() => handleApply(job.url)} 
                  className={styles.applyBtn}
                  disabled={isPending}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--card-border)', borderRadius: '12px' }}>
            No jobs synced yet. Add a source and click &quot;Sync &amp; Scrap Jobs&quot; to populate your queue.
          </div>
        )}
      </div>
    </div>
  )
}
