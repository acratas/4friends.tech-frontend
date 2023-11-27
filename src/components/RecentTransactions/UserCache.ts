import {notEmpty} from "../../lib/Utils";
import {FriendTech} from "../../lib/FriendTech";
import {FilterModel, UserFilter} from "./FilterModel";
import {isAllowedNumeric, yearsSince} from "./FilterHelper";
import {getBuyPrice} from "../../lib/BuyPrice";

const ft = new FriendTech();

class TxCache {
    private static instance: TxCache;
    private txs: {[key: string]: boolean} = {};

    private constructor() {
    }

    static getInstance(): TxCache {
        if (!TxCache.instance) {
            TxCache.instance = new TxCache();
        }
        return TxCache.instance;
    }

    public add(tx: string): void {
        this.txs[tx] = true;
    }

    public has(tx: string): boolean {
        return tx in this.txs;
    }
}
class UserCache {
    private static instance: UserCache;
    private users: {[key: string]: any} = {};
    private loadUserCallback: ((address: string) => Promise<any>) | undefined;

    private callbackStack: {[address: string]: ((address: string) => any)[]} = {};
    private getBalance: ((address: string) => Promise<number>) | undefined;


    private constructor() {
    }

    static getInstance(): UserCache {
        if (!UserCache.instance) {
            UserCache.instance = new UserCache();
        }
        return UserCache.instance;
    }

    public setLoadUserCallback(callback: (address: string) => Promise<any>) {
        this.loadUserCallback = callback;
    }

    public setGetBalanceCallback(getBalance: (address: string) => Promise<number>) {
        this.getBalance = getBalance;
    }

    public async getUser(address: string): Promise<void> {
        if (!this.loadUserCallback) {
            return
        }
        if (!this.users[address]) {
            const user = await this.loadUserCallback(address);
            if (user?.address === address) {
                this.users[address] = user;
            }
        }
        return this.users[address] || {address};
    }

    public async allowUser(user: any, filter: UserFilter): Promise<boolean>
    {
        if (user?.twitterUsername && notEmpty(filter.username)) {
            //@ts-ignore
            const re = new RegExp(filter.username, 'i');
            if (!re.test(user.twitterUsername) && !re.test(user.twitterName)) {
                return false;
            }
        }
        if (!isAllowedNumeric(getBuyPrice(user.supply) || 0, filter.key)) {
            return false;
        }
        if (!isAllowedNumeric(user.twitterFriendsCount || 0, filter.following)) {
            return false;
        }
        if (!isAllowedNumeric(user.followers_count || 0, filter.followers)) {
            return false;
        }
        if (!isAllowedNumeric(user.twitterStatusesCount || 0, filter.posts)) {
            return false;
        }
        if (!isAllowedNumeric(user.twitterFavoritesCount || 0, filter.likes)) {
            return false;
        }
        console.warn(user.twitterCreatedAt, yearsSince(user.twitterCreatedAt), filter.age);
        if (!isAllowedNumeric(yearsSince(user.twitterCreatedAt) , filter.age)) {
            return false;
        }
        if (filter.balance?.value && filter.balance?.condition && this.getBalance) {
            const balance = await this.getBalance(user.address);
            //@ts-ignore
            if (!isAllowedNumeric(balance, filter.balance)) {
                return false;
            }
        }
        return true;
    }

    public async loadData(data: any, callback: (data: any) => any, filter: FilterModel): Promise<void> {
        if (!this.loadUserCallback) {
            // console.error(50, data);
            return
        }
        data.trader = await this.getUser(data.trader);

        data.subject = await this.getUser(data.subject);
        if (data.trader.address === data.subject.address) {
            data.trader = data.subject;
        }
        if (!filter.view.bots && (
            !(data.trader.twitterUsername && data.subject.twitterUsername))) {
            // console.error(72, data);
            return;
        }
        if (!filter.view.bots) {
            if ('followers_count' in data.trader && 'followers_count' in data.subject) {
                if (data.trader.followers_count < 1 || data.subject.followers_count < 1) {
                    // console.error(`Removed ${data.tx} because of show_bots: not ${values.show_bots} ${data.trader.followers_count} ${data.subject.followers_count}`)
                    return;
                }
            }
        }
        if (!await this.allowUser(data.trader, filter.trader)) {
            return;
        }
        if (!await this.allowUser(data.subject, filter.subject)) {
            return;
        }
        callback(data);
    }
}

export {UserCache, TxCache}
