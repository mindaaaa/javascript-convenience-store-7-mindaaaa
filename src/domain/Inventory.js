class Inventory {
  hasPromotion;
  #products;

  constructor(products) {
    this.#validate(products);
    this.#products = products;
  }

  #validate(product) {
    const { name, price, quantity, promotion } = product;

    this.#validateName(name);
    this.#validatePrice(price);
    this.#validateQuantity(quantity);
    this.#validatePromotion(promotion);
  }

  #validateName(name) {
    if (!name) {
      throw new Error('[ERROR] 상품명은 필수입니다.');
    }
  }

  #validatePrice(price) {
    if (price == null || price <= 0 || !Number.isInteger(price)) {
      throw new Error('[ERROR] 가격은 양의 정수여야합니다.');
    }
  }

  #validateQuantity(quantity) {
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new Error('[ERROR] 재고 수량은 null값과 양의 정수만 허용됩니다.');
    }
  }

  validPromotions = ['1+1', '2+1', 'MD추천상품', '반짝할인'];
  #validatePromotion(promotion) {
    if (promotion && !this.validPromotions.includes(promotion)) {
      throw new Error(`[ERROR] 유효하지 않은 프로모션: ${promotion}`);
    }
  }
}
