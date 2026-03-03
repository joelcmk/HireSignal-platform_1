import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY || process.env.MINIMAX_API_KEY
  const baseUrl = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1'
  const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing GROQ_API_KEY' },
      { status: 500 }
    )
  }

  const body = await request.json().catch(() => ({}))
  const title = String(body?.title || '').trim()
  if (!title) {
    return NextResponse.json({ error: 'Missing title' }, { status: 400 })
  }

  const prompt = [
    'Return a JSON array of 6-12 common profession names or short keywords that are synonyms or very similar to this job title.',
    'Only return the JSON array with strings, no extra text.',
    `Job title: "${title}"`,
  ].join('\n')

  const requestBody = {
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    max_tokens: 200,
  }
  const endpoint = '/chat/completions'
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  })

  const data = await response.json().catch(() => ({}))
  return NextResponse.json(
    {
      ok: response.ok,
      provider: 'groq',
      model,
      endpoint,
      response: data,
    },
    { status: response.status }
  )
}
