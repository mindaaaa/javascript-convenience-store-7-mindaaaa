import { DateTimes } from '@woowacourse/mission-utils';

class Promotion {
  #date;

  constructor() {
    this.#date = DateTimes.now();
  }

  #getToday() {
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    return this.#date.match(regex)[0];
  }

  gatValidPromotions(promotions) {
    const today = new Date(this.#getToday());
    return promotions.filter((promotion) => {
      const startDate = new Date(promotion.start_date);
      const endDate = new Date(promotion.end_date);

      return today >= startDate && today <= endDate;
    });
  }

  // 탄산2+1
  #applyTwoPlusOnePromo(quantity) {
    const sets = Math.floor(quantity / 2);
    return sets * 3 + (quantity % 2);
  }

  // 반짝할인/MD추천상품
  #applyOnePlusOnePromo(quantity) {
    return quantity * 2;
  }
}

export default Promotion();
