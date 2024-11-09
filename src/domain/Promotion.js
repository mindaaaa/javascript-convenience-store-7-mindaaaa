import { DateTimes } from '@woowacourse/mission-utils';

class Promotion {
  gatValidPromotions(promotions) {
    const today = DateTimes.now();

    return promotions.filter((promotion) => {
      const startDate = new Date(promotion.start_date);
      const endDate = this.#convertEndDate(promotion.end_date);

      return today >= startDate && today <= endDate;
    });
  }

  #convertEndDate(endDate) {
    const date = new Date(endDate);
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59
    );
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
