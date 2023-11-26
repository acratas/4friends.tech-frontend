interface UserItem {
    address: string
    supply: number
    twitterName?: string
    twitterPfpUrl?: string
    twitterUsername?: string
    twitterFollowers?: number
}

interface Paginator {
    page: number
    pageSize: number
    count: number
}

interface StatUndervaluedFilter {
    minPrice: number
    maxPrice: number
    minFollowers: number
    maxFollowers: number
    sortField: 'supply' | 'price' | 'followers'
    sortOrder: 'asc' | 'desc'
}
interface StatUndervaluedPaginator extends Paginator {
    filter: StatUndervaluedFilter
}

interface StatUndervaluedResponse {
    error?: string
    items?: UserItem[],
    paginator?: StatUndervaluedPaginator
}

export type {
    StatUndervaluedFilter,
    StatUndervaluedResponse,
    UserItem
}
