
interface NumericFilter {
    value?: null|number;
    condition?: null|'gte'|'lte';
}
interface TransactionFilter {
    direction: 'both'|'buy'|'sell';
    value?: NumericFilter;
    amount?: NumericFilter;
}

interface UserFilter {
    username?: string|null;
    key?: NumericFilter;
    balance?: NumericFilter;
    following?: NumericFilter;
    followers?: NumericFilter;
    posts?: NumericFilter;
    likes?: NumericFilter;
    age?: NumericFilter;
}

interface ViewOptions {
    results: 5|10|25|50|100;
    bots: boolean;
    balance: boolean;
    twitter: boolean;
}

interface FilterModel {
    transaction: TransactionFilter;
    trader: UserFilter;
    subject: UserFilter;
    view: ViewOptions;
}



export type {
    FilterModel,
    TransactionFilter,
    NumericFilter,
    ViewOptions,
    UserFilter
}
