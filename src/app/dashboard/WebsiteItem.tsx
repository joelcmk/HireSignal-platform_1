'use client'

import { useState, useTransition } from 'react'
import styles from "../page.module.css"
import DeleteWebsiteButton from './DeleteWebsiteButton'
import { getCompanyNameFromUrl, getCompanyEmoji, getFaviconUrl } from '@/utils/url-parser'
import { updateWebsite } from './actions'
import Modal from '@/components/Modal/Modal'

interface WebsiteItemProps {
  website: {
    id: string
    url: string
    created_at: string
  }
}

export default function WebsiteItem({ website }: WebsiteItemProps) {
  const [imageError, setImageError] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  
  // Helper to extract filters from URL
  const getInitialFilters = (urlString: string) => {
    try {
      const urlObj = new URL(urlString);
      const hash = urlObj.hash;
      if (!hash.startsWith('#filter:')) return { url: urlString.split('#')[0], title: '', location: '' };
      const params = new URLSearchParams(hash.replace('#filter:', ''));
      return {
        url: urlString.split('#')[0],
        title: params.get('title') || '',
        location: params.get('location') || ''
      };
    } catch (e) {
      return { url: urlString, title: '', location: '' };
    }
  }

  const initial = getInitialFilters(website.url);
  const [url, setUrl] = useState(initial.url)
  const [titleFilter, setTitleFilter] = useState(initial.title)
  const [locationFilter, setLocationFilter] = useState(initial.location)

  const companyName = getCompanyNameFromUrl(initial.url)
  const faviconUrl = getFaviconUrl(initial.url)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        const result = await updateWebsite(website.id, { 
          url, 
          title_filter: titleFilter, 
          location_filter: locationFilter 
        })
        if (result?.success) setIsModalOpen(false)
        else if (result?.error) alert(`Error: ${result.error}`)
      } catch (e: any) {
        alert(`Failed: ${e.message}`)
      }
    })
  }

  return (
    <>
      <div className={styles.websiteItem}>
        <div className={styles.websiteContent}>
          <div className={styles.websiteUrl}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              {!imageError ? (
                <img src={faviconUrl} alt={`${companyName} logo`} width={24} height={24} style={{ objectFit: 'contain' }} onError={() => setImageError(true)} />
              ) : (
                <span style={{ fontSize: '1.25rem' }}>{getCompanyEmoji(companyName)}</span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)' }}>{companyName}</span>
              <a href={initial.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none' }}>{initial.url}</a>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => setIsModalOpen(true)} className={styles.deleteButton} title="Edit Settings">⚙️</button>
            <DeleteWebsiteButton id={website.id} />
          </div>
        </div>

        {(initial.title || initial.location) && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            {initial.title && <span className={styles.badge} style={{ fontSize: '0.65rem' }}>🎯 {initial.title}</span>}
            {initial.location && <span className={styles.badge} style={{ fontSize: '0.65rem' }}>📍 {initial.location}</span>}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Edit ${companyName} Filters`}>
        <form onSubmit={handleUpdate} className={styles.form} style={{ gap: '1.25rem' }}>
          <div className={styles.inputGroup}><label className={styles.label}>Website URL</label>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} className={styles.input} required />
          </div>
          <div className={styles.inputGroup}><label className={styles.label}>Job Title Filter (e.g. Engineer)</label>
            <input type="text" value={titleFilter} onChange={e => setTitleFilter(e.target.value)} className={styles.input} placeholder="Optional keyword filter" />
          </div>
          <div className={styles.inputGroup}><label className={styles.label}>Location Filter (e.g. Remote)</label>
            <input type="text" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className={styles.input} placeholder="Optional location filter" />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className={styles.primary} style={{ flex: 1 }} disabled={isPending}>{isPending ? 'Saving...' : 'Save Settings'}</button>
            <button type="button" onClick={() => setIsModalOpen(false)} className={styles.secondarySmall} style={{ padding: '0 1.5rem' }}>Cancel</button>
          </div>
        </form>
      </Modal>
    </>
  )
}
