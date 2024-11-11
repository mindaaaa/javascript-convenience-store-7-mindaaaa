class Receipt {
  #priceSum;
  #countSum;
  #data;
  #discountByMembership;

  constructor(price, count, data, discountByMembership) {
    this.#priceSum = price;
    this.#countSum = count;
    this.#data = data;
    this.#discountByMembership = discountByMembership;
  }

  toString() {
    const primarySection = this.#data.map((e) => {
      return `${e.name}\t${e.count}\t${e.price.toLocaleString()}`;
    });

    const promotionalTargets = this.#data.filter((e) => e.freebie);

    const secondarySection = promotionalTargets.map((e) => {
      return `${e.name}\t${e.freebie.count}`;
    });

    const discountByPromotion = promotionalTargets.reduce((acc, target) => {
      return target.freebie.price + acc;
    }, 0);

    const result =
      this.#priceSum - discountByPromotion - this.#discountByMembership;

    return `===========W 편의점=============
      상품명\t수량\t금액
      ${primarySection.join('\n')}
      ===========증\t정=============
      ${secondarySection.join('\n')}
      ==============================
      총구매액\t${this.#countSum}\t${this.#priceSum.toLocaleString()}
      행사할인\t\t-${discountByPromotion.toLocaleString()}
      멤버십할인\t\t-${this.#discountByMembership.toLocaleString()}
      내실돈\t\t${result.toLocaleString()}
      
      `;
  }
}

export default Receipt;
