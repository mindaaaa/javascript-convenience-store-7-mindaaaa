import { DateTimes } from '@woowacourse/mission-utils';

class Promotion {
  #date;

  constructor(date) {
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

// 유효한 객체배열만 뽑는다.
// 사용자가 입력한 값이 그 객체 배열에 있는지 확인한다 // 재고관리
// 없으면 재고를 차감하고, 할인한다. // 재고관리
// 있으면 그에 맞는 조건값을 뽑고 그것부터 우선차감한다.
