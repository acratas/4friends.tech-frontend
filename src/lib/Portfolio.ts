import {User} from "./User";
import {BigNumber} from "ethers";

interface PortfolioItem extends User {
    balance: number,
    value: BigNumber,
    buys?: Array<BigNumber>,
    pnl?: {
        percentage: number,
        value: BigNumber,
    },
}


export type { PortfolioItem }
