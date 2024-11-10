import { PromotionViolation } from '../../utils/constants';

class NBuyGetOnePromotion {
  #Unit;

  constructor(x) {
    if (typeof x !== 'number' || x <= 0) {
      throw new Error(
        '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.'
      );
    }
    this.#Unit = x + 1;
  }

  get name() {
    return 'NBuyGetOne';
  }

  execute(promotionStock, requestedQuantity) {
    const expectedQuantity =
      Math.floor(requestedQuantity / this.#Unit) * this.#Unit;

    if (expectedQuantity > promotionStock) {
      const availableQuantity =
        Math.floor(promotionStock / this.#Unit) * this.#Unit;
      return {
        quantity: availableQuantity,
        violation: PromotionViolation.OUT_OF_STOCK,
        freebieCount: this.#getFreebieCount(availableQuantity),
      };
    }

    if (this.#shouldNotGetOneMore(requestedQuantity)) {
      return {
        quantity: expectedQuantity,
        violation: null,
        freebieCount: this.#getFreebieCount(expectedQuantity),
      };
    }

    if (promotionStock >= requestedQuantity + 1) {
      return {
        quantity: expectedQuantity,
        violation: PromotionViolation.ONE_MORE,
        freebieCount: this.#getFreebieCount(expectedQuantity),
      };
    }

    return {
      quantity: expectedQuantity,
      violation: PromotionViolation.OUT_OF_STOCK,
      freebieCount: this.#getFreebieCount(expectedQuantity),
    };
  }

  #getFreebieCount(availableQuantity) {
    if (availableQuantity === 0) {
      return 0;
    }
    return availableQuantity / this.#Unit;
  }
  #shouldNotGetOneMore(requestedQuantity) {
    return requestedQuantity % this.#Unit !== this.#Unit - 1;
  }
}

export default NBuyGetOnePromotion;
