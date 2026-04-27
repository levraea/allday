import { Router } from 'express'

const router = Router()

function buildSystemPrompt() {
  const today = new Date().toISOString().slice(0, 10)
  return `You extract task fields from user text. Respond with ONLY valid JSON, no markdown fences, using this shape:
{"title":"string","description":"string or empty","priority":"high"|"medium"|"low","dueDate":"YYYY-MM-DD or null","suggestedProjectName":"string or null"}
Infer priority from urgency words. Parse relative dates using today as reference when the user says tomorrow, next Friday, etc.

Today (UTC date for reference): ${today}`
}

function getProvider() {
  const p = (process.env.AI_PROVIDER || 'gemini').toLowerCase().trim()
  return p === 'openai' ? 'openai' : 'gemini'
}

function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || ''
}

async function callGemini(systemPrompt, userText) {
  const apiKey = getGeminiApiKey()
  if (!apiKey) {
    const err = new Error(
      'GEMINI_API_KEY (or GOOGLE_API_KEY) is not configured on the server'
    )
    err.status = 503
    throw err
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`

  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userText.trim() }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    }),
  })

  const data = await r.json().catch(() => ({}))

  if (!r.ok) {
    console.error('Gemini error', r.status, JSON.stringify(data).slice(0, 500))
    const err = new Error('AI provider request failed')
    err.status = 502
    throw err
  }

  if (data.error) {
    console.error('Gemini API error', data.error)
    const err = new Error('AI provider request failed')
    err.status = 502
    throw err
  }

  const parts = data.candidates?.[0]?.content?.parts
  const content = parts?.map((p) => p.text).join('')?.trim()
  if (!content) {
    const err = new Error('Empty AI response')
    err.status = 502
    throw err
  }
  return content
}

async function callOpenAI(systemPrompt, userText) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    const err = new Error('OPENAI_API_KEY is not configured on the server')
    err.status = 503
    throw err
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userText.trim() },
      ],
    }),
  })

  if (!r.ok) {
    const t = await r.text()
    console.error('OpenAI error', r.status, t)
    const err = new Error('AI provider request failed')
    err.status = 502
    throw err
  }

  const data = await r.json()
  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) {
    const err = new Error('Empty AI response')
    err.status = 502
    throw err
  }
  return content
}

function parseModelJson(content) {
  const clean = content
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
  return JSON.parse(clean)
}

router.post('/parse-task', async (req, res, next) => {
  try {
    const { text, defaultProjectId } = req.body
    if (!text || typeof text !== 'string' || !text.trim()) {
      const err = new Error('text is required')
      err.status = 400
      throw err
    }

    const systemPrompt = buildSystemPrompt()
    const provider = getProvider()
    const raw =
      provider === 'openai'
        ? await callOpenAI(systemPrompt, text)
        : await callGemini(systemPrompt, text)

    let parsed
    try {
      parsed = parseModelJson(raw)
    } catch {
      const err = new Error('AI returned invalid JSON')
      err.status = 422
      throw err
    }

    const title = typeof parsed.title === 'string' ? parsed.title.trim() : ''
    if (!title) {
      const err = new Error('AI did not produce a title')
      err.status = 422
      throw err
    }

    res.json({
      title,
      description: typeof parsed.description === 'string' ? parsed.description : '',
      priority: ['high', 'medium', 'low'].includes(parsed.priority)
        ? parsed.priority
        : 'medium',
      dueDate:
        parsed.dueDate && parsed.dueDate !== 'null' ? String(parsed.dueDate) : null,
      suggestedProjectName:
        parsed.suggestedProjectName && typeof parsed.suggestedProjectName === 'string'
          ? parsed.suggestedProjectName
          : null,
      defaultProjectId: defaultProjectId || null,
    })
  } catch (e) {
    next(e)
  }
})

export default router
