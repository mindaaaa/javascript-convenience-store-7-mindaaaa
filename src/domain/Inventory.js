import Promotion from './Promotion.js';
import { ERROR_MESSAGES, PromotionViolation } from '../utils/constants.js';

class Inventory {
  #name;
  #price;
  #quantity;
  #promotion;

  constructor(data, promotion) {
    this.#initializeData(data);
    this.#promotion = new Promotion(promotion);
  }

  #initializeData(data) {
    const { name = '', price = 0, quantity = 0 } = data;
    this.#name = name;
    this.#price = price;
    this.#quantity = quantity;
  }

  getPaymentSummary(requestedQuantity) {
    this.#validateStock(requestedQuantity);
    const { promotionalQuantity, freebieCount, violation } =
      this.#calculatePromotions(requestedQuantity);
    const regularQuantity = requestedQuantity - promotionalQuantity;
    return this.#createPaymentSummary(
      requestedQuantity,
      regularQuantity,
      promotionalQuantity,
      freebieCount,
      violation
    );
  }

  #validateStock(requestedQuantity) {
    const currentStockQuantity =
      this.#quantity + this.#promotion.summary.quantity;
    if (requestedQuantity > currentStockQuantity) {
      throw new Error(ERROR_MESSAGES.EXCEEDS_STOCK);
    }
  }

  #calculatePromotions(requestedQuantity) {
    const {
      quantity: promotionalQuantity,
      violation,
      freebieCount,
    } = this.#promotion.getAvailableQuantity(requestedQuantity);
    return { promotionalQuantity, violation, freebieCount };
  }

  #createPaymentSummary(
    requestedQuantity,
    regular,
    promotional,
    freebieCount,
    violation
  ) {
    const violatedQuantity = this.#calculateViolationQuantity(
      violation,
      regular
    );
    return {
      requestedQuantity,
      freebieCount,
      name: this.#name,
      price: this.#price,
      quantity: { regular, promotional },
      violation: { type: violation, quantity: violatedQuantity },
    };
  }

  #calculateViolationQuantity(violation, nonPromoQuantity) {
    if (violation === PromotionViolation.ONE_MORE) return 1;
    if (violation === PromotionViolation.OUT_OF_STOCK) return nonPromoQuantity;
    return 0;
  }

  decrease(regularQuantity, promotionalQuantity) {
    this.#validateStock(regularQuantity + promotionalQuantity);
    this.#updateQuantities(regularQuantity, promotionalQuantity);
  }

  #updateQuantities(regularQuantity, promotionalQuantity) {
    const promoStock = this.#promotion.summary.quantity;
    if (promotionalQuantity > promoStock) {
      this.#promotion.decrease(promoStock);
      this.#quantity -= promotionalQuantity - promoStock + regularQuantity;
    } else {
      this.#promotion.decrease(promotionalQuantity);
      this.#quantity -= regularQuantity;
    }
  }

  get name() {
    return this.#name;
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
