import Receipt from './Receipt.js';

class Cashier {
  #maximumDiscountAmount;
  #discountPercentage;

  constructor(maxDiscountAmount = 8000, discountPercentage = 0.3) {
    this.#maximumDiscountAmount = maxDiscountAmount;
    this.#discountPercentage = discountPercentage;
  }

  checkout(confirmedPlans, shouldDiscount) {
    const results = confirmedPlans.map((plan) => this.#processPlan(plan));
    const sumOfPrice = this.#calculateTotalPrice(results);
    const goodsCount = this.#calculateTotalCount(results);
    const discountByMembership = this.#calculateDiscountByMembership(
      results,
      shouldDiscount
    );

    return new Receipt(sumOfPrice, goodsCount, results, discountByMembership);
  }

  #processPlan({ name, price, freebieCount, quantity }) {
    const currentCount = quantity.regular + quantity.promotional;
    const currentPrice = currentCount * price;

    const result = {
      name,
      count: currentCount,
      price: currentPrice,
      freebie: this.#processFreebie(freebieCount, price),
    };

    return result;
  }

  #processFreebie(freebieCount, price) {
    if (freebieCount > 0) {
      return { count: freebieCount, price: freebieCount * price };
    }
    return null;
  }

  #calculateTotalPrice(results) {
    return results.reduce((total, { price }) => total + price, 0);
  }

  #calculateTotalCount(results) {
    return results.reduce((acc, { count }) => acc + count, 0);
  }

  #calculateDiscountByMembership(results, shouldDiscount) {
    if (!shouldDiscount) return 0;

    const discount = this.#calculateDiscountAmount(results);
    return Math.min(discount, this.#maximumDiscountAmount);
  }

  #calculateDiscountAmount(results) {
    return (
      results
        .filter((e) => !e.freebie)
        .reduce((acc, target) => acc + target.price, 0) *
      this.#discountPercentage
    );
  }
}

export default Cashier;
