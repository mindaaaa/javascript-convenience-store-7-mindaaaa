import { PromotionType } from '../utils/constants.js';
import Inventory from './Inventory.js';

class Shelves {
  #inventory;

  constructor(products, promotions) {
    const productNames = Array.from(new Set(products.map((e) => e.name)));

    this.#inventory = productNames.map((productName) => {
      const regular =
        products.find(
          (product) => product.name === productName && !product.promotion
        ) || {};
      const promotional =
        products.find(
          (product) => product.name === productName && product.promotion
        ) || {};

      const promotion =
        promotions.find(
          (promotion) => promotion.name === promotional.promotion
        ) || {};

      return new Inventory(
        {
          name: productName,
          price: regular.price || promotional.price,
          quantity: regular.quantity,
        },
        {
          name: promotional.promotion,
          type: this.#getPromotionType(promotional.promotion),
          quantity: promotional.quantity,
          startFrom: promotion.start_date,
          endTo: promotion.end_date,
        }
      );
    });
  }

  #getPromotionType(name) {
    if (name === '탄산2+1') {
      return PromotionType.TWO_PLUS_ONE;
    }
    if (name === 'MD추천상품') {
      return PromotionType.MD_RECOMMEND;
    }
    if (name === '반짝할인') {
      return PromotionType.TIME_SALE;
    }

    return PromotionType.NONE;
  }

  tryFetchGoods(goodsName, regularQuantity, promotionalQuantity) {
    const target = this.#inventory.find((goods) => goods.name === goodsName);
    if (!target) {
      throw new Error('[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.');
    }

    target.decrease(regularQuantity, promotionalQuantity);

    return {
      name: goodsName,
      quantity: {
        regular: regularQuantity,
        promotional: promotionalQuantity,
      },
    };
  }

  get summary() {
    return this.#inventory.map((goods) => goods.summary);
  }

  toString() {
    return this.#inventory
      .map((goods) => this.#convertToString(goods))
      .flat()
      .join('\n');
  }

  #convertToString({ summary }) {
    const price = summary.price.toLocaleString();
    if (summary.promotion.name) {
      return [
        `- ${summary.name} ${price}원 ${this.#refineQuantity(
          summary.promotion.quantity
        )} ${summary.promotion.name}`,
        `- ${summary.name} ${price}원 ${this.#refineQuantity(
          summary.quantity
        )}`,
      ];
    }

    return [
      `- ${summary.name} ${price}원 ${this.#refineQuantity(summary.quantity)}`,
    ];
  }

  #refineQuantity(quantity) {
    if (!quantity) {
      return `재고 없음`;
    }

    return `${quantity}개`;
  }

  get goods() {
    return this.#inventory;
  }
}

export default Shelves;
