/**
 * amountValidator
 * 
 * @export
 * @param {string} amount
 * @returns
 */
export function amountValidator(amount: string) {
    amount = amount;
    let amountFormat = /(^\d{1,9})*(\.\d{0,2})?$/;
    return amountFormat.test(amount);
}

/**
 * percentageValidator
 * 
 * @export
 * @param {string} amount
 * @returns
 */
export function percentageValidator(percentage: string) {
    percentage = percentage;
    let amountFormat = /^[1-9]\d*(\.\d{0,2})?$/;
    if (Number(percentage) < 100) {
        return amountFormat.test(percentage);
    }
}

