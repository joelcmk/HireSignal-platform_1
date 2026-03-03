import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Sidebar from '@/components/Sidebar/Sidebar'
import styles from '../page.module.css'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar userEmail={user.email || ''} />
      <div className={styles.contentWrapper}>
        {children}
      </div>
    </div>
  )
}
