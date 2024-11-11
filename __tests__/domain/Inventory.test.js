import Inventory from '../../src/domain/Inventory';
import { PromotionViolation } from '../../src/utils/constants.js';

describe.skip('Inventory 클래스는', () => {
  const createGoods = (quantity = 999, promotionalQuantity = 10) =>
    new Inventory(
      {
        name: '콜라',
        price: 1000,
        quantity: quantity,
      },
      {
        name: '탄산2+1',
        type: 'TWO_PLUS_ONE',
        quantity: promotionalQuantity,
        startFrom: '1989-01-01',
        endTo: '2222-02-22',
      }
    );

  test('decrease() 메소드를 호출하여 일반 재고와 프로모션 재고를 감소시킬 수 있다.', () => {
    // given
    const before = {
      regular: 999,
      promotional: 999,
    };
    const decrease = {
      regular: 42,
      promotional: 3,
    };
    const goods = createGoods(before.regular, before.promotional);

    // when
    goods.decrease(decrease.regular, decrease.promotional);

    // then
    expect(goods.summary).toEqual({
      name: '콜라',
      price: 1000,
      quantity: before.regular - decrease.regular,
      promotion: {
        name: '탄산2+1',
        quantity: before.promotional - decrease.promotional,
      },
    });
  });

  test('현재 재고보다 더 많은 수를 감소하고자 시도하는 경우 예외가 발생한다.', () => {
    // given
    const regularQuantity = 10;
    const promotionalQuantity = 42;
    const goods = createGoods(regularQuantity, promotionalQuantity);

    // when
    // then
    expect(() => {
      goods.decrease(regularQuantity + promotionalQuantity + 1, 0);
    }).toThrow(
      '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.'
    );
  });

  test('summary 프로퍼티를 활용하여 현재 재고 정보를 확인할 수 있다.', () => {
    // given
    const regularQuantity = 999;
    const promotionalQuantity = 42;
    const goods = createGoods(regularQuantity, promotionalQuantity);

    // when
    const result = goods.summary;

    // then
    expect(result).toEqual({
      name: '콜라',
      price: 1000,
      quantity: regularQuantity,
      promotion: {
        name: '탄산2+1',
        quantity: promotionalQuantity,
      },
    });
  });

  describe('2+1 프로모션이 적용된 제품에 대해', () => {
    test('모든 구매 요청에 대해 프로모션 혜택을 적용할 수 있다면 일반 재고를 반환하지 않는다.', () => {
      // given
      const requestedQuantity = 6;

      const goods = createGoods();

      // when
      const paymentSummary = goods.getPaymentSummary(requestedQuantity);

      // then
      expect(paymentSummary.name).toBe('콜라');
      expect(paymentSummary.quantity.regular).toBe(0);
      expect(paymentSummary.quantity.promotional).toBe(requestedQuantity);
      expect(paymentSummary.violation.type).toBe(null);
      expect(paymentSummary.violation.quantity).toBe(0);
    });

    test('프로모션 혜택을 일부만 적용받을 수 있는 구매의 경우, 일반 재고와 프로모션 재고를 혼합해 반환한다.', () => {
      // given
      const requestedQuantity = 4;
      const expectedQuantities = {
        regular: 1,
        promotional: 3,
      };

      const goods = createGoods();

      // when
      const paymentSummary = goods.getPaymentSummary(requestedQuantity);

      // then
      expect(paymentSummary.name).toBe('콜라');
      expect(paymentSummary.quantity.regular).toBe(expectedQuantities.regular);
      expect(paymentSummary.quantity.promotional).toBe(
        expectedQuantities.promotional
      );
      expect(paymentSummary.violation.type).toBe(null);
      expect(paymentSummary.violation.quantity).toBe(0);
    });

    test('프로모션 혜택을 일부만 적용받을 수 있는 구매의 경우, 일반 재고와 프로모션 재고를 혼합하여 반환하되 적절한 violation을 함께 반환한다.', () => {
      // given
      const requestedQuantity = 5;
      const expectedQuantities = {
        regular: 2,
        promotional: 3,
      };

      const goods = createGoods();

      // when
      const paymentSummary = goods.getPaymentSummary(requestedQuantity);

      // then
      expect(paymentSummary.name).toBe('콜라');
      expect(paymentSummary.quantity.regular).toBe(expectedQuantities.regular);
      expect(paymentSummary.quantity.promotional).toBe(
        expectedQuantities.promotional
      );
      expect(paymentSummary.violation.type).toBe(PromotionViolation.ONE_MORE);
      expect(paymentSummary.violation.quantity).toBe(1);
    });

    test('프로모션 혜택을 일부만 적용받을 수 있는 구매의 경우, 추가 혜택을 받을 수 있지만 프로모션 재고가 부족하다면 일반 재고와 프로모션 재고를 혼합하여 반환하되 적절한 violation을 함께 반환한다.', () => {
      // given
      const requestedQuantity = 5;
      const expectedQuantities = {
        regular: 2,
        promotional: 3,
      };

      const goods = createGoods(999, 3);

      // when
      const paymentSummary = goods.getPaymentSummary(requestedQuantity);

      // then
      expect(paymentSummary.name).toBe('콜라');
      expect(paymentSummary.quantity.regular).toBe(expectedQuantities.regular);
      expect(paymentSummary.quantity.promotional).toBe(
        expectedQuantities.promotional
      );
      expect(paymentSummary.violation.type).toBe(
        PromotionViolation.OUT_OF_STOCK
      );
      expect(paymentSummary.violation.quantity).toBe(2);
    });

    test('프로모션 혜택을 적용받을 수 있는 구매이나, 프로모션 재고가 전혀 없는 경우 일반 재고만을 반환하며 적절한 violation을 함께 반환한다.', () => {
      // given
      const requestedQuantity = 6;
      const expectedQuantities = {
        regular: 6,
        promotional: 0,
      };

      const goods = createGoods(999, 0);

      // when
      const paymentSummary = goods.getPaymentSummary(requestedQuantity);

      // then
      expect(paymentSummary.name).toBe('콜라');
      expect(paymentSummary.quantity.regular).toBe(expectedQuantities.regular);
      expect(paymentSummary.quantity.promotional).toBe(
        expectedQuantities.promotional
      );
      expect(paymentSummary.violation.type).toBe(
        PromotionViolation.OUT_OF_STOCK
      );
      expect(paymentSummary.violation.quantity).toBe(requestedQuantity);
    });

    test('프로모션 혜택을 적용받을 수 있는 구매며, 일반 재고가 전혀 없는 경우 프로모션 재고만을 반환한다.', () => {
      // given
      const requestedQuantity = 6;
      const expectedQuantities = {
        regular: 0,
        promotional: 6,
      };

      const goods = createGoods(0);

      // when
      const paymentSummary = goods.getPaymentSummary(requestedQuantity);

      // then
      expect(paymentSummary.name).toBe('콜라');
      expect(paymentSummary.quantity.regular).toBe(expectedQuantities.regular);
      expect(paymentSummary.quantity.promotional).toBe(
        expectedQuantities.promotional
      );
      expect(paymentSummary.violation.type).toBe(null);
      expect(paymentSummary.violation.quantity).toBe(0);
    });

    test('프로모션 혜택을 적용받을 수 있는 구매이나, 프로모션 재고가 충분하지 않고 일반 재고가 부족한 경우 예외가 발생한다.', () => {
      // given
      const requestedQuantity = 6;

      const goods = createGoods(1, 3);

      // when...then
      expect(() => {
        goods.getPaymentSummary(requestedQuantity);
      }).toThrow(
        '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.'
      );
    });

    test('프로모션 혜택을 적용받을 수 없는 구매며, 재고가 부족한 경우 예외가 발생한다.', () => {
      // given
      const before = {
        regular: 999,
        promotional: 999,
      };
      const requestedQuantity = before.regular + before.promotional + 1;

      const goods = createGoods(before.regular, before.promotional);

      // when...then
      expect(() => {
        goods.getPaymentSummary(requestedQuantity);
      }).toThrow(
        '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.'
      );
    });
  });

  describe('1+1 프로모션이 적용된 제품에 대해', () => {
    const createGoods = (quantity = 999, promotionalQuantity = 10) =>
      new Inventory(
        {
          name: '콜라',
          price: 1000,
          quantity: quantity,
        },
        {
          name: 'MD추천상품',
          type: 'MD_RECOMMEND',
          quantity: promotionalQuantity,
          startFrom: '1989-01-01',
          endTo: '2222-02-22',
        }
      );

    test('모든 구매 요청에 대해 프로모션 혜택을 적용할 수 있다면 일반 재고를 반환하지 않는다.', () => {
      // given
      const requestedQuantity = 6;

      const goods = createGoods();

      // when
      const paymentSummary = goods.getPaymentSummary(requestedQuantity);

      // then
      expect(paymentSummary.name).toBe('콜라');
      expect(paymentSummary.quantity.regular).toBe(0);
      expect(paymentSummary.quantity.promotional).toBe(requestedQuantity);
      expect(paymentSummary.violation.type).toBe(null);
      expect(paymentSummary.violation.quantity).toBe(0);
    });

    test('프로모션 혜택을 일부만 적용받을 수 있는 구매의 경우, 추가 혜택을 받을 수 있다면 일반 재고와 프로모션 재고를 혼합해 반환하고 적절한 violation을 함께 반환한다.', () => {
      // given
      const requestedQuantity = 5;
      const expectedQuantities = {
        regular: 1,
        promotional: 4,
      };

      const goods = createGoods();

      // when
      const paymentSummary = goods.getPaymentSummary(requestedQuantity);

      // then
      expect(paymentSummary.name).toBe('콜라');
      expect(paymentSummary.quantity.regular).toBe(expectedQuantities.regular);
      expect(paymentSummary.quantity.promotional).toBe(
        expectedQuantities.promotional
      );
      expect(paymentSummary.violation.type).toBe(PromotionViolation.ONE_MORE);
      expect(paymentSummary.violation.quantity).toBe(1);
    });

    test('프로모션 혜택을 일부만 적용받을 수 있는 구매의 경우, 프로모션 재고가 부족하면 일반 재고와 프로모션 재고를 혼합하여 반환하되 적절한 violation을 함께 반환한다.', () => {
      // given
      const requestedQuantity = 5;
      const expectedQuantities = {
        regular: 1,
        promotional: 4,
      };

      const goods = createGoods(999, 4);

      // when
      const paymentSummary = goods.getPaymentSummary(requestedQuantity);

      // then
      expect(paymentSummary.name).toBe('콜라');
      expect(paymentSummary.quantity.regular).toBe(expectedQuantities.regular);
      expect(paymentSummary.quantity.promotional).toBe(
        expectedQuantities.promotional
      );
      expect(paymentSummary.violation.type).toBe(
        PromotionViolation.OUT_OF_STOCK
      );
      expect(paymentSummary.violation.quantity).toBe(1);
    });

    test('프로모션 혜택을 적용받을 수 있는 구매이나, 프로모션 재고가 없는 경우 일반 재고만을 반환하며 적절한 violation을 함께 반환한다.', () => {
      // given
      const requestedQuantity = 6;
      const expectedQuantities = {
        regular: 6,
        promotional: 0,
      };

      const goods = createGoods(999, 0);

      // when
      const paymentSummary = goods.getPaymentSummary(requestedQuantity);

      // then
      expect(paymentSummary.name).toBe('콜라');
      expect(paymentSummary.quantity.regular).toBe(expectedQuantities.regular);
      expect(paymentSummary.quantity.promotional).toBe(
        expectedQuantities.promotional
      );
      expect(paymentSummary.violation.type).toBe(
        PromotionViolation.OUT_OF_STOCK
      );
      expect(paymentSummary.violation.quantity).toBe(requestedQuantity);
    });

    test('프로모션 혜택을 적용받을 수 있는 구매이나, 프로모션 재고가 충분하지 않고 일반 재고가 부족한 경우 예외가 발생한다.', () => {
      // given
      const requestedQuantity = 6;

      const goods = createGoods(1, 3);

      // when...then
      expect(() => {
        goods.getPaymentSummary(requestedQuantity);
      }).toThrow(
        '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.'
      );
    });

    test('프로모션 혜택을 적용받을 수 없는 구매이며, 재고가 부족한 경우 예외가 발생한다.', () => {
      // given
      const before = {
        regular: 999,
        promotional: 999,
      };
      const requestedQuantity = before.regular + before.promotional + 1;

      const goods = createGoods(before.regular, before.promotional);

      // when...then
      expect(() => {
        goods.getPaymentSummary(requestedQuantity);
      }).toThrow(
        '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.'
      );
    });
  });
});
