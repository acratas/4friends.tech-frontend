import {User} from "./User";
import {BigNumber} from "ethers";

interface Transaction extends User {
    isBuy: boolean,
    timestamp: string,
    amount: number,
    fee: BigNumber,
    value: BigNumber,
    hash: string,
}

export type { Transaction }
