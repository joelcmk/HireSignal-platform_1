import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import styles from "./page.module.css";
import Link from 'next/link';

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    return redirect('/dashboard')
  }

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>HireSignal</div>
        <div className={styles.navLinks}>
          <Link href="/login" className={styles.navLink}>Log in</Link>
          <Link href="/signup" className={styles.primaryButton}>Sign up</Link>
        </div>
      </nav>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.badge}>✨ Land Your Dream Job</div>
          <h1 className={styles.title}>
            Never Miss a <span className={styles.highlight}>Great Opportunity</span> Again
          </h1>
          <p className={styles.subtitle}>
            HireSignal automatically monitors company career pages and sends you personalized job alerts. Focus on preparing for interviews while we do the searching.
          </p>
          <div className={styles.ctas}>
            <Link href="/signup" className={`${styles.heroButton} ${styles.heroPrimary}`}>
              Start Job Hunting for Free
            </Link>
            <Link href="#features" className={`${styles.heroButton} ${styles.heroSecondary}`}>
              Learn More
            </Link>
          </div>
        </section>

        <section id="features" className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className={styles.featureTitle}>Automatic Job Monitoring</h3>
            <p className={styles.featureDesc}>Add your target companies and we&apos;ll continuously check their career pages for new openings that match your preferences.</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </div>
            <h3 className={styles.featureTitle}>Instant Alerts</h3>
            <p className={styles.featureDesc}>Get notified the moment new jobs matching your criteria are posted. Be the first to apply.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            </div>
            <h3 className={styles.featureTitle}>Track Applications</h3>
            <p className={styles.featureDesc}>Save jobs you&apos;re interested in and track your application status in one organized place.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            </div>
            <h3 className={styles.featureTitle}>Filter by Preferences</h3>
            <p className={styles.featureDesc}>Set filters for job titles, locations, and keywords. Only see jobs that matter to you.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className={styles.featureTitle}>Save Time</h3>
            <p className={styles.featureDesc}>No more manually checking dozens of career pages. We do the work so you can focus on interviews.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className={styles.featureTitle}>Free to Start</h3>
            <p className={styles.featureDesc}>No credit card required. Start monitoring jobs from your dream companies today.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
