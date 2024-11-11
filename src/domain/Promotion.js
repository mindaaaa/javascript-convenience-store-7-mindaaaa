import { ERROR_MESSAGES, PromotionType } from '../utils/constants.js';
import PromotionStrategy from './strategy/index.js';
import DateRange from '../services/DateRange.js';

class Promotion {
  #name;
  #quantity;
  #dateRange;
  #strategy;

  constructor({ name = '', type = null, quantity = 0, start_date, end_date }) {
    this.#name = name;
    this.#quantity = quantity;
    this.#dateRange = new DateRange(start_date, end_date);
    this.#strategy = PromotionStrategy.from(type || PromotionType.NONE);
  }

  getAvailableQuantity(requestedQuantity) {
    this.#validateRequestedQuantity(requestedQuantity);

    if (this.#dateRange.isExpired()) {
      return { quantity: 0, violation: null };
    }

    return this.#strategy.execute(this.#quantity, requestedQuantity);
  }

  #validateRequestedQuantity(quantity) {
    if (typeof quantity !== 'number' || quantity <= 0) {
      throw new Error(ERROR_MESSAGES.INVALID_INPUT);
    }
  }

  decrease(quantity) {
    this.#validateStockQuantity(quantity);
    this.#quantity -= quantity;
  }

  #validateStockQuantity(quantity) {
    if (quantity > this.#quantity) {
      throw new Error(ERROR_MESSAGES.EXCEEDS_STOCK);
    }
  }

  get summary() {
    return {
      name: this.#name,
      quantity: this.#quantity,
    };
  }
}

export default Promotion;
