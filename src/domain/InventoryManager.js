import { Console } from '@woowacourse/mission-utils';
import Promotion from './Promotion.js';
import { PRODUCTS, PROMOTIONS } from '../utils/constants.js';

class InventoryManager {
  #products;
  #promotions;
  #activePromoProducts;
  #regularProducts;

  constructor(productName, requestedQuantity) {
    this.#products = PRODUCTS;
    this.#promotions = PROMOTIONS;
    this.#activePromoProducts = this.getActivePromProducts();
    this.#regularProducts = this.getRegularProducts();
  }

  getActivePromProducts() {
    const activePromotions = Promotion.getValidPromotions(this.#promotions);

    return this.#products.filter((product) =>
      activePromotions.some((promo) => promo.name === product.promotion)
    );
  }

  getRegularProducts() {
    const activePromotions = Promotion.getValidPromotions(this.#promotions);
    return this.#products.filter(
      (product) =>
        product.promotion === null ||
        !activePromotions.some((promo) => promo.name === product.promotion)
    );
  }

  applyDeduction(productName, quantity) {}

  #findProduct(productName) {
    const promoProduct = this.#activePromoProducts.find(
      (product) => product.name === productName
    );
    const regularProduct = this.#regularProducts.find(
      (product) => product.name === productName
    );
    return { promoProduct, regularProduct };
  }

  getPromoProduct(productName) {
    return this.#activePromoProducts.find(
      (product) => product.name === productName
    );
  }

  getRegularProduct(productName) {
    return this.#regularProducts.find(
      (product) => product.name === productName
    );
  }

  // TODO: Validator에서 걸러지므로 추가 수령만 확인
  #isNotPaymentEligible(productName, requestedQuantity) {
    const matchingProduct = PRODUCTS.filter(
      (product) => product.name === productName
    );

    const totalQuantity = matchingProduct.reduce(
      (acc, product) => acc + product.quantity,
      0
    );

    return totalQuantity < requestedQuantity;
  }

  #syncProducts() {
    this.#products = [...this.promArray, ...this.regularArray];
  }
}

export default InventoryManager;

// 1. 구매 요청이 들어오면, 요청된 제품에 대해 유효한 프로모션인지 확인
// 유효한 프로모션 목록에 해당 제품의 프로모션이 포함되어 있으면, 프로모션 재고 차감이 필요

// 2. 제품이 프로모션을 가지고 있을 때 먼저 프로모션 재고를 확인
// 추가 증정 가능 여부를 먼저 판단하고 프로모션 재고를 확인함

// 3. 프로모션 기간에 무조건 프로모션 재고 우선차감

// 4. 일반 재고 차감 여부 안내
// 프로모션 재고가 부족한 경우 일반 재고 사용 여부를 물음
