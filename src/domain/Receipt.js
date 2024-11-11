import { RECEIPT, NEW_LINE, TAB } from '../utils/constants.js';

class Receipt {
  #priceSum;
  #countSum;
  #data;
  #discountByMembership;

  constructor(price, count, data, discountByMembership) {
    this.#priceSum = price;
    this.#countSum = count;
    this.#data = data;
    this.#discountByMembership = discountByMembership;
  }

  toString() {
    return [
      this.#formatHeader(),
      this.#formatItem(),
      this.#formatPromotion(),
      this.#formatFooter(),
    ].join(NEW_LINE);
  }

  #formatHeader() {
    return [RECEIPT.HEADER, RECEIPT.ITEM_HEADER].join(NEW_LINE);
  }

  #formatItem() {
    return this.#data
      .map(
        (item) =>
          `${item.name}${TAB}${TAB}${
            item.count
          }${TAB}${item.price.toLocaleString()}`
      )
      .join(NEW_LINE);
  }

  #formatPromotion() {
    const promotionalItems = this.#data
      .filter((item) => item.freebie)
      .map((item) => `${item.name}${TAB}${TAB}${item.freebie.count}`)
      .join(NEW_LINE);
    return [RECEIPT.PROMOTION_HEADER, promotionalItems].join(NEW_LINE);
  }

  #formatFooter() {
    const discountByPromotion = this.#calculatePromotionDiscount();
    const finalAmount = this.#calculateFinalAmount(discountByPromotion);

    return [
      RECEIPT.FOOTER_DIVIDER,
      `${RECEIPT.TOTAL_PURCHASE_AMOUNT}${
        this.#countSum
      }${TAB}${this.#priceSum.toLocaleString()}`,
      `${RECEIPT.PROMOTION_DISCOUNT}${discountByPromotion.toLocaleString()}`,
      `${
        RECEIPT.MEMBERSHIP_DISCOUNT
      }${this.#discountByMembership.toLocaleString()}`,
      `${RECEIPT.FINAL_AMOUNT}${finalAmount.toLocaleString()}`,
    ].join(NEW_LINE);
  }

  #calculatePromotionDiscount() {
    return this.#data
      .filter((item) => item.freebie)
      .reduce((total, item) => total + item.freebie.price, 0);
  }

  #calculateFinalAmount(discountByPromotion) {
    return this.#priceSum - discountByPromotion - this.#discountByMembership;
  }
}

export default Receipt;
