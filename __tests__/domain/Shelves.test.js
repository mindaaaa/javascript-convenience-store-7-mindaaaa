import Shelves from '../../src/domain/Shelves.js';

describe('Shelves 클래스에 대해', () => {
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

  test('인스턴스화에 성공했을 경우 summary 프로퍼티로 정보를 확인할 수 있다.', () => {
    // given
    const shelves = new Shelves(products, promotions);

    // when
    const result = shelves.summary;
    console.log(result);

    // then
    expect(result).toEqual([
      {
        name: '콜라',
        price: 1000,
        quantity: 10,
        promotion: { name: '탄산2+1', quantity: 10 },
      },
      {
        name: '사이다',
        price: 1000,
        quantity: 7,
        promotion: { name: '탄산2+1', quantity: 8 },
      },
      {
        name: '오렌지주스',
        price: 1800,
        quantity: 0,
        promotion: { name: 'MD추천상품', quantity: 9 },
      },
      {
        name: '탄산수',
        price: 1200,
        quantity: 0,
        promotion: { name: '탄산2+1', quantity: 5 },
      },
      {
        name: '물',
        price: 500,
        quantity: 10,
        promotion: { name: '', quantity: 0 },
      },
      {
        name: '비타민워터',
        price: 1500,
        quantity: 6,
        promotion: { name: '', quantity: 0 },
      },
      {
        name: '감자칩',
        price: 1500,
        quantity: 5,
        promotion: { name: '반짝할인', quantity: 5 },
      },
      {
        name: '초코바',
        price: 1200,
        quantity: 5,
        promotion: { name: 'MD추천상품', quantity: 5 },
      },
      {
        name: '에너지바',
        price: 2000,
        quantity: 5,
        promotion: { name: '', quantity: 0 },
      },
      {
        name: '정식도시락',
        price: 6400,
        quantity: 8,
        promotion: { name: '', quantity: 0 },
      },
      {
        name: '컵라면',
        price: 1700,
        quantity: 10,
        promotion: { name: 'MD추천상품', quantity: 1 },
      },
    ]);
  });

  test('tryFetchGoods() 메소드를 호출하여 임의의 제품의 재고를 감소시킬 수 있다.', () => {
    // given
    const goodsName = '탄산수';
    const regularQuantity = 0;
    const promotionalQuantity = 3;
    const before = products.find(
      (product) => product.name === goodsName
    ).quantity;
    const shelves = new Shelves(products, promotions);

    // when
    const result = shelves.tryFetchGoods(
      goodsName,
      regularQuantity,
      promotionalQuantity
    );

    expect(result).toEqual({
      name: goodsName,
      quantity: {
        regular: regularQuantity,
        promotional: promotionalQuantity,
      },
    });
    expect(shelves.summary).toEqual([
      {
        name: '콜라',
        price: 1000,
        quantity: 10,
        promotion: { name: '탄산2+1', quantity: 10 },
      },
      {
        name: '사이다',
        price: 1000,
        quantity: 7,
        promotion: { name: '탄산2+1', quantity: 8 },
      },
      {
        name: '오렌지주스',
        price: 1800,
        quantity: 0,
        promotion: { name: 'MD추천상품', quantity: 9 },
      },
      {
        name: '탄산수',
        price: 1200,
        quantity: 0,
        promotion: { name: '탄산2+1', quantity: before - promotionalQuantity },
      },
      {
        name: '물',
        price: 500,
        quantity: 10,
        promotion: { name: '', quantity: 0 },
      },
      {
        name: '비타민워터',
        price: 1500,
        quantity: 6,
        promotion: { name: '', quantity: 0 },
      },
      {
        name: '감자칩',
        price: 1500,
        quantity: 5,
        promotion: { name: '반짝할인', quantity: 5 },
      },
      {
        name: '초코바',
        price: 1200,
        quantity: 5,
        promotion: { name: 'MD추천상품', quantity: 5 },
      },
      {
        name: '에너지바',
        price: 2000,
        quantity: 5,
        promotion: { name: '', quantity: 0 },
      },
      {
        name: '정식도시락',
        price: 6400,
        quantity: 8,
        promotion: { name: '', quantity: 0 },
      },
      {
        name: '컵라면',
        price: 1700,
        quantity: 10,
        promotion: { name: 'MD추천상품', quantity: 1 },
      },
    ]);
  });

  test('toString() 메소드로 현재 진열된 모든 재고의 정보를 확인할 수 있다.', () => {
    // given
    const shelves = new Shelves(products, promotions);

    // when
    const result = shelves.toString();

    // then
    expect(result).toBe(`- 콜라 1,000원 10개 탄산2+1
- 콜라 1,000원 10개
- 사이다 1,000원 8개 탄산2+1
- 사이다 1,000원 7개
- 오렌지주스 1,800원 9개 MD추천상품
- 오렌지주스 1,800원 재고 없음
- 탄산수 1,200원 5개 탄산2+1
- 탄산수 1,200원 재고 없음
- 물 500원 10개
- 비타민워터 1,500원 6개
- 감자칩 1,500원 5개 반짝할인
- 감자칩 1,500원 5개
- 초코바 1,200원 5개 MD추천상품
- 초코바 1,200원 5개
- 에너지바 2,000원 5개
- 정식도시락 6,400원 8개
- 컵라면 1,700원 1개 MD추천상품
- 컵라면 1,700원 10개`);
  });
});
