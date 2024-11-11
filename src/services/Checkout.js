import { ERROR_MESSAGES } from '../utils/constants.js';

class Checkout {
  #shelves;

  constructor(shelves) {
    this.#shelves = shelves;
  }

  createPaymentPlan(shoppingCart) {
    return this.#generatePaymentSummaries(shoppingCart.goods);
  }

  #generatePaymentSummaries(goodsList) {
    return goodsList.map(({ name, quantity }) =>
      this.createPaymentSummary(name, quantity)
    );
  }

  createPaymentSummary(name, quantity) {
    const targetGoods = this.#findTargetGoods(name);
    return this.#generateSummary(targetGoods, quantity);
  }

  #findTargetGoods(name) {
    const targetGoods = this.#shelves.goods.find(
      (goods) => goods.name === name
    );
    if (!targetGoods) {
      throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }
    return targetGoods;
  }

  #generateSummary(targetGoods, quantity) {
    return targetGoods.getPaymentSummary(quantity);
  }
}

export default Checkout;
