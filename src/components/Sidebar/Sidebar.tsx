'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from '@/app/page.module.css'
import { signOut } from '@/app/login/actions'

interface SidebarProps {
  userEmail: string
}

export default function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname()

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
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>Hiresignal</div>
      </div>
      
      <nav className={styles.sidebarNav}>
        {navLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}
            >
              {link.icon}
              {link.name}
            </Link>
          )
        })}
      </nav>

      <div className={styles.sidebarFooter}>
        <div style={{ marginBottom: '1rem', overflow: 'hidden' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Logged in as</p>
          <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail}</p>
        </div>
        <form action={signOut}>
          <button className={styles.secondarySmall} style={{ width: '100%' }} type="submit">
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
