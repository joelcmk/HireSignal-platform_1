import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import styles from "../../page.module.css";
import Link from 'next/link';
import SavedJobItem from './SavedJobItem';

export default async function SavedJobsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch saved jobs for the current user
  const { data: savedJobs, error } = await supabase
    .from('saved_jobs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase fetch error:', error)
  }

  return (
    <div className={styles.mainContent}>
      <section className={styles.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className={styles.sectionTitle}>Saved Jobs</h1>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {savedJobs?.length || 0} jobs saved
          </span>
        </div>
        <p className={styles.subtitle}>Review and manage the job openings you&apos;ve saved for later.</p>
      </section>

      <section className={styles.section}>
        <div className={styles.websiteList} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {savedJobs && savedJobs.length > 0 ? (
            savedJobs.map((job: any) => (
              <SavedJobItem key={job.id} job={job} />
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>You haven&apos;t saved any jobs yet.</p>
              <Link href="/dashboard" className={styles.primary} style={{ marginTop: '1rem', display: 'inline-block' }}>
                Browse Suggested Jobs
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
