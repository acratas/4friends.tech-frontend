const CURRENT_VERSION = 1;
// @ts-ignore
const localStorageVersion: number = parseInt(localStorage.getItem('version') || 0);

if (localStorageVersion == 0) {
    localStorage.clear();
    localStorage.setItem('version', CURRENT_VERSION.toString());
}


interface CacheItem {
    ttl: number,
    value: any,
}

interface CacheItems {
    [key: string]: CacheItem
}

const cacheItems: CacheItems = {};

const create = (key: string, ttl: number = 0, defaultValue: any = null) => {
    cacheItems[key] = {
        ttl,
        value: defaultValue,
    };
}

const get = (key: string) => {
    const cached = localStorage.getItem(key);
    if (!cached) {
        return cacheItems[key]?.value || null;
    }
    const parsed: CacheItem = JSON.parse(cached);
    if (parsed.ttl === 0 || parsed.ttl > Date.now()) {
        return parsed.value;
    }
    return cacheItems[key]?.value || null;
}

const set = (key: string, value: any) => {
    if (!cacheItems[key]) {
        cacheItems[key] = {
            ttl: 0,
            value,
        }
    }
    const cacheItem: CacheItem = {
        ttl: cacheItems[key].ttl === 0 ? 0 : Date.now() + cacheItems[key].ttl,
        value,
    }
    localStorage.setItem(key, JSON.stringify(cacheItem));
}

const remove = (key: string) => {
    localStorage.removeItem(key);
    delete cacheItems[key];
}

export const LocalCache = {
    create,
    get,
    set,
    remove
}
