import React, {createContext, useContext, useEffect, useState} from 'react';
import {MainUser, User} from "../lib/User";
import {PortfolioItem} from "../lib/Portfolio";
import {Transaction} from "../lib/Transaction";
import {useAddress, useContract, useContractRead, useSDK} from "@thirdweb-dev/react";
import {BigNumber} from "ethers";
import {FriendTech} from "../lib/FriendTech";
import {isEthAddress} from "../lib/Utils";
import {StatUndervaluedFilter, StatUndervaluedResponse} from "../lib/Responses";
import {getCaptchaToken} from "../lib/Captcha";
import {useLoggedUser} from "./LoggedUserProvider";
import {useInterval} from "../lib/Hooks";
import {UserCache} from "./RecentTransactions/UserCache";
import Auth from "../lib/Auth";

const ApiContext = createContext<{
    user: MainUser | null,
    portfolio: PortfolioItem[],
    holders: PortfolioItem[],
    transactions: Transaction[],
    flipHistory: any[],
    history: any[],
    loadData: (address: string, fn: (i: number) => any) => Promise<void>,
    fetchUserData: (address: string) => Promise<any>,
    getAutocompleteResults: (query: string) => Promise<User[]>,
    getUndervaluedUsers: (params?: any) => Promise<StatUndervaluedResponse | null>,
    fetchShort: (address: string) => Promise<any>,
    login: (signature: string) => Promise<any>,
    refreshToken: () => Promise<boolean>,
    baseUrl: string,

}>({
    user: null,
    portfolio: [],
    holders: [],
    transactions: [],
    flipHistory: [],
    history: [],
    loadData: async (address: string, parseInt) => {
    },
    fetchUserData: async (address: string) => {

    },
    getAutocompleteResults: async (query: string) => [],
    getUndervaluedUsers: async (params?: any) => null,
    fetchShort: async (address: string) => ({}),
    login: async (signature: string) => ({}),
    refreshToken: async () => false,
    baseUrl: '',
});

export const useApi = () => {
    return useContext(ApiContext);
};

//sleep function
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const cacheData = (input: string, data: any) => {
    const currentTime = Date.now(); // Znacznik czasu w milisekundach
    const cacheObject = {
        timestamp: currentTime,
        data: data
    };
    sessionStorage.setItem(`autocomplete-${input}`, JSON.stringify(cacheObject));
}

const getCachedData = (input: string, delay: number = 3600000) => {
    const cachedString = sessionStorage.getItem(`autocomplete-${input}`);
    if (!cachedString) return null;

    const cachedData = JSON.parse(cachedString);
    const currentTime = Date.now();

    if (currentTime - cachedData.timestamp > delay) {
        return null;
    }
    return cachedData.data;
}

