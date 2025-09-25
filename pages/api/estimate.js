export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { subscriptions = [], members_in_pool = 1 } = req.body

  function calcFor(sub) {
    const annual = Number(sub.monthly_spend || 0) * 12
    const baseReward = annual * (Number(sub.base_rate_pct || 1) / 100)
    const durationBonus = baseReward * Math.max(Number(sub.years_with_brand || 0) - 1, 0) * 0.10
    return {
      brand_name: sub.brand_name,
      category: sub.category || 'other',
      annual,
      baseReward,
      durationBonus
    }
  }

  const items = subscriptions.map(calcFor)
  const categoryCounts = {}
  items.forEach(i => categoryCounts[i.category] = (categoryCounts[i.category]||0)+1)
  items.forEach(i => { i.categoryBonus = (categoryCounts[i.category] >= 3) ? i.baseReward * 0.05 : 0 })

  const poolMultiplier = members_in_pool >= 2 ? 0.20 : 0
  items.forEach(i => i.poolBonus = (i.baseReward + i.durationBonus + i.categoryBonus) * poolMultiplier)
  items.forEach(i => i.total = i.baseReward + i.durationBonus + i.categoryBonus + i.poolBonus)

  const total = items.reduce((s, it) => s + it.total, 0)

  res.json({ items, total })
}
