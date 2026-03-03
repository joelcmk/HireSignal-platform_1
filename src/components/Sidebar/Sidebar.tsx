'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import styles from '@/app/page.module.css'
import { signOut } from '@/app/login/actions'

interface SidebarProps {
  userEmail: string
}

export default function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navLinks = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      )
    },
    { 
      name: 'Saved Jobs', 
      href: '/dashboard/saved-jobs', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    { 
      name: 'Collections', 
      href: '/dashboard/collections', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8a2 2 0 0 0-2-2h-5l-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z" />
        </svg>
      )
    },
    { 
      name: 'Analytics', 
      href: '#', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    }
  ]

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`}>
      <div className={styles.sidebarHeader}>
        <div className={styles.sidebarHeaderTop}>
          <div className={styles.logo}>
            <span className={styles.logoFull}>Hiresignal</span>
            <span className={styles.logoCompact}>HS</span>
          </div>
          <button
            type="button"
            className={styles.sidebarToggle}
            onClick={() => setIsCollapsed((current) => !current)}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isCollapsed ? (
                <polyline points="9 18 15 12 9 6" />
              ) : (
                <polyline points="15 18 9 12 15 6" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      <nav className={styles.sidebarNav}>
        {navLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link 
              key={link.name} 
              href={link.href}
              title={isCollapsed ? link.name : undefined}
              className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}
            >
              {link.icon}
              <span className={styles.sidebarLinkLabel}>{link.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.sidebarFooterInfo} style={{ marginBottom: '1rem', overflow: 'hidden' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Logged in as</p>
          <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail}</p>
        </div>
        <form action={signOut}>
          <button 
            type="submit"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.625rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--danger, #ef4444)',
              backgroundColor: 'transparent',
              border: '1px solid var(--danger, #ef4444)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--danger, #ef4444)'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--danger, #ef4444)'
            }}
            title={isCollapsed ? 'Sign out' : undefined}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className={styles.signOutText}>Sign out</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
