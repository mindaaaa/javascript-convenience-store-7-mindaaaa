import parseToObjectArray from './utils/mdParser.js';

export const MESSAGES = {
  promo: (productName) =>
    `현재 ${productName}은(는) ${quantity}를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`,
  noPromo: (productName, quantity) =>
    `현재 ${productName} ${quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)`,
  membership: '멤버십 할인을 받으시겠습니까? (Y/N)',
  anotherProduct: '감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)',
};

export const PRODUCTS = parseToObjectArray('public/products.md');
export const PROMOTIONS = parseToObjectArray('public/promotions.md');
