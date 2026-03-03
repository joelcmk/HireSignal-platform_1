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
        <div className={styles.logo}>Hiresignal</div>
        <div className={styles.navLinks}>
          <Link href="/login" className={styles.navLink}>Log in</Link>
          <Link href="/signup" className={styles.primaryButton}>Sign up</Link>
        </div>
      </nav>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.badge}>✨ Next Generation Hiring</div>
          <h1 className={styles.title}>
            Discover Top Talent with <span className={styles.highlight}>Precision</span>
          </h1>
          <p className={styles.subtitle}>
            Hiresignal empowers your team to find, evaluate, and hire the best candidates faster than ever before. Built for modern teams.
          </p>
          <div className={styles.ctas}>
            <Link href="/signup" className={`${styles.heroButton} ${styles.heroPrimary}`}>
              Get Started for Free
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
            <h3 className={styles.featureTitle}>Smart Sourcing</h3>
            <p className={styles.featureDesc}>Leverage advanced algorithms to uncover passive candidates that perfectly match your job requirements.</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <h3 className={styles.featureTitle}>Collaborative Hiring</h3>
            <p className={styles.featureDesc}>Bring your entire team into the process with shared notes, real-time feedback, and unified scoring.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className={styles.featureTitle}>Lightning Fast</h3>
            <p className={styles.featureDesc}>Experience a platform built for speed. Cut down your time-to-hire with automated workflows.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
