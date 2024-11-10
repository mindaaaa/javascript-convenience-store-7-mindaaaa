import Promotion from './Promotion.js';
import { PromotionViolation } from '../utils/constants';

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
      throw new Error(
        '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.'
      );
    }

    const {
      quantity: promotionalQuantity,
      violation,
      freebieCount,
    } = this.#promotion.getAvailableQuantity(requestedQuantity);

    const regularQuantity = requestedQuantity - promotionalQuantity;

    if (violation === PromotionViolation.ONE_MORE) {
      return this.#createPaymentSummary(
        requestedQuantity,
        regularQuantity,
        promotionalQuantity,
        freebieCount,
        violation,
        1
      );
    }
    if (violation === PromotionViolation.OUT_OF_STOCK) {
      return this.#createPaymentSummary(
        requestedQuantity,
        regularQuantity,
        promotionalQuantity,
        freebieCount,
        violation,
        diff
      );
    }

    return this.#createPaymentSummary(
      requestedQuantity,
      regularQuantity,
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
      throw new Error(
        '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.'
      );
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
