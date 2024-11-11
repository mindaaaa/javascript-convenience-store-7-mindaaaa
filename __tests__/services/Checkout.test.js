import Checkout from '../../src/services/Checkout.js';
import Shelves from '../../src/domain/Shelves.js';
import Cart from '../../src/domain/Cart.js';

describe.skip('Checkout 클래스에 대해', () => {
  let checkout;
  let shelves;

  beforeEach(() => {
    const products = [
      { name: '콜라', price: 1000, quantity: 10, promotion: '탄산2+1' },
      { name: '사이다', price: 1000, quantity: 8, promotion: null },
    ];
    const promotions = [
      {
        name: '탄산2+1',
        buy: 2,
        get: 1,
        start_date: '2024-01-01',
        end_date: '2024-12-31',
      },
    ];
    shelves = new Shelves(products, promotions);
    checkout = new Checkout(shelves);
  });

  describe('createPaymentSummary 메서드에 대해', () => {
    test('유효한 상품명과 수량이 주어졌을 때 결제 요약 정보를 반환한다.', () => {
      // given
      const productName = '콜라';
      const quantity = 5;

      // when
      const result = checkout.createPaymentSummary(productName, quantity);

      // then
      expect(result).toEqual({
        requestedQuantity: 5,
        freebieCount: expect.any(Number),
        name: '콜라',
        price: 1000,
        quantity: {
          regular: expect.any(Number),
          promotional: expect.any(Number),
        },
        violation: { type: expect.any(String), quantity: expect.any(Number) },
      });
    });

    test('존재하지 않는 상품명이 주어졌을 때 오류를 던진다.', () => {
      // given
      const productName = '없는상품';
      const quantity = 1;

      // when...then
      expect(() =>
        checkout.createPaymentSummary(productName, quantity)
      ).toThrow('[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.');
    });
  });

  describe('createPaymentPlan 메서드에 대해', () => {
    test('장바구니에 담긴 상품들에 대한 결제 계획을 반환한다.', () => {
      // given
      const shoppingCart = {
        goods: [
          { name: '콜라', quantity: 3 },
          { name: '사이다', quantity: 2 },
        ],
      };

      // when
      const result = checkout.createPaymentPlan(shoppingCart);

      // then
      expect(result).toEqual([
        {
          requestedQuantity: 3,
          freebieCount: expect.any(Number),
          name: '콜라',
          price: 1000,
          quantity: {
            regular: expect.any(Number),
            promotional: expect.any(Number),
          },
          violation: { type: null, quantity: expect.any(Number) },
        },
        {
          requestedQuantity: 2,
          freebieCount: expect.any(Number),
          name: '사이다',
          price: 1000,
          quantity: {
            regular: expect.any(Number),
            promotional: expect.any(Number),
          },
          violation: { type: null, quantity: expect.any(Number) },
        },
      ]);
    });

    test('장바구니에 존재하지 않는 상품이 있을 때 오류를 던진다.', () => {
      // given
      const shoppingCart = {
        goods: [
          { name: '콜라', quantity: 3 },
          { name: '없는상품', quantity: 1 },
        ],
      };

      // when...then
      expect(() => checkout.createPaymentPlan(shoppingCart)).toThrow(
        '[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.'
      );
    });
  });
});
