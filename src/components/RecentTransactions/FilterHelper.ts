import {NumericFilter} from "./FilterModel";

const isAllowedNumeric = (value: number, filter?: NumericFilter): boolean => {

    // console.warn(1, value, filter?.condition, filter?.value);

    if (filter === null ||
        filter?.value === null ||
        filter?.value === undefined ||
        filter?.condition === null) {
        return true;
    }

    // console.warn(2, value, filter.condition, filter.value, value <= filter.value);

    if (filter.condition === 'gte') {
        return value >= filter.value;
    }
    if (filter.condition === 'lte') {
        return value <= filter.value;
    }
    return true;
}

const yearsSince = (dateString: number): number => {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
    let yearsPassed = currentDate.getFullYear() - givenDate.getFullYear();
    console.warn(dateString, givenDate, currentDate, yearsPassed)

    if (currentDate.getMonth() < givenDate.getMonth() ||
        (currentDate.getMonth() === givenDate.getMonth() && currentDate.getDate() < givenDate.getDate())) {
        yearsPassed--;
    }

    console.warn(yearsPassed);

    return yearsPassed;
}

export {isAllowedNumeric, yearsSince}
