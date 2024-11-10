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
    this.#activePromoProducts = this.#getActivePromProducts();
    this.#regularProducts = this.#getRegularProducts();
  }

  #getActivePromProducts() {
    const activePromotions = Promotion.getValidPromotions(this.#promotions);

    return this.#products.filter((product) =>
      activePromotions.some((promo) => promo.name === product.promotion)
    );
  }

  #getRegularProducts() {
    const activePromotions = Promotion.getValidPromotions(this.#promotions);
    return this.#products.filter(
      (product) =>
        product.promotion === null ||
        !activePromotions.some((promo) => promo.name === product.promotion)
    );
  }

  applyDeductions(deductions) {
    for (const { name, quantity, promotion } of deductions) {
      if (promotion) {
        const promoProduct = this.getPromoProduct(name);
        if (promoProduct) {
          promoProduct.quantity -= quantity;
        }
      }
      if (!promotion) {
        const regularProduct = this.getRegularProduct(name);
        if (regularProduct) {
          regularProduct.quantity -= quantity;
        }
      }
    }
    this.#syncProducts();
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

  #syncProducts() {
    this.#products = [...this.#activePromoProducts, ...this.#regularProducts];
  }
}

export default InventoryManager;
