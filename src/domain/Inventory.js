import Promotion from './Promotion.js';
import { ERROR_MESSAGES, PromotionViolation } from '../utils/constants.js';

class Inventory {
  #name;
  #price;
  #quantity;
  #promotion;

  constructor(data, promotion) {
    const { name = '', price = 0, quantity = 0 } = data;
    this.#name = name;
    this.#price = price;
    this.#quantity = quantity;

    this.#promotion = new Promotion(promotion);
  }

  getPaymentSummary(requestedQuantity) {
    const currentStockQuantity =
      this.#quantity + this.#promotion.summary.quantity;
    if (requestedQuantity > currentStockQuantity) {
      throw new Error(ERROR_MESSAGES.EXCEEDS_STOCK);
    }

    const {
      quantity: promotionalQuantity,
      violation,
      freebieCount,
    } = this.#promotion.getAvailableQuantity(requestedQuantity);

    const nonPromoQuantity = requestedQuantity - promotionalQuantity;

    if (violation === PromotionViolation.ONE_MORE) {
      return this.#createPaymentSummary(
        requestedQuantity,
        nonPromoQuantity,
        promotionalQuantity,
        freebieCount,
        violation,
        1
      );
    }
    if (violation === PromotionViolation.OUT_OF_STOCK) {
      return this.#createPaymentSummary(
        requestedQuantity,
        nonPromoQuantity,
        promotionalQuantity,
        freebieCount,
        violation,
        nonPromoQuantity
      );
    }

    return this.#createPaymentSummary(
      requestedQuantity,
      nonPromoQuantity,
      promotionalQuantity,
      freebieCount,
      violation,
      0
    );
  }

  #createPaymentSummary(
    requestedQuantity,
    regular,
    promotional,
    freebieCount,
    violation,
    violatedQuantity
  ) {
    return {
      requestedQuantity,
      freebieCount,
      name: this.#name,
      price: this.#price,
      quantity: { regular, promotional },
      violation: {
        type: violation,
        quantity: violatedQuantity,
      },
    };
  }

  get name() {
    return this.#name;
  }

  decrease(regularQuantity, promotionalQuantity) {
    const requestedQuantity = regularQuantity + promotionalQuantity;

    const promotionStock = this.#promotion.summary.quantity;
    const stockAmount = this.#quantity + promotionStock;

    if (requestedQuantity > stockAmount) {
      throw new Error(ERROR_MESSAGES.EXCEEDS_STOCK);
    }

    if (requestedQuantity > promotionStock) {
      this.#promotion.decrease(promotionStock);
      this.#quantity -= requestedQuantity - promotionStock;
    } else {
      this.#promotion.decrease(promotionalQuantity);
      this.#quantity -= regularQuantity;
    }
  }

  get summary() {
    return {
      name: this.#name,
      price: this.#price,
      quantity: this.#quantity,
      promotion: this.#promotion.summary,
    };
  }
}
export default Inventory;
