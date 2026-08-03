// Data source: Remotive's public remote-jobs JSON API (https://remotive.com/api/remote-jobs).
// Reads are unauthenticated — no API key. The API documents that jobs are delayed
// by ~24h and that listing jobs must link back to Remotive (non-commercial use).

export interface RemotiveJob {
  id: number
  url: string
  title: string
  company_name: string | null
  company_logo: string | null
  category: string | null
  tags: string[]
  job_type: string | null
  publication_date: string | null
  candidate_required_location: string | null
  salary: string | null
  description: string | null
}

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

const UA = "remotive-search-skill/1.0"

/** GET a JSON payload from the Remotive API with retry/backoff on 429/5xx. */
export async function apiGet<T>(url: string): Promise<T | null> {
  const maxRetries = 4
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    let response: Response
    try {
      response = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "application/json" },
        redirect: "follow",
        signal: AbortSignal.timeout(20000),
      })
    } catch (e) {
      throw new Error(`could not reach Remotive API (${e instanceof Error ? e.message : String(e)})`)
    }
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) {
        throw new Error(`Remotive API request failed: ${response.status} ${response.statusText}`)
      }
      await sleep(delay + Math.floor(Math.random() * 400))
      delay = Math.min(delay * 2, 8000)
      continue
    }
    const body = (await response.json().catch(() => null)) as T | null
    if (!response.ok) {
      throw new Error(`Remotive API request failed: ${response.status} ${response.statusText}`)
    }
    return body
  }
  throw new Error("Remotive API request failed after retries")
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

/** Strip HTML from a Remotive description into readable prose. */
export function cleanHtml(html: string | null | undefined): string | null {
  if (!html) return null
  const withBreaks = html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|ul|ol|div|h\d)>/gi, "\n")
  const text = withBreaks
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
  return text || null
}
