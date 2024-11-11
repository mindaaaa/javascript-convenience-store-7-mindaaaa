export const PromotionType = {
  TWO_PLUS_ONE: 'TWO_PLUS_ONE',
  MD_RECOMMEND: 'MD_RECOMMEND',
  TIME_SALE: 'TIME_SALE',
  NONE: 'NONE',
};

export const PromotionViolation = {
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  ONE_MORE: 'ONE_MORE',
};

export const ERROR_MESSAGES = {
  INVALID_FORMAT:
    '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.',
  PRODUCT_NOT_FOUND: '[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.',
  EXCEEDS_STOCK:
    '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.',
  INVALID_INPUT: '[ERROR] 잘못된 입력입니다. 다시 입력해 주세요.',
};

export const SETTINGS = {
  PRODUCT_QUANTITY_INPUT_PATTERN:
    /^\[([가-힣a-zA-Z0-9]+)-([1-9]\d*)](,\s*\[([가-힣a-zA-Z0-9]+)-([1-9]\d*)])*$/,
  PRODUCT_QUANTITY_SEPARATOR: '-',
};

export const RECEIPT = {
  HEADER: '===========W 편의점============',
  ITEM_HEADER: '상품명\t\t수량\t금액',
  PROMOTION_HEADER: '===========증\t정=============',
  FOOTER_DIVIDER: '===============================',
  TOTAL_PURCHASE_AMOUNT: '총구매액\t',
  PROMOTION_DISCOUNT: '행사할인\t\t-',
  MEMBERSHIP_DISCOUNT: '멤버십할인\t\t-',
  FINAL_AMOUNT: '내실돈\t\t\t',
  STOCK_UNAVAILABLE: '재고 없음',
  UNIT: '개',
};

export const NEW_LINE = '\n';
export const TAB = '\t';

export const PROMOTION = {
  TWO_PLUS_ONE: '탄산2+1',
  MD_RECOMMEND: 'MD추천상품',
  TIME_SALE: '반짝할인',
};

export const MESSAGES = {
  GREETING: [
    '안녕하세요. W편의점입니다.',
    '현재 보유하고 있는 상품입니다.',
    '',
  ].join('\n'),
  PROMPT_PRODUCT_INPUT:
    '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n',
  PROMPT_ONE_MORE: (name, quantity) =>
    `\n현재 ${name}은(는) ${quantity}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`,
  PROMPT_OUT_OF_STOCK: (name, quantity) =>
    `\n현재 ${name} ${quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`,
  PROMPT_MEMBERSHIP_DISCOUNT: '\n멤버십 할인을 받으시겠습니까? (Y/N)\n',
  THANK_YOU_MESSAGE: '감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)\n',
};
