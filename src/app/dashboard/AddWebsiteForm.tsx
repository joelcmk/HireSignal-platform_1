'use client'

import { useState, useTransition, useRef } from 'react'
import { addWebsite } from './actions'
import styles from "../page.module.css"
import Modal from '@/components/Modal/Modal'

export default function AddWebsiteForm() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      try {
        const result = await addWebsite(formData)
        if (result?.error) {
          setError(result.error)
        } else {
          setIsModalOpen(false)
          formRef.current?.reset()
        }
      } catch (e: any) {
        setError(e.message || 'An unexpected error occurred')
      }
    })
  }

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)} 
        className={styles.primary}
        style={{ width: 'auto' }}
      >
        ➕ Add New Source
      </button>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add Job Search Source"
      >
        <form ref={formRef} onSubmit={handleSubmit} className={styles.form} style={{ gap: '1.25rem' }}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Careers Website URL</label>
            <input
              type="url"
              name="url"
              placeholder="https://company.com/careers"
              required
              className={styles.input}
              disabled={isPending}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Job Title Filter (Optional)</label>
            <input 
              type="text" 
              name="title_filter"
              placeholder="e.g. Software Engineer"
              className={styles.input}
              disabled={isPending}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Location Filter (Optional)</label>
            <input 
              type="text" 
              name="location_filter"
              placeholder="e.g. Remote"
              className={styles.input}
              disabled={isPending}
            />
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button 
              type="submit" 
              className={styles.primary} 
              style={{ flex: 1 }}
              disabled={isPending}
            >
              {isPending ? 'Adding...' : 'Add Source'}
            </button>
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className={styles.secondarySmall}
              style={{ padding: '0 1.5rem' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
