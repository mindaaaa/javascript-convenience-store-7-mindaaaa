import Promotion from '../../src/domain/Promotion.js';

describe.skip('Promotion 클래스는', () => {
  test('프로모션 객체 생성 시 유효하지 않은 프로모션 타입일 경우 예외가 발생한다.', () => {
    // given
    const name = '탄산2+1';
    const invalidType = 'INVALID_TYPE';
    const quantity = 1;
    const start_date = '2024-01-10';
    const end_date = '2024-01-17';

    // when
    const actual = () =>
      new Promotion({
        name,
        type: invalidType,
        quantity,
        start_date,
        end_date,
      });

    // then
    expect(actual).toThrowError(
      '[ERROR] 잘못된 입력입니다. 다시 입력해 주세요.'
    );
  });

  describe('정상적으로 인스턴스화된 Promotion 인스턴스에 대해', () => {
    test('구매 수량을 0으로 요청한 경우 예외가 발생한다.', () => {
      // given
      const promotion = new Promotion({
        name: '탄산2+1',
        type: 'TWO_PLUS_ONE',
        quantity: 10,
        start_date: '1989-01-01',
        end_date: '2222-02-22',
      });

      // when...then
      expect(() => {
        promotion.getAvailableQuantity(0);
      }).toThrow('[ERROR] 잘못된 입력입니다. 다시 입력해 주세요.');
    });

    test('현재 일자가 프로모션 기간 범위에 포함되지 않는 경우 제공 가능한 프로모션 개수는 0이 반환된다.', () => {
      // given
      const promotion = new Promotion({
        name: '탄산2+1',
        type: 'TWO_PLUS_ONE',
        quantity: 10,
        start_date: '2024-01-10',
        end_date: '2024-01-17',
      });

      // when
      const result = promotion.getAvailableQuantity(3);

      // then
      expect(result).toEqual({
        quantity: 0,
        violation: null,
      });
    });

    test('type이 null인 경우, 결과로는 항상 0이 반환된다.', () => {
      // given
      const promotion = new Promotion({
        name: '',
        type: null,
        quantity: 10,
        start_date: '1989-01-01',
        end_date: '2222-02-22',
      });

      // when
      const result = promotion.getAvailableQuantity(10);

      // then
      expect(result).toEqual({
        quantity: 0,
        violation: null,
        freebieCount: 0,
      });
    });

    test('decrease() 메소드를 호출하여 재고 수량을 감소시킬 수 있다.', () => {
      // given
      const before = 10;
      const decreaseRequest = 3;
      const promotion = new Promotion({
        name: '탄산2+1',
        type: 'TWO_PLUS_ONE',
        quantity: before,
        start_date: '1989-01-01',
        end_date: '2222-02-22',
      });

      // when
      promotion.decrease(decreaseRequest);
      console.log(promotion.summary);

      // then
      expect(promotion.summary).toEqual({
        name: '탄산2+1',
        quantity: before - decreaseRequest,
      });
    });

    test('decrease() 메소드를 호출시 현재 재고 수량을 초과하는 값을 감소시키는 경우 예외가 발생한다.', () => {
      // given
      const before = 10;
      const promotion = new Promotion({
        name: '탄산2+1',
        type: 'TWO_PLUS_ONE',
        quantity: before,
        start_date: '1989-01-01',
        end_date: '2222-02-22',
      });

      // when...then
      expect(() => {
        promotion.decrease(before + 1);
      }).toThrow(
        '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.'
      );
    });

    test('summary 프로퍼티를 호출하여 프로모션 재고를 확인할 수 있다.', () => {
      // given
      const quantity = 10;
      const promotion = new Promotion({
        quantity,
        name: '탄산2+1',
        type: 'TWO_PLUS_ONE',
        start_date: '1989-01-01',
        end_date: '2222-02-22',
      });

      // when
      const result = promotion.summary;

      // then
      expect(result).toEqual({
        name: '탄산2+1',
        quantity,
      });
    });
  });
});
