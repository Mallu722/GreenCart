import React, { useState, useEffect } from 'react'
import { aiAPI } from '../utils/api'

const AiGrowthGuideCard = ({ productName, category, subCategory, compact = false }) => {
  const [guide, setGuide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [question, setQuestion] = useState('')
  const [doctorAnswer, setDoctorAnswer] = useState('')
  const [doctorLoading, setDoctorLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    const fetchGuide = async () => {
      if (!productName) return
      try {
        setLoading(true)
        const res = await aiAPI.getGrowthGuide(productName, category, subCategory)
        if (isMounted && res.data?.success) {
          setGuide(res.data.data)
        }
      } catch (err) {
        console.error('Error fetching growth guide:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchGuide()
    return () => { isMounted = false }
  }, [productName, category, subCategory])

  const handleAskDoctor = async (e) => {
    e.preventDefault()
    if (!question.trim()) return
    try {
      setDoctorLoading(true)
      setDoctorAnswer('')
      const res = await aiAPI.askDoctor(productName, question)
      if (res.data?.success) {
        setDoctorAnswer(res.data.answer)
      }
    } catch (err) {
      setDoctorAnswer('Sorry, AI Doctor is unable to process your question at the moment. Please try again.')
    } finally {
      setDoctorLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-emerald-900/5 rounded-2xl p-6 border border-emerald-500/20 shadow-sm animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-emerald-600/30 rounded-full"></div>
          <div className="h-6 bg-emerald-600/20 rounded w-1/2"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-emerald-600/10 rounded w-full"></div>
          <div className="h-4 bg-emerald-600/10 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (!guide) return null

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-emerald-500/30 relative overflow-hidden my-6">
      {/* Subtle background glow effect */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-700/50 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl shadow-inner">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-emerald-300">AI Plant Growing & Care Advisor</h3>
              <span className="bg-emerald-400/20 text-emerald-300 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-emerald-400/30">
                Gemini AI
              </span>
            </div>
            <p className="text-xs text-emerald-200/70">Custom growing suggestions for {guide.productName || productName}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl border border-emerald-500/20 self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-200/70 hover:text-white'
            }`}
          >
            🌱 Fundamentals
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'steps' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-200/70 hover:text-white'
            }`}
          >
            📋 How to Grow
          </button>
          <button
            onClick={() => setActiveTab('doctor')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'doctor' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-200/70 hover:text-white'
            }`}
          >
            💬 Ask AI Doctor
          </button>
        </div>
      </div>

      {/* Tab Content: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Temperature */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-emerald-500/20 flex items-start gap-3 hover:border-emerald-500/40 transition">
            <span className="text-2xl p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">🌡️</span>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-300">Suitable Temperature</h4>
              <p className="text-sm font-medium text-slate-100 mt-1">{guide.suitableTemperature}</p>
            </div>
          </div>

          {/* Soil */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-emerald-500/20 flex items-start gap-3 hover:border-emerald-500/40 transition">
            <span className="text-2xl p-2 bg-amber-700/20 border border-amber-700/30 rounded-lg">🪴</span>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-200">Proper Soil Mix</h4>
              <p className="text-sm font-medium text-slate-100 mt-1">{guide.properSoil}</p>
            </div>
          </div>

          {/* Water */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-emerald-500/20 flex items-start gap-3 hover:border-emerald-500/40 transition">
            <span className="text-2xl p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">💧</span>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Watering Schedule</h4>
              <p className="text-sm font-medium text-slate-100 mt-1">{guide.wateringSchedule}</p>
            </div>
          </div>

          {/* Sunlight */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-emerald-500/20 flex items-start gap-3 hover:border-emerald-500/40 transition">
            <span className="text-2xl p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">☀️</span>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-yellow-300">Sunlight Needs</h4>
              <p className="text-sm font-medium text-slate-100 mt-1">{guide.sunlightNeed}</p>
            </div>
          </div>

          {/* Pro Tips */}
          {guide.proTips && guide.proTips.length > 0 && (
            <div className="md:col-span-2 bg-emerald-950/60 p-4 rounded-xl border border-emerald-500/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                <span>💡</span> AI Pro Tips for Best Yield & Health
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-100">
                {guide.proTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Steps */}
      {activeTab === 'steps' && (
        <div className="bg-slate-800/60 p-5 rounded-xl border border-emerald-500/20">
          <h4 className="text-sm font-bold text-emerald-300 mb-3 flex items-center gap-2">
            <span>🌱</span> Step-by-Step Planting & Growing Instructions
          </h4>
          <div className="space-y-3">
            {guide.plantingSteps?.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  {idx + 1}
                </span>
                <p className="mt-0.5 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: AI Doctor */}
      {activeTab === 'doctor' && (
        <div className="bg-slate-800/60 p-5 rounded-xl border border-emerald-500/20">
          <h4 className="text-sm font-bold text-emerald-300 mb-1 flex items-center gap-2">
            <span>🪴</span> Ask Gemini AI Doctor about {productName}
          </h4>
          <p className="text-xs text-emerald-200/70 mb-4">Got specific questions about yellow leaves, watering frequency, or soil setup?</p>

          <form onSubmit={handleAskDoctor} className="space-y-3">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={`e.g. How often should I add fertilizer to ${productName}? Or why are the leaves turning yellow?`}
              className="w-full bg-slate-950/80 text-white text-xs p-3 rounded-lg border border-emerald-500/30 focus:outline-none focus:border-emerald-400 resize-none h-20"
            />
            <button
              type="submit"
              disabled={doctorLoading || !question.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
            >
              {doctorLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Consulting Gemini AI...
                </>
              ) : (
                <><span>✨</span> Get AI Doctor Advice</>
              )}
            </button>
          </form>

          {doctorAnswer && (
            <div className="mt-4 p-4 bg-emerald-950/80 rounded-lg border border-emerald-400/30 text-xs text-slate-200 leading-relaxed whitespace-pre-line animate-fadeIn">
              <div className="font-bold text-emerald-300 mb-2 flex items-center gap-1.5">
                <span>🩺</span> AI Plant Doctor Diagnosis:
              </div>
              {doctorAnswer}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AiGrowthGuideCard
