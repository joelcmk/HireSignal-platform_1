'use client'

import { useState, useTransition } from 'react'
import { unsaveJob } from '../actions'
import styles from "../../page.module.css"

interface SavedJobItemProps {
  job: {
    id: string
    title: string
    company: string
    location?: string
    salary?: string
    posted_at?: string
    url: string
    match_score?: number
  }
}

export default function SavedJobItem({ job }: SavedJobItemProps) {
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const handleUnsave = async () => {
    startTransition(async () => {
      setFeedback(null)
      try {
        const result = await unsaveJob(job.id)
        if (result?.error) {
          setFeedback({ type: 'error', message: `Error unsaving job: ${result.error}` })
        } else {
          setFeedback({ type: 'success', message: 'Job removed from saved jobs.' })
        }
      } catch (e: unknown) {
        setFeedback({
          type: 'error',
          message: `Failed to unsave job: ${e instanceof Error ? e.message : 'Unknown error'}`,
        })
      }
    })
  }

  const handleApply = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={styles.websiteItem} style={{ opacity: isPending ? 0.7 : 1, padding: '1.5rem' }}>
      <div className={styles.websiteContent}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-main)' }}>{job.title}</span>
            {job.match_score && (
              <span style={{ padding: '0.25rem 0.5rem', fontSize: '0.625rem', fontWeight: '700', borderRadius: '4px', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)' }}>
                {job.match_score}% Match
              </span>
            )}
          </div>
          <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{job.company}</span>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>📍 {job.location || 'Remote'}</span>
            {job.salary && <span>💰 {job.salary}</span>}
            {job.posted_at && <span>🕒 {job.posted_at}</span>}
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={handleUnsave} 
              className={styles.secondarySmall}
              disabled={isPending}
              style={{ padding: '0.5rem 1rem' }}
            >
              Unsave
            </button>
            <button 
              onClick={() => handleApply(job.url)} 
              className={styles.primary}
              disabled={isPending}
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              Apply Now
            </button>
          </div>
          {feedback && (
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: feedback.type === 'success' ? '#15803d' : '#dc2626',
              }}
            >
              {feedback.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
