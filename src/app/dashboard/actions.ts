'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { scrapeJobsFromUrl } from '@/utils/scraper'
import { getCompanyNameFromUrl, getCleanUrl } from '@/utils/url-parser'
import { redirect } from 'next/navigation'

export async function syncJobs() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'User must be logged in', totalJobsFound: 0, allJobs: [] }

  const { data: websites } = await supabase.from('websites').select('*').eq('user_id', user.id)
  
  if (!websites || websites.length === 0) {
    await supabase.from('jobs').delete().eq('user_id', user.id)
    revalidatePath('/dashboard')
    return { success: true, message: 'All job sources removed. Job queue cleared.', totalJobsFound: 0, allJobs: [] }
  }

  // Cleanup orphan jobs
  const currentCompanies = new Set(websites.map(w => getCompanyNameFromUrl(getCleanUrl(w.url)).toLowerCase().trim()));
  const { data: existingJobs } = await supabase.from('jobs').select('id, company').eq('user_id', user.id);
  if (existingJobs) {
    const idsToDelete = existingJobs.filter(j => !j.company || !currentCompanies.has(j.company.toLowerCase().trim())).map(j => j.id);
    if (idsToDelete.length > 0) await supabase.from('jobs').delete().in('id', idsToDelete);
  }

  let totalJobsFound = 0;
  const allJobs: any[] = [];

  for (const website of websites) {
    const cleanUrl = getCleanUrl(website.url);
    const companyName = getCompanyNameFromUrl(cleanUrl);
    
    // Scrape ALL jobs (No filtering here per user request)
    const scrapedJobs = await scrapeJobsFromUrl(cleanUrl, companyName);
    
    const jobsToInsert = scrapedJobs.map(job => ({
      user_id: user.id,
      title: job.title,
      company: companyName,
      location: job.location || 'Remote',
      url: job.url,
      source_url: cleanUrl,
      status: 'new'
    }));

    if (jobsToInsert.length > 0) {
      const { error } = await supabase.from('jobs').upsert(jobsToInsert, { onConflict: 'user_id,url' })
      if (!error) {
        totalJobsFound += jobsToInsert.length;
        allJobs.push({
          url: cleanUrl,
          jobsFound: jobsToInsert.length,
          jobs: jobsToInsert
        });
      }
    } else {
      allJobs.push({
        url: cleanUrl,
        jobsFound: 0,
        jobs: []
      });
    }
  }

  revalidatePath('/dashboard')
  return { success: true, totalJobsFound, allJobs, message: `Successfully updated your job database.` }
}

export async function addWebsite(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User must be logged in')

  let url = formData.get('url') as string
  const title = formData.get('title_filter') as string
  const location = formData.get('location_filter') as string

  if (!url) throw new Error('URL is required')

  if (title || location) {
    const params = new URLSearchParams();
    if (title) params.append('title', title);
    if (location) params.append('location', location);
    url = `${url.split('#')[0]}#filter:${params.toString()}`;
  }

  const { error } = await supabase.from('websites').insert([{ user_id: user.id, url }])
  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateWebsite(websiteId: string, data: { url: string, title_filter?: string, location_filter?: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User must be logged in')

  let url = data.url.split('#')[0];
  if (data.title_filter || data.location_filter) {
    const params = new URLSearchParams();
    if (data.title_filter) params.append('title', data.title_filter);
    if (data.location_filter) params.append('location', data.location_filter);
    url = `${url}#filter:${params.toString()}`;
  }

  const { error } = await supabase.from('websites').update({ url }).match({ id: websiteId, user_id: user.id })
  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteWebsite(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Auth required' }

  const { data: ws } = await supabase.from('websites').select('url').match({ id, user_id: user.id }).single()
  await supabase.from('websites').delete().match({ id, user_id: user.id })

  const { data: remaining } = await supabase.from('websites').select('id').eq('user_id', user.id)
  if (!remaining || remaining.length === 0) {
    await supabase.from('jobs').delete().eq('user_id', user.id)
  } else if (ws) {
    const company = getCompanyNameFromUrl(getCleanUrl(ws.url))
    await supabase.from('jobs').delete().eq('user_id', user.id).ilike('company', company)
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function hideJob(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Auth required' }
  await supabase.from('jobs').update({ status: 'hidden' }).match({ id, user_id: user.id })
  revalidatePath('/dashboard')
  return { success: true }
}

export async function clearAllJobs() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Auth required' }
  await supabase.from('jobs').delete().eq('user_id', user.id)
  revalidatePath('/dashboard')
  return { success: true }
}

export async function saveJob(jobData: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Auth required' }
  await supabase.from('saved_jobs').insert([{
    user_id: user.id,
    job_id: jobData.id.toString(),
    url: jobData.url,
    title: jobData.title,
    company: jobData.company,
    location: jobData.location,
    posted_at: jobData.created_at
  }])
  revalidatePath('/dashboard')
  return { success: true }
}

export async function unsaveJob(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Auth required' }
  await supabase.from('saved_jobs').delete().match({ id, user_id: user.id })
  revalidatePath('/dashboard')
  return { success: true }
}
