class InventoryManager {
  #prodcuts;
  #promotions;

  constructor(products, promotions) {
    this.#prodcuts = products;
    this.#promotions = promotions;
  }
  // 결제가능여부 체크
  isPaymentEligible(products) {
    if (products.quantity < quantity) {
      throw new Error('[ERROR]');
    }
  }
  // 프로모션 우선 차감
  // 프로모션 배열/그냥 배열 나눠서 가지고있기
  applyPromoDedcution(products, promoProduct, quantity) {
    this.isPaymentEligible(products);
    if (promoProduct.quantity > quantity) {
      promoProduct.quantity -= quantity;
    }
    if (quantity > promoProduct.quantity) {
      quantity -= promoProduct.quantity;
      this.isPaymentEligible(products);
      products.quantity -= quantity;
    }
  }
  // 프로모션 받을 수 있을 때 받겠습니까 안내
  async notifyTwoPlusOnePromoOption(quanntity, products) {
    if (!quanntity % 2) {
      return await Console.readLineAsync(`현재 ${products.name}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)
`);
    }
  }

  async nottifyOnePlusOnePromoOption(quanntity, products) {
    if (quanntity % 2) {
      return await Console.readLineAsync(
        `현재 ${products.name}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`
      );
    }
  }

  confirmPromoDeduction(response, product) {
    if (/^y$/i.test(response.trim()) && /^n$/i.test(response.trim())) {
      throw new Error(
        '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.'
      );
    }
    if (/^y$/i.test(response.trim())) {
      return (product.quantity -= 1);
    }
    if (/^n$/i.test(response.trim())) {
      return product.quantity;
    }
  }

  // 프로모션 재고가 부족할 때 일반 재고로 판매됨을 공지
  notifyRegularStockUser(products) {}

  // 재고 업데이트
  updateStock(products) {}
}
