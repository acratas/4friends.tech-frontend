import {BigNumber, ethers} from "ethers";

export const isEthAddress = (address: string) => /^0x[a-fA-F0-9]{40}$/.test(address);
export const formatTwitterNumbers = (num: number) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num ? num.toString() : (num === 0 ? '0' : '?');
}

export const toEth = (value: any) => {
    try {
        value = BigNumber.from(value);
    } catch (e) {
        value = BigNumber.from(0);
    }
    return ethers.utils.formatEther(value.sub(value.mod(1e13)))
}

export const notEmpty = (value: any) => value !== null && value !== undefined && value !== '';