// @ts-ignore
export const ApiProvider = ({children, baseUrl = ''}) => {

    const address = useAddress();
    const sdk = useSDK();
    const {contract} = useContract('0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4');
    const {setLoggedUser} = useLoggedUser();
    const {
        data: protocolFeePercentData
    } = useContractRead(contract, "protocolFeePercent");
    const {
        data: subjectFeePercentData
    } = useContractRead(contract, "subjectFeePercent");

    const [user, setUser] = useState<MainUser | null>(null);
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [holders, setHolders] = useState<PortfolioItem[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [flipHistory, setFlipHistory] = useState<any[]>([]);


    useEffect(() => {
        // console.log('useEffect', address)
        fetchLoggedUserData(address); // Pobierz dane użytkownika przy pierwszym montowaniu komponentu
    }, [address]);

    useInterval(() => {
        fetchLoggedUserData(address); // Pobierz dane użytkownika co godzinę
    }, 3600000); // 3600000 ms = 1 godzina

    const fetchLoggedUserData = async (address: string | undefined) => {
        if (!address) return;
        try {
            const data = await fetchUserData(address);
            if (!data) return setLoggedUser(null);
            if (data.user.address === address?.toLowerCase()) {
                const loggedUser = data.user;
                // @ts-ignore
                loggedUser.portfolio = data.portfolio.reduce((acc: { [key: string]: number }, p: PortfolioItem) => {
                    acc[p.address] = p.balance;
                    return acc;
                }, {});
                setLoggedUser(loggedUser);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const fetchUserData = async (address: string) => {
        // console.warn('fetchUserData', address)
        if (!address) return;

        let url = `${baseUrl}/users/${address.toLowerCase()}`;
        if (address === 'random-holder') {
            url = `${baseUrl}/users/my/random/holder`;
        }
        const friendTech = new FriendTech(
            BigNumber.from(protocolFeePercentData?.value || '50000000000000000'),
            BigNumber.from(subjectFeePercentData?.value || '50000000000000000'),
        );
        const response = await fetch(url);
        const data = await response.json();
        if (!data.user) {
            throw new Error('User not found');
        }
        const user = {
            address: data.user._id,
            twitterName: data.user.twitterName,
            twitterUsername: data.user.twitterUsername,
            twitterPfpUrl: data.user.twitterPfpUrl,
            holdingCount: {
                users: 0,
                keys: 0
            },
            holdersCount: 0,
            balance: (await sdk?.getBalance(data.user._id))?.value || BigNumber.from(0),
            displayPrice: friendTech.getBuyPriceAfterFee(data.user.supply, 1),
            supply: data.user.supply,
            portfolioValue: BigNumber.from(0),
            totalBuyValue: BigNumber.from(0),
            totalSellValue: BigNumber.from(0),
            gasFees: BigNumber.from(0),
            tradingFeesEarned: BigNumber.from(data.feeEarned ?? 0),

            watchlistCount: data.user.watchlistCount,
            twitterFollowers: data.user.followers_count,
            twitterFriendsCount: data.user.twitterFriendsCount,
            twitterVerified: data.user.twitterVerified,
            twitterFavoritesCount: data.user.twitterFavoritesCount,
            twitterStatusesCount: data.user.twitterStatusesCount,
            twitterCreatedAt: data.user.twitterCreatedAt,

            points: data.user.points,
            leaderboard: data.user.leaderboard,
            tier: data.user.tier,

            selfHoldings: data.user.selfHoldings,
        };
        const portfolio: {
            [key: string]: PortfolioItem
        } = {};
        const transactions = data.transactions
            .filter((t: any) => user.address === t.trader)
            .reverse()
            .map((t: any) => {

                const tx = {
                    address: t.subject,
                    twitterName: t?.user.twitterName,
                    twitterUsername: t?.user.twitterUsername,
                    twitterPfpUrl: t?.user.twitterPfpUrl,
                    userSupply: t?.user.supply ?? 0,
                    selfHoldings: t?.user.selfHoldings ?? 0,
                    supply: t.supply,
                    isBuy: t.isBuy,
                    timestamp: t.timestamp || null,
                    amount: t.amount,
                    value: t.isBuy ?
                        (BigNumber.from("0").sub(t.value).sub(t.subjectFee).sub(t.protocolFee)) :
                        BigNumber.from(t.value).sub(t.subjectFee).sub(t.protocolFee),
                    hash: t._id,
                    fee: BigNumber.from(`-${t.fee || 0}`),
                }

                if (!(tx.address in portfolio)) {
                    portfolio[tx.address] = {
                        address: tx.address,
                        twitterName: tx.twitterName,
                        twitterUsername: tx.twitterUsername,
                        twitterPfpUrl: tx.twitterPfpUrl,
                        selfHoldings: tx.selfHoldings,
                        supply: tx.userSupply,
                        balance: 0,
                        value: BigNumber.from(0),
                        buys: [],
                    };
                }



                if (tx.amount) {
                    if (tx.isBuy) {
                        const value = tx.amount > 0 ? tx.value.sub(tx.fee || 0).div(tx.amount) : tx.value;
                        portfolio[tx.address].buys?.push(...Array(tx.amount).fill(value));
                    } else {
                        portfolio[tx.address].buys?.splice(0, tx.amount);
                    }

                    portfolio[tx.address].balance = tx.isBuy ?
                        portfolio[tx.address].balance + tx.amount :
                        portfolio[tx.address].balance - tx.amount;
                }

                user.totalBuyValue = user.totalBuyValue.add(tx.isBuy ? tx.value : BigNumber.from(0));
                user.totalSellValue = user.totalSellValue.add(tx.isBuy ? BigNumber.from(0) : tx.value);
                user.gasFees = user.gasFees.sub(t.fee || 0);

                return tx;
            })
            .reverse();

        const flipTransactions: any = {};
        const flipHistory: any[] = [];
        [...transactions]
            .reverse()
            .sort((a: any, b: any) => a.isBuy === b.isBuy ? 0 : a.isBuy ? -1 : 1)
            .forEach(tx => {
                if (!(tx.address in flipTransactions)) {
                    flipTransactions[tx.address] = [];
                }
                if (tx.isBuy) {
                    const value = tx.amount > 0 ? tx.value.div(tx.amount) : tx.value;
                    flipTransactions[tx.address].push(...Array(tx.amount).fill({
                        ...tx,
                        value
                    }))
                } else {
                    flipHistory.push({
                        sell: {
                            ...tx,
                            supply: tx.userSupply
                        },
                        buy: flipTransactions[tx.address]
                            .splice(0, tx.amount)
                            .reduce((acc, t) => ({
                                ...t,
                                value: acc.value.add(t.value)
                            }), {
                                value: BigNumber.from(0)
                            })
                    })
                }
            });
        flipHistory.reverse();

        const arrPortfolio = Object.values(portfolio)
            .filter((p: PortfolioItem) => p.balance > 0)
            .map((p: PortfolioItem) => {
                const value = friendTech.getSellPriceAfterFee(p.supply, p.balance);
                user.portfolioValue = user.portfolioValue.add(value);
                user.holdingCount.users++;
                user.holdingCount.keys += p.balance;
                const cost = p.buys?.reduce((acc: BigNumber, b: BigNumber) => acc.add(b), BigNumber.from(0));
                const pnl = {
                    value: value.add(cost || BigNumber.from(0)),
                    //@ts-ignore
                    percentage: cost.abs() > 0 ? value.add(cost).mul(BigNumber.from("100")).div(cost.abs()).toNumber() : 0
                }
                return {
                    ...p,
                    value,
                    pnl
                }
            })
            .sort((a, b) => b.value.gt(a.value) ? 1 : -1)

        const holders = data.holders
            .reduce((acc: { [key: string]: PortfolioItem }, h: any) => {
                // console.log(h.trader, h.isBuy, h.amount, h.isBuy ? h.amount : -h.amount)
                if (!acc[h.trader]) {
                    acc[h.trader] = {
                        address: h.trader,
                        twitterName: h?.user.twitterName,
                        twitterUsername: h?.user.twitterUsername,
                        twitterPfpUrl: h?.user.twitterPfpUrl,
                        supply: h?.user.supply ?? 0,
                        balance: 0,
                        value: BigNumber.from(0)
                    }
                }
                acc[h.trader].balance += h.isBuy ? h.amount : -h.amount;
                acc[h.trader].value = friendTech.getSellPriceAfterFee(user.supply, acc[h.trader].balance);
                user.tradingFeesEarned = user.tradingFeesEarned.add(h.subjectFee);
                return acc;
            }, {});

        // console.log(holders)
        // console.groupEnd();
        // @ts-ignore
        const arrHolders = Object.values(holders).filter((p: PortfolioItem) => p.balance > 0).sort((a, b) => b.value.gt(a.value) ? 1 : -1);
        user.holdersCount = arrHolders.length;


        return {
            user,
            portfolio: arrPortfolio,
            holders: arrHolders,
            transactions,
            flipHistory,
            history: data.transactions
        }
    }

    const loadData = async (loadAddress: string, fn: (i: number) => any) => {

        if (!isEthAddress(loadAddress) &&
            !loadAddress.match(/^[0-9_a-zA-Z]+$/) &&
            loadAddress !== 'random-holder'
        ) {
            return fn(0);
        }

        fn(1);
        setUser(null);
        setPortfolio([]);
        setTransactions([]);


        let data;
        try {
            data = await fetchUserData(loadAddress)
        } catch (e) {
            console.error(e);
            return fn(0);
        }
        fn(1);

        // console.log(data);

        setUser(data.user);
        setPortfolio(data.portfolio);
        setTransactions(data.transactions);
        setHistory(data.history);
        // @ts-ignore
        setHolders(data.holders);
        setFlipHistory(data.flipHistory);

        fn(0);

        if (data.user.address === address?.toLowerCase()) {
            const loggedUser = data.user;
            loggedUser.portfolio = data.portfolio.reduce((acc: { [key: string]: number }, p: PortfolioItem) => {
                acc[p.address] = p.balance;
                return acc;
            }, {});
            setLoggedUser(loggedUser);
        }

    }

    const fetchShort = async (address: string) => {
        if (!address) return;
        let url = `${baseUrl}/users/short/${address}`;
        try {
            const data = await fetch(url);
            const result = await data.json();
            console.log(result);
            return result;
        } catch (e) {
            console.error(e);
            return {};
        }
    };


    const getAutocompleteResults = async (input: string) => {
        if (input.length < 3) return [];
        let data = getCachedData(input);
        if (data) return data;
        const url = `${baseUrl}/users/autocomplete/${input}`;
        try {
            data = await fetch(url);
        } catch (e) {
            data = [];
            cacheData(input, data);
            return data;
        }
        data = await data.json();
        data = data.map((user: any) => ({
            twitterName: user.twitterName,
            twitterUsername: user.twitterUsername,
            twitterPfpUrl: user.twitterPfpUrl,
            twitterFollowers: user.followers_count,
            supply: user.supply,
            address: user._id,
        }));
        cacheData(input, data);
        return data;
    }

    const getUndervaluedUsers = async (params?: any) => {
        const captchaToken = await getCaptchaToken();
        // const captchaToken = 'test';
        const data = await fetch(`${baseUrl}/api/undervalued`, {
            method: 'POST', // używając metody POST
            headers: {
                'Content-Type': 'application/json', // informując serwer, że wysyłasz JSON
                'x-captcha-token': captchaToken
            },
            body: JSON.stringify(params || {}), // konwertując obiekt na JSON
        });
        return data.json();
    }

    const login = async (signature: string) => {
        const captchaToken = await getCaptchaToken();
        const data = await fetch(`${baseUrl}/api/auth/token`, {
            method: 'POST', // używając metody POST
            headers: {
                'Content-Type': 'application/json', // informując serwer, że wysyłasz JSON
                'x-captcha-token': captchaToken
            },
            body: JSON.stringify({signature}), // konwertując obiekt na JSON
        });
        return data.json();
    }

    const refreshToken = async () => {
        const captchaToken = await getCaptchaToken();
        const data = await fetch(`${baseUrl}/api/auth/refresh`, {
            method: 'POST', // używając metody POST
            headers: {
                'Content-Type': 'application/json', // informując serwer, że wysyłasz JSON
                'x-captcha-token': captchaToken
            },
            body: JSON.stringify({
                token: Auth.getToken(),
            }), // konwertując obiekt na JSON
        });
        const {token} = await data.json();
        if (token) {
            Auth.setToken(token);
            return true;
        } else {
            Auth.removeToken();
            return false;
        }
    }

    UserCache.getInstance().setLoadUserCallback(fetchShort);

    // @ts-ignore
    return (
        <ApiContext.Provider value={{
            user,
            portfolio,
            holders,
            transactions,
            flipHistory,
            history,
            loadData,
            getAutocompleteResults,
            getUndervaluedUsers,
            fetchUserData,
            fetchShort,
            login,
            refreshToken,
            baseUrl
        }}>
            {children}
        </ApiContext.Provider>
    );
};
