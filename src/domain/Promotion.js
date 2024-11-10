import { DateTimes } from '@woowacourse/mission-utils';

class Promotion {
  #name;
  #quantity;
  #valid;

  constructor({ name = '', type = null, quantity = 0, start_date, end_date }) {
    this.#name = name;
    this.#quantity = quantity;
    this.#valid = this.#refineDateRange(start_date, end_date);
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
}

export default Promotion;
