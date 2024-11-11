class Checkout {
  #shelves;

  constructor(shelves) {
    this.#shelves = shelves;
  }

  createPaymentPlan(shoppingCart) {
    return shoppingCart.goods.map(({ name, quantity }) => {
      return this.createPaymentSummary(name, quantity);
    });
  }

  createPaymentSummary(name, quantity) {
    const targetGoods = this.#shelves.goods.find(
      (goods) => goods.name === name
    );

    if (!targetGoods) {
      throw new Error('[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.');
    }

    return targetGoods.getPaymentSummary(quantity);
  }
}
