import MdFileReader from '../../src/utils/MdFileReader.js';
import { Console } from '@woowacourse/mission-utils';

describe.skip('md 파일을 읽어와 객체배열로 반환한다.', () => {
  test('test', () => {
    // given
    const products = [
      { name: '콜라', price: 1000, quantity: 10, promotion: '탄산2+1' },
      { name: '콜라', price: 1000, quantity: 10, promotion: null },
      { name: '사이다', price: 1000, quantity: 8, promotion: '탄산2+1' },
      { name: '사이다', price: 1000, quantity: 7, promotion: null },
      { name: '오렌지주스', price: 1800, quantity: 9, promotion: 'MD추천상품' },
      { name: '탄산수', price: 1200, quantity: 5, promotion: '탄산2+1' },
      { name: '물', price: 500, quantity: 10, promotion: null },
      { name: '비타민워터', price: 1500, quantity: 6, promotion: null },
      { name: '감자칩', price: 1500, quantity: 5, promotion: '반짝할인' },
      { name: '감자칩', price: 1500, quantity: 5, promotion: null },
      { name: '초코바', price: 1200, quantity: 5, promotion: 'MD추천상품' },
      { name: '초코바', price: 1200, quantity: 5, promotion: null },
      { name: '에너지바', price: 2000, quantity: 5, promotion: null },
      { name: '정식도시락', price: 6400, quantity: 8, promotion: null },
      { name: '컵라면', price: 1700, quantity: 1, promotion: 'MD추천상품' },
      { name: '컵라면', price: 1700, quantity: 10, promotion: null },
    ];
    const promotions = [
      {
        name: '탄산2+1',
        buy: 2,
        get: 1,
        start_date: '2024-01-01T00:00:00.000Z',
        end_date: '2024-12-31T00:00:00.000Z',
      },
      {
        name: 'MD추천상품',
        buy: 1,
        get: 1,
        start_date: '2024-01-01T00:00:00.000Z',
        end_date: '2024-12-31T00:00:00.000Z',
      },
      {
        name: '반짝할인',
        buy: 1,
        get: 1,
        start_date: '2024-11-01T00:00:00.000Z',
        end_date: '2024-11-30T00:00:00.000Z',
      },
    ];

    // when...then
    Console.print(MdFileReader.read('public/products.md'));
    Console.print(MdFileReader.read('public/promotions.md'));
  });
});
