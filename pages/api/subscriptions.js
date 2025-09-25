import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  const { method } = req
  if (method === 'POST') {
    const { user_id, subscriptions } = req.body
    if (!user_id) return res.status(400).json({ error: 'user_id required' })
    const { data, error } = await supabase.from('subscriptions').insert(
      subscriptions.map(s => ({
        user_id,
        brand_name: s.brand_name,
        category: s.category,
        monthly_spend: s.monthly_spend,
        years_with_brand: s.years_with_brand,
        base_rate_pct: s.base_rate_pct
      }))
    )
    if (error) return res.status(500).json({ error })
    return res.json({ data })
  }
  res.status(405).end()
}
