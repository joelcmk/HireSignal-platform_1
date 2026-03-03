'use client'

import { useState } from 'react'
import styles from '../../page.module.css'
import CreateCollectionButton from '../CreateCollectionButton'
import { readCollections, writeCollections, type CollectionItem } from './storage'

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionItem[]>(() => readCollections())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftTitle, setDraftTitle] = useState('')
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  function persist(next: CollectionItem[]) {
    setCollections(next)
    writeCollections(next)
  }

  function handleCreate(collection: CollectionItem) {
    setFeedback({ type: 'success', message: 'Collection created.' })
    setCollections((prev) => [collection, ...prev])
  }

  function handleStartEdit(collection: CollectionItem) {
    setFeedback(null)
    setEditingId(collection.id)
    setDraftTitle(collection.title)
  }

  function handleCancelEdit() {
    setEditingId(null)
    setDraftTitle('')
  }

  function handleSaveEdit(id: string) {
    const trimmed = draftTitle.trim()
    if (!trimmed) {
      setFeedback({ type: 'error', message: 'Collection name cannot be empty.' })
      return
    }

    const next = collections.map((collection) =>
      collection.id === id ? { ...collection, title: trimmed } : collection
    )
    persist(next)
    handleCancelEdit()
    setFeedback({ type: 'success', message: 'Collection updated.' })
  }

  function handleDelete(id: string) {
    const next = collections.filter((collection) => collection.id !== id)
    persist(next)
    if (editingId === id) handleCancelEdit()
    setFeedback({ type: 'success', message: 'Collection deleted.' })
  }

  const sortedCollections = collections

  return (
    <div className={styles.mainContent}>
      <section className={styles.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h1 className={styles.sectionTitle}>Collections</h1>
          <CreateCollectionButton onCreate={handleCreate} />
        </div>
        <p className={styles.subtitle}>Organize your saved opportunities into custom groups.</p>
        {feedback && (
          <p
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: feedback.type === 'success' ? '#15803d' : '#dc2626',
            }}
          >
            {feedback.message}
          </p>
        )}
      </section>

      <section className={styles.section}>
        {sortedCollections.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No collections yet.</p>
            <p className={styles.cardDescription}>Create one from your dashboard to start organizing jobs.</p>
          </div>
        ) : (
          <div className={styles.websiteList}>
            {sortedCollections.map((collection) => (
              <div key={collection.id} className={styles.card}>
                {editingId === collection.id ? (
                  <>
                    <input
                      type="text"
                      value={draftTitle}
                      onChange={(event) => setDraftTitle(event.target.value)}
                      className={styles.input}
                      maxLength={60}
                      autoFocus
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className={styles.primary}
                        onClick={() => handleSaveEdit(collection.id)}
                      >
                        Save
                      </button>
                      <button type="button" className={styles.cancelButton} onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3>{collection.title}</h3>
                    <p className={styles.cardDescription}>
                      Created {new Date(collection.createdAt).toLocaleDateString()}
                    </p>
                    {collection.synonyms?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {collection.synonyms.map((item) => (
                          <span
                            key={item}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: '999px',
                              background: 'var(--secondary-bg)',
                              border: '1px solid var(--card-border)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={() => handleStartEdit(collection)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(collection.id)}
                        style={{
                          padding: '0.75rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: 'var(--danger, #ef4444)',
                          background: 'transparent',
                          border: '1px solid var(--danger, #ef4444)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
