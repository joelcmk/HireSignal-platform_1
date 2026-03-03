'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Modal from '@/components/Modal/Modal'
import styles from '../page.module.css'
import { addCollection, type CollectionItem } from './collections/storage'

interface CreateCollectionButtonProps {
  onCreate?: (collection: CollectionItem) => void
}

export default function CreateCollectionButton({ onCreate }: CreateCollectionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [jobTitle, setJobTitle] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [liveSuggestions, setLiveSuggestions] = useState<string[]>([])
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown> | null>(null)
  const requestIdRef = useRef(0)

  const commonProfessions = useMemo(
    () => [
      'Software Engineer',
      'Product Manager',
      'Data Scientist',
      'Data Analyst',
      'UX Designer',
      'UI Designer',
      'Product Designer',
      'Marketing Manager',
      'Sales Representative',
      'Account Executive',
      'Customer Success Manager',
      'Business Analyst',
      'Project Manager',
      'Operations Manager',
      'HR Manager',
      'Recruiter',
      'Financial Analyst',
      'Accountant',
      'DevOps Engineer',
      'QA Engineer',
      'Security Engineer',
      'Backend Engineer',
      'Frontend Engineer',
      'Full Stack Engineer',
      'Mobile Developer',
      'Machine Learning Engineer',
      'Content Strategist',
      'Social Media Manager',
    ],
    []
  )

  async function fetchKeywordSuggestions(title: string) {
    const requestBody = {
      title,
    }
    try {
      const response = await fetch('/api/minimax/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      setDebugInfo({
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        response: data,
      })

      if (!response.ok) return []

      const text =
        data?.response?.choices?.[0]?.message?.content ??
        data?.response?.choices?.[0]?.text ??
        data?.response?.result ??
        ''
      const raw = typeof text === 'string' ? text.trim() : ''
      if (!raw) return []

      let parsed: unknown = null
      try {
        parsed = JSON.parse(raw)
      } catch {
        const match = raw.match(/\[[\s\S]*\]/)
        if (match) {
          try {
            parsed = JSON.parse(match[0])
          } catch {
            parsed = null
          }
        }
      }

      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => String(item).trim())
          .filter((item) => item.length > 0 && item.toLowerCase() !== title.toLowerCase())
          .slice(0, 12)
      }

      const lineParsed = raw
        .split(/\r?\n/)
        .map((line) => line.replace(/^[-*\d.\s]+/, '').trim())
        .filter((line) => line.length > 0)
        .slice(0, 12)

      return lineParsed
        .filter((item) => item.toLowerCase() !== title.toLowerCase())
        .slice(0, 12)
    } catch (err) {
      setDebugInfo({ error: String(err) })
      return []
    }
  }

  const fallbackSuggestions = useMemo(() => {
    const query = jobTitle.trim().toLowerCase()
    if (!query) return commonProfessions.slice(0, 8)

    const ranked = commonProfessions
      .map((item) => {
        const value = item.toLowerCase()
        const starts = value.startsWith(query) ? 2 : 0
        const includes = value.includes(query) ? 1 : 0
        return { item, score: starts + includes }
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.item.localeCompare(b.item))
      .map((entry) => entry.item)

    return ranked.length > 0 ? ranked.slice(0, 8) : commonProfessions.slice(0, 8)
  }, [jobTitle, commonProfessions])

  useEffect(() => {
    const query = jobTitle.trim()
    if (!query) {
      setLiveSuggestions(fallbackSuggestions)
      setIsSuggesting(false)
      return
    }

    const requestId = ++requestIdRef.current
    setIsSuggesting(true)
    const timer = setTimeout(async () => {
      const results = await fetchKeywordSuggestions(query)
      if (requestIdRef.current !== requestId) return
      if (results.length > 0) {
        setLiveSuggestions(results)
      } else {
        setLiveSuggestions(fallbackSuggestions)
      }
      setIsSuggesting(false)
    }, 350)

    return () => {
      clearTimeout(timer)
    }
  }, [jobTitle, fallbackSuggestions])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = jobTitle.trim()
    if (!trimmed) {
      setError('Job title is required.')
      return
    }

    setError(null)
    setIsLoading(true)
    console.log('Suggest collection names for job title:', trimmed)
    try {
      const generatedSuggestions = await fetchKeywordSuggestions(trimmed)
      const fallback = fallbackSuggestions
        .filter((item) => item.toLowerCase() !== trimmed.toLowerCase())
        .slice(0, 10)
      const synonyms = generatedSuggestions.length > 0 ? generatedSuggestions : fallback
      const collection: CollectionItem = {
        id: crypto.randomUUID(),
        title: trimmed,
        createdAt: new Date().toISOString(),
        synonyms,
      }
      addCollection(collection)
      if (onCreate) onCreate(collection)
    } finally {
      setIsLoading(false)
      resetModal()
    }
  }

  function resetModal() {
    setIsOpen(false)
    setJobTitle('')
    setError(null)
    setIsLoading(false)
    setDebugInfo(null)
  }

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={styles.primary}>
        Create a new collection
      </button>

      <Modal isOpen={isOpen} onClose={resetModal} title="Create a new collection">
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Job title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              className={styles.input}
              placeholder="e.g. Software Engineer"
              maxLength={60}
              autoFocus
            />
          </div>

          <div
            style={{
              border: '1px solid var(--card-border)',
              borderRadius: '10px',
              overflow: 'hidden',
              background: 'var(--card-bg)',
            }}
          >
            {liveSuggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setJobTitle(item)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.65rem 0.85rem',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--card-border)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.background = 'var(--secondary-hover)'
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.background = 'transparent'
                }}
              >
                {item}
              </button>
            ))}
          </div>

          {isSuggesting && (
            <p className={styles.cardDescription}>Finding similar roles…</p>
          )}
          {error && <p className={styles.errorMessage}>{error}</p>}
          {debugInfo && (
            <div style={{ marginTop: '0.5rem' }}>
              <p className={styles.cardDescription}>Debug</p>
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--card-border)',
                  background: 'var(--secondary-bg)',
                  fontSize: '0.75rem',
                  lineHeight: 1.4,
                }}
              >
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="submit" className={styles.primary} disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Next'}
            </button>
            <button type="button" className={styles.cancelButton} onClick={resetModal}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
