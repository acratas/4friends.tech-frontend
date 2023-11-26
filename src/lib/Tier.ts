const TIER = {
    'DIAMOND': '💎',
    'GOLD': '🥇',
    'SILVER': '🥈',
    'BRONZE': '🥉',
    'UNRANKED': '🚫',
}

export default (tier) => TIER[tier] || tier;
