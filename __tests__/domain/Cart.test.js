import Cart from '../../src/domain/Cart.js';

describe.skip('Cart 클래스에 대해', () => {
  test('생성자에 전달된 인자가 문자열이 아닌 경우 예외가 발생한다.', () => {
    // given
    const invalidInput = 1;

    // when...then
    expect(() => {
      new Cart(invalidInput);
    }).toThrow(
      '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.'
    );
  });

  describe('생성자에 문자열이 전달된 경우,', () => {
    test('장바구니에 담길 상품 정보가 잘못된 형태로 작성된 경우 예외가 발생한다.', () => {
      // given
      const invalidInputs = [
        ' ',
        '[콜라-10],{사이다-3]',
        '[콜라-10],{사이다-3]',
        '[콜라-10],[사이다--3]',
        '[-3]',
        '[--2]',
        '[콜라-1.2]',
      ];

      // when...then
      for (const invalidInput of invalidInputs) {
        expect(() => {
          new Cart(invalidInput);
        }).toThrow(
          '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.'
        );
      }
    });

    test('올바른 상품 정보가 입력된 경우 이를 파싱한 장바구니 목록을 확인할 수 있다.', () => {
      // given
      const input = '[콜라-10]';

      // when
      const result = new Cart(input).goods;

      // then
      expect(result).toEqual([{ name: '콜라', quantity: 10 }]);
    });

    test('하나 이상의 상품 정보가 입력된 경우에도 이를 파싱한 장바구니 목록을 확인할 수 있다.', () => {
      // given
      const input = '[콜라-10],[사이다-3],[오렌지주스-2],[탄산수-8],[컵라면-1]';

      // when
      const result = new Cart(input).goods;

      // then
      expect(result).toEqual([
        { name: '콜라', quantity: 10 },
        { name: '사이다', quantity: 3 },
        { name: '오렌지주스', quantity: 2 },
        { name: '탄산수', quantity: 8 },
        { name: '컵라면', quantity: 1 },
      ]);
    });

    test('중복된 상품 정보가 입력된 경우에는 예외가 발생한다.', () => {
      // given
      const duplicatedInput = '[콜라-10],[콜라-10]';

      // when...then
      expect(() => {
        new Cart(duplicatedInput);
      }).toThrow(
        '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.'
      );
    });
  });
});
