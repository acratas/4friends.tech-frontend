import {BigNumber} from "ethers";
import {PortfolioItem} from "./Portfolio";

interface User {
    address: string,
    twitterName: string
    twitterPfpUrl: string
    twitterUsername: string
    supply: number,
    twitterFollowers?: number
    watchlistCount?: number,
    twitterFriendsCount?: number,
    twitterVerified?: number,
    twitterFavoritesCount?: number,
    twitterStatusesCount?: number,
    twitterCreatedAt?: number,
    selfHoldings?: number,

}

interface MainUser extends User {
    balance: BigNumber
    displayPrice: BigNumber
    holdersCount: number
    holdingCount: {
        users: number
        keys: number
    },
    portfolioValue: BigNumber
    totalBuyValue: BigNumber
    totalSellValue: BigNumber
    gasFees: BigNumber
    tradingFeesEarned: BigNumber
    portfolio?: {
        [key: string]: number
    }
    points?: number,
    leaderboard?: number,
    tier?: string,
}

export type {MainUser, User}
