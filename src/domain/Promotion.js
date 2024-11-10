import { DateTimes } from '@woowacourse/mission-utils';
import { PromotionType } from '../utils/constants';
import PromotionStrategy from './strategy/index.js';

class Promotion {
  #name;
  #quantity;
  #valid;
  #strategy;

  constructor({ name = '', type = null, quantity = 0, start_date, end_date }) {
    this.#name = name;
    this.#quantity = quantity;
    this.#valid = this.#refineDateRange(start_date, end_date);
    this.#strategy = PromotionStrategy.from(type || PromotionType.NONE);
  }

  #refineDateRange(start_date, end_date) {
    if (!start_date && !end_date) {
      return null;
    }

    const date = new Date(end_date);
    date.setHours(date.getHours() + 23);
    date.setMinutes(date.getMinutes() + 59);
    date.setSeconds(date.getSeconds() + 59);
    date.setMilliseconds(date.getMilliseconds() + 999);

    return { from: new Date(start_date), to: date };
  }

  getAvailableQuantity(requestedQuantity) {
    if (typeof requestedQuantity !== 'number' || requestedQuantity <= 0) {
      throw new Error('[ERROR] 잘못된 입력입니다. 다시 입력해 주세요.');
    }

    if (this.#isExpired) {
      return { quantity: 0, violation: null };
    }

    return this.#strategy.execute(this.#quantity, requestedQuantity);
  }

  get #isExpired() {
    if (!this.#valid) {
      return false;
    }

    const now = DateTimes.now();

    return now < this.#valid.from || now > this.#valid.to;
  }

  decrease(quantity) {
    if (quantity > this.#quantity) {
      throw new Error(
        '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.'
      );
    }

    this.#quantity -= quantity;
  }

  get summary() {
    return {
      name: this.#name,
      quantity: this.#quantity,
    };
  }
}

export default Promotion;
