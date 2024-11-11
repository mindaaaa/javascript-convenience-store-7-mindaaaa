import {
  ERROR_MESSAGES,
  PromotionType,
  PROMOTION,
  RECEIPT,
} from '../utils/constants.js';
import Inventory from './Inventory.js';

class Shelves {
  #inventory;

  constructor(products, promotions) {
    const productNames = this.#extractUniqueProductNames(products);
    this.#inventory = productNames.map((productName) =>
      this.#createInventory(productName, products, promotions)
    );
  }

  #extractUniqueProductNames(products) {
    return Array.from(new Set(products.map((e) => e.name)));
  }

  #createInventory(productName, products, promotions) {
    const regular = this.#findProductNamdAndPromotion(
      products,
      productName,
      false
    );
    const promotional = this.#findProductNamdAndPromotion(
      products,
      productName,
      true
    );
    const promotion = this.#findPromotionByName(
      promotions,
      promotional.promotion
    );

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
        start_date: promotion.start_date,
        end_date: promotion.end_date,
      }
    );
  }

  #findProductNamdAndPromotion(products, name, isPromotional) {
    return (
      products.find(
        (product) =>
          product.name === name && !!product.promotion === isPromotional
      ) || {}
    );
  }

  #findPromotionByName(promotions, name) {
    return promotions.find((promotion) => promotion.name === name) || {};
  }

  #getPromotionType(name) {
    if (name === PROMOTION.TWO_PLUS_ONE) return PromotionType.TWO_PLUS_ONE;
    if (name === PROMOTION.MD_RECOMMEND) return PromotionType.MD_RECOMMEND;
    if (name === PROMOTION.TIME_SALE) return PromotionType.TIME_SALE;
    return PromotionType.NONE;
  }

  tryFetchGoods(goodsName, regularQuantity, promotionalQuantity) {
    const target = this.#findGoodsByName(goodsName);
    target.decrease(regularQuantity, promotionalQuantity);
    return this.#formatFetchedGoods(
      goodsName,
      regularQuantity,
      promotionalQuantity
    );
  }

  #findGoodsByName(goodsName) {
    const target = this.#inventory.find((goods) => goods.name === goodsName);
    if (!target) throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    return target;
  }

  #formatFetchedGoods(goodsName, regularQuantity, promotionalQuantity) {
    return {
      name: goodsName,
      quantity: { regular: regularQuantity, promotional: promotionalQuantity },
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
      return this.#formatPromotionalGoods(summary, price);
    }
    return [
      `- ${summary.name} ${price}원 ${this.#formatQuantity(summary.quantity)}`,
    ];
  }

  #formatPromotionalGoods(summary, price) {
    return [
      `- ${summary.name} ${price}원 ${this.#formatQuantity(
        summary.promotion.quantity
      )} ${summary.promotion.name}`,
      `- ${summary.name} ${price}원 ${this.#formatQuantity(summary.quantity)}`,
    ];
  }

  #formatQuantity(quantity) {
    if (quantity) {
      return `${quantity}${RECEIPT.UNIT}`;
    }
    return RECEIPT.STOCK_UNAVAILABLE;
  }

  get goods() {
    return this.#inventory;
  }
}

export default Shelves;
