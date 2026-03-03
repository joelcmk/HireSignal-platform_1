import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import styles from "../page.module.css";
import AddWebsiteForm from './AddWebsiteForm';
import JobQueue from './JobQueue';
import WebsiteItem from './WebsiteItem';
import SyncJobsButton from './SyncJobsButton';
import Sidebar from '@/components/Sidebar/Sidebar';
import ClearJobsButton from './ClearJobsButton';
import { getCleanUrl, parseFiltersFromUrl } from '@/utils/url-parser';

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // 1. Fetch websites
  const { data: websites } = await supabase
    .from('websites')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // 2. Fetch all 'new' jobs
  const { data: allJobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'new')
    .order('created_at', { ascending: false })

  // 3. APPLY FILTERS FOR DISPLAY
  const filteredJobs = (allJobs || []).filter(job => {
    // Find the website source for this job
    const sourceWebsite = websites?.find(w => getCleanUrl(w.url) === job.source_url);
    if (!sourceWebsite) return false;

    const { title: titleFilter, location: locationFilter } = parseFiltersFromUrl(sourceWebsite.url);
    
    let matches = true;
    if (titleFilter && !job.title.toLowerCase().includes(titleFilter.toLowerCase())) matches = false;
    if (locationFilter && !(job.location || '').toLowerCase().includes(locationFilter.toLowerCase())) matches = false;
    
    return matches;
  });

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar userEmail={user.email} />
      
      <main className={styles.mainWrapper}>
        <div className={styles.mainContent}>
          <section className={styles.section}>
            <h1>Welcome back!</h1>
            <p className={styles.subtitle}>Your personalized job search tools are ready.</p>
          </section>

          {/* Website Management Section */}
          <section className={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 className={styles.sectionTitle}>Job Search Sources</h3>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <SyncJobsButton />
                <AddWebsiteForm />
              </div>
            </div>
            <p className={styles.cardDescription}>Monitor company career pages and job boards for new openings.</p>
            
            <div className={styles.websiteList} style={{ marginTop: '0.5rem' }}>
              {websites && websites.length > 0 ? (
                websites.map((website: any) => (
                  <WebsiteItem key={website.id} website={website} />
                ))
              ) : (
                <div className={styles.emptyState}>
                  <p>No websites added yet. Click the button above to add your first job search source!</p>
                </div>
              )}
            </div>
          </section>

          {/* Suggested Jobs Section */}
          {websites && websites.length > 0 && (
            <section className={styles.section}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className={styles.sectionTitle}>Suggested for You</h3>
                <ClearJobsButton />
              </div>
              <JobQueue initialJobs={filteredJobs} />
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
