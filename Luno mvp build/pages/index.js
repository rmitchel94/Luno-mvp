import { useState } from 'react'

export default function Home() {
  const [rows, setRows] = useState([
    { brand_name: 'Netflix', category: 'Streaming', monthly_spend: 20, years_with_brand: 2, base_rate_pct: 5 },
    { brand_name: 'Spotify', category: 'Streaming', monthly_spend: 10, years_with_brand: 1, base_rate_pct: 4 },
  ])
  const [members, setMembers] = useState(1)
  const [estimate, setEstimate] = useState(null)
  const [loading, setLoading] = useState(false)

  const updateRow = (i, patch) => {
    const copy = rows.slice()
    copy[i] = { ...copy[i], ...patch }
    setRows(copy)
  }

  const addRow = () => setRows([...rows, { brand_name: '', category: 'Other', monthly_spend: 0, years_with_brand: 0, base_rate_pct: 1 }])

  async function compute() {
    setLoading(true)
    const res = await fetch('/api/estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptions: rows, members_in_pool: members })
    })
    const data = await res.json()
    setEstimate(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen p-6">
      <header className="max-w-3xl mx-auto text-center py-8">
        <h1 className="text-4xl font-bold">Luno — Loyalty That Pays</h1>
        <p className="mt-2 text-gray-300">Estimate your cash-back from subscriptions you already pay for.</p>
      </header>

      <main className="max-w-3xl mx-auto bg-slate-900 p-6 rounded-lg">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-5 gap-2 items-center mb-3">
            <input className="col-span-2 p-2 rounded" value={r.brand_name} onChange={e=>updateRow(i,{brand_name:e.target.value})} />
            <input className="p-2 rounded" value={r.monthly_spend} type="number" onChange={e=>updateRow(i,{monthly_spend: Number(e.target.value)})} />
            <input className="p-2 rounded" value={r.years_with_brand} type="number" onChange={e=>updateRow(i,{years_with_brand: Number(e.target.value)})} />
            <input className="p-2 rounded" value={r.base_rate_pct} type="number" onChange={e=>updateRow(i,{base_rate_pct: Number(e.target.value)})} />
          </div>
        ))}
        <div className="flex gap-2 mb-4">
          <button className="px-4 py-2 bg-violet-600 rounded" onClick={addRow}>Add subscription</button>
          <input className="p-2 rounded w-32" type="number" value={members} onChange={(e)=>setMembers(Number(e.target.value))} />
          <span className="self-center text-gray-300">Members in pool</span>
          <button className="ml-auto px-4 py-2 bg-green-500 rounded" onClick={compute} disabled={loading}>{loading ? 'Calculating...' : 'Estimate'}</button>
        </div>

        {estimate && (
          <div className="bg-slate-800 p-4 rounded">
            <h3 className="text-lg font-semibold">Estimated Annual Rewards: ${Math.round(estimate.total)}</h3>
            <ul className="mt-2">
              {estimate.items.map((it, idx) => (
                <li key={idx} className="text-sm mt-2">
                  <strong>{it.brand_name}</strong>: ${Math.round(it.total)} ({it.category})
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  )
}
