import { ERROR_MESSAGES } from '../utils/constants.js';

class Checkout {
  #shelves;

  constructor(shelves) {
    this.#shelves = shelves;
  }

  createPaymentPlan(shoppingCart) {
    return shoppingCart.goods.map(({ name, quantity }) => {
      return this.createPaymentSummary(name, quantity);
    });
  }

  createPaymentSummary(name, quantity) {
    const targetGoods = this.#shelves.goods.find(
      (goods) => goods.name === name
    );

    if (!targetGoods) {
      throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    return targetGoods.getPaymentSummary(quantity);
  }
}

export default Checkout;
