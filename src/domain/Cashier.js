import Receipt from './Receipt.js';

class Cashier {
  #maximumDiscountAmount;
  #discountPercentage;

  constructor(maxDiscountAmount = 8000, discountPercentage = 0.3) {
    this.#maximumDiscountAmount = maxDiscountAmount;
    this.#discountPercentage = discountPercentage;
  }

  checkout(confirmedPlans, shouldDiscount) {
    // [{ name: '콜라', price: 1000, requestedQuantity: 6, freebieCount: 2, quantity: { regular: 0, promotional: 6 } }]
    const results = [];

    let sumOfPrice = 0;
    let goodsCount = 0;
    for (const { name, price, freebieCount, quantity } of confirmedPlans) {
      const currentCount = quantity.regular + quantity.promotional;
      goodsCount += currentCount;

      const currentPrice = currentCount * price;
      sumOfPrice += currentPrice;

      const result = {
        name,
        count: currentCount,
        price: currentPrice,
        freebie: null,
      };
      if (freebieCount > 0) {
        result.freebie = {
          count: freebieCount,
          price: freebieCount * price,
        };
      }

      results.push(result);
    }

    const discountByMembership = this.#calculateDiscountByMembership(
      results,
      shouldDiscount
    );

    return new Receipt(sumOfPrice, goodsCount, results, discountByMembership);
  }

  #calculateDiscountByMembership(results, shouldDiscount) {
    if (!shouldDiscount) {
      return 0;
    }

    const discount =
      results
        .filter((e) => !e.freebie)
        .reduce((acc, target) => acc + target.price, 0) *
      this.#discountPercentage;

    if (discount > this.#maximumDiscountAmount) {
      return this.#maximumDiscountAmount;
    }

    return discount;
  }
}

export default Cashier;
