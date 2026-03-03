import { chromium } from 'playwright';

interface ScrapedJob {
  title: string;
  url: string;
  company?: string;
  location?: string;
}

/**
 * Cleans a job title by removing common trailing metadata like location, category, or ID.
 */
function cleanJobTitle(title: string): string {
  // Remove trailing " - Location", " | Category", "(ID)", etc.
  return title
    .split(/ \-| \| | \(/)[0] // Split by common separators and take the first part
    .replace(/\s+/g, ' ')      // Clean up extra whitespace
    .trim();
}

/**
 * Universal Job Scraper
 * Uses Pattern Recognition and Structured Data to find jobs on ANY career site.
 */
export async function scrapeJobsFromUrl(url: string, defaultCompany?: string): Promise<ScrapedJob[]> {
  let browser;
  try {
    console.log(`🚀 [Universal Scraper] Analyzing ${url}...`);
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();

    // 1. Load the page and wait for content
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    
    // Give dynamic sites an extra 3 seconds to settle
    await page.waitForTimeout(3000);

    const jobs: ScrapedJob[] = [];

    /**
     * STRATEGY A: Structured Data (The most reliable method)
     * Look for Schema.org 'JobPosting' which is standard for SEO.
     */
    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();
    for (const script of jsonLdScripts) {
      try {
        const content = await script.evaluate(el => el.textContent);
        const data = JSON.parse(content || '{}');
        const items = Array.isArray(data) ? data : [data];
        
        items.forEach(item => {
          // Flatten @graph if present
          const postings = item['@graph'] ? item['@graph'] : [item];
          
          postings.forEach((p: any) => {
            const type = p['@type'];
            if (type === 'JobPosting' || type === 'Job' || (Array.isArray(type) && type.includes('JobPosting'))) {
              jobs.push({
                title: cleanJobTitle(p.title),
                url: p.url || url,
                company: defaultCompany || p.hiringOrganization?.name || 'Unknown',
                location: p.jobLocation?.address?.addressLocality || p.jobLocation?.address?.addressRegion
              });
            }
          });
        });
      } catch (e) {}
    }

    if (jobs.length > 0) {
      console.log(`✅ [Strategy A] Found ${jobs.length} jobs via Structured Data.`);
    }

    /**
     * STRATEGY B: Semantic Pattern Recognition
     * If no structured data, look for repeating elements that look like job cards.
     */
    if (jobs.length === 0) {
      console.log('🔍 [Strategy B] No JSON-LD found. Running Pattern Recognition...');
      
      // Look for common job link patterns
      const jobLinks = await page.locator('a').all();
      for (const link of jobLinks) {
        try {
          const text = (await link.innerText()).trim();
          const href = await link.getAttribute('href');
          
          // Must contain a job-like keyword
          const hasJobKeyword = /engineer|developer|designer|manager|specialist|lead|analyst|intern|senior|junior|staff|associate|opportunity|position|opening|career/i.test(text);
          
          // Filter out navigation/legal/social
          const isNotNav = !/privacy|terms|cookie|contact|about|login|signin|signup|register|facebook|twitter|linkedin|instagram|youtube/i.test(text);
          
          if (hasJobKeyword && isNotNav && href && href.length > 5 && !href.startsWith('mailto:')) {
            let fullUrl = href;
            if (href.startsWith('/')) {
              const origin = new URL(url).origin;
              fullUrl = origin + href;
            }
            
            if (!jobs.find(j => j.url === fullUrl)) {
              jobs.push({ title: cleanJobTitle(text), url: fullUrl, company: defaultCompany });
            }
          }
        } catch (e) {}
      }
      console.log(`✅ [Strategy B] Found ${jobs.length} jobs via Link Patterns.`);
    }

    /**
     * STRATEGY C: Table/List Analysis
     * Look for common career site structures like <table> or lists of links.
     */
    if (jobs.length === 0) {
      const listSelectors = ['table tr', 'li', '.job-item', '.posting', '.opening'];
      for (const selector of listSelectors) {
        const elements = await page.locator(selector).all();
        if (elements.length > 5) { // Heuristic: Job lists usually have several items
           for (const el of elements) {
             const text = await el.innerText();
             const link = el.locator('a').first();
             if (await link.count() > 0) {
               const title = cleanJobTitle(text.split('\n')[0]);
               const href = await link.getAttribute('href');
               if (title.length > 5 && href && !jobs.find(j => j.url === href)) {
                 jobs.push({ title, url: href, company: defaultCompany });
               }
             }
           }
        }
        if (jobs.length > 0) break;
      }
    }

    console.log(`✨ [Universal Scraper] Final count: ${jobs.length} jobs.`);
    return jobs;

  } catch (error) {
    console.error(`❌ [Scraper] Error:`, error);
    return [];
  } finally {
    if (browser) await browser.close();
  }
}
