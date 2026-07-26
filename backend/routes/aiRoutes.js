import express from 'express'
import axios from 'axios'

const router = express.Router()

// In-memory cache for AI growth guides to optimize speed and API usage
const guideCache = new Map()

/**
 * Helper to fetch growth instructions from Gemini API
 */
async function generateGrowthGuide(productName, category = 'plants', subCategory = 'indoor') {
  const cacheKey = `${productName.toLowerCase().trim()}_${category}_${subCategory}`
  if (guideCache.has(cacheKey)) {
    return guideCache.get(cacheKey)
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in backend environment')
  }

  const prompt = `You are an expert horticulturalist and plant care consultant for GreenCart.
Provide clear, actionable growing instructions for the plant or seed named: "${productName}" (Category: ${category}, Subcategory: ${subCategory}).

Respond ONLY with a valid JSON object matching this exact schema (no markdown wrap, no backticks, just raw JSON):
{
  "productName": "${productName}",
  "suitableTemperature": "e.g. 18°C - 28°C (65°F - 82°F)",
  "properSoil": "e.g. Well-draining organic potting mix enriched with compost and perlite (pH 6.0-6.8)",
  "wateringSchedule": "e.g. Water every 5-7 days when top 1-2 inches of soil feels dry. Do not overwater.",
  "sunlightNeed": "e.g. Bright indirect sunlight for 4-6 hours daily",
  "plantingSteps": [
    "Step 1 text...",
    "Step 2 text...",
    "Step 3 text..."
  ],
  "proTips": [
    "Tip 1 text...",
    "Tip 2 text..."
  ]
}`

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

  const response = await axios.post(
    url,
    {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    },
    { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
  )

  const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!rawText) {
    throw new Error('Empty response received from Gemini API')
  }

  let parsedData
  try {
    parsedData = JSON.parse(rawText)
  } catch (err) {
    const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim()
    parsedData = JSON.parse(cleaned)
  }

  guideCache.set(cacheKey, parsedData)
  return parsedData
}

// GET /api/ai/growth-guide
router.get('/growth-guide', async (req, res) => {
  try {
    const { name, category, subCategory } = req.query
    if (!name) {
      return res.status(400).json({ success: false, error: 'Product name is required' })
    }

    const guide = await generateGrowthGuide(name, category, subCategory)
    res.json({ success: true, data: guide })
  } catch (error) {
    console.error('AI Growth Guide Error:', error.message)

    // Fallback response if API key fails or network error occurs
    const fallbackGuide = {
      productName: req.query.name || 'Plant/Seed Item',
      suitableTemperature: '18°C - 28°C (Ideal for home & garden growth)',
      properSoil: 'Rich, well-draining potting soil with organic compost mix',
      wateringSchedule: 'Water when top 1 inch of soil feels dry (approx 2-3 times per week)',
      sunlightNeed: 'Bright indirect sunlight for 4 to 6 hours daily',
      plantingSteps: [
        'Prepare a well-draining pot or garden bed with fresh potting mix.',
        'Sow seed or transfer sapling carefully into center hole.',
        'Gently water at the base and place in a bright location.'
      ],
      proTips: [
        'Avoid letting water stagnate in the drainage tray.',
        'Apply organic liquid fertilizer once every month during active growth.'
      ],
      isFallback: true
    }

    res.json({
      success: true,
      data: fallbackGuide,
      notice: 'Serving offline recommendations (Gemini connection issue)'
    })
  }
})

// POST /api/ai/ask-doctor
router.post('/ask-doctor', async (req, res) => {
  try {
    const { question, productName } = req.body
    if (!question) {
      return res.status(400).json({ success: false, error: 'Question is required' })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'GEMINI_API_KEY not configured' })
    }

    const prompt = `You are GreenCart's AI Gardening Doctor. The user is asking about plant "${productName || 'General Plant'}":
Question: "${question}"

Give a friendly, concise, expert 2-3 paragraph answer explaining how to fix the issue, optimal watering/soil/temp tweaks, and prevention tips.`

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

    const response = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7 }
      },
      { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
    )

    const answer = response.data?.candidates?.[0]?.content?.parts?.[0]?.text
    res.json({ success: true, answer })
  } catch (error) {
    console.error('AI Doctor Error:', error.message)
    res.json({
      success: true,
      answer: `🌿 GreenCart AI Gardening Doctor Tip for ${req.body.productName || 'your plant'}:\n\nYellowing leaves or growth issues usually stem from overwatering, poor drainage, or nitrogen deficiency. Ensure your pot has proper drainage holes, allow the top 1-2 inches of soil to dry out between waterings, and keep the plant in bright indirect light.`
    })
  }
})

export default router
