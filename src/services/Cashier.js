import InventoryManager from '../domain/InventoryManager.js';
import Validator from '../validation/Validator.js';

class Cashier {
  constructor(inventoryManager) {
    this.inventoryManager = inventoryManager;
  }

  async handlePurchase(productName, requestedQuantity) {
    const promProduct = this.inventoryManager.getPromoProduct(productName);
    const regularProduct = this.inventoryManager.getRegularProduct(productName);

    if (promProduct) {
      if (
        promProduct.promotion === 'MD추천상품' ||
        promProduct.promotion === '반짝할인'
      ) {
        await this.handleOnePlusOnePromo(promProduct, requestedQuantity);
      }
      if (promProduct.promotion === '탄산2+1') {
        await this.handleTwoPlusOnePromo(promoProduct, requestedQuantity);
      }
    }
    if (regularProduct) {
      this.applyRegularDeduction(regularProduct, requestedQuantity);
    }
  }

  async handleOnePlusOnePromo(promoProduct, quantity) {
    const unit = Math.floor(quantity / 1);
    const remainder = quantity % 1;

    if (promoProduct.quantity >= unit + remainder) {
      return await this.notifyExtraProm(promoProduct, sets);
    }
    this.notifyOutOfPromoStock(promoProduct, quantity - promoProduct.quantity);
  }
}

export default new Cashier();
