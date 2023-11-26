import {BigNumber} from "ethers";

type AcceptableNumber = BigNumber | string | number;

class FriendTech {
    private protocolFeePercent: BigNumber;
    private subjectFeePercent: BigNumber;

    constructor(protocolFeePercent: AcceptableNumber = '50000000000000000', subjectFeePercent: AcceptableNumber = '50000000000000000') {
        this.protocolFeePercent = this.toBigNumber(protocolFeePercent);
        this.subjectFeePercent = this.toBigNumber(subjectFeePercent);
    }

    private toBigNumber(value: AcceptableNumber): BigNumber {
        return BigNumber.from(value);
    }

    getPrice(supply: AcceptableNumber, amount: AcceptableNumber): BigNumber {
        const bnSupply = this.toBigNumber(supply);
        const bnAmount = this.toBigNumber(amount);
        const sixteenThousand = BigNumber.from(16000);

        supply = bnSupply.toNumber();
        amount = bnAmount.toNumber();

        const sum1 = supply === 0 ? 0 : (supply - 1 )* (supply) * (2 * (supply - 1) + 1) / 6;
        const sum2 = supply === 0 && amount === 1 ? 0 : (supply - 1 + amount) * (supply + amount) * (2 * (supply - 1 + amount) + 1) / 6;
        const summation = this.toBigNumber(sum2 - sum1);

        return summation.mul(BigNumber.from("1000000000000000000")).div(sixteenThousand);
    }

    getBuyPrice(supply: AcceptableNumber, amount: AcceptableNumber): BigNumber {
        return this.getPrice(supply, amount);
    }

    getSellPrice(supply: AcceptableNumber, amount: AcceptableNumber): BigNumber {
        return this.getPrice(this.toBigNumber(supply).sub(this.toBigNumber(amount)), amount);
    }

    getBuyPriceAfterFee(supply: AcceptableNumber, amount: AcceptableNumber): BigNumber {
        const price = this.getBuyPrice(supply, amount);
        const protocolFee = price.mul(this.protocolFeePercent).div(BigNumber.from("1000000000000000000"));
        const subjectFee = price.mul(this.subjectFeePercent).div(BigNumber.from("1000000000000000000"));
        return price.add(protocolFee).add(subjectFee);
    }

    getSellPriceAfterFee(supply: AcceptableNumber, amount: AcceptableNumber): BigNumber {
        const price = this.getSellPrice(supply, amount);
        const protocolFee = price.mul(this.protocolFeePercent).div(BigNumber.from("1000000000000000000"));
        const subjectFee = price.mul(this.subjectFeePercent).div(BigNumber.from("1000000000000000000"));
        return price.sub(protocolFee).sub(subjectFee);
    }
}

export { FriendTech }
