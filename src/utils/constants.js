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
