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

    return result; // 최종 차감될 quantity
  }

  async handleOnePlusOnePromo(promoProduct, quantity) {
    const unit = Math.floor(quantity / 1);
    const remainder = quantity % 1;

    if (promoProduct.quantity >= unit + remainder) {
      return await this.notifyExtraProm(promoProduct, sets);
    }
    this.notifyOutOfPromoStock(promoProduct, quantity - promoProduct.quantity);
  }

  async handleTwoPlusOnePromo(promoProduct, quantity) {
    const unit = Math.floor(quantity / 2);
    const remainder = quantity % 2;

    // 프로모션이 가능한지 검증
    if (promoProduct.quantity >= unit * 3 + remainder) {
      return await this.offerExtraPromo(promoProduct, unit, '탄산2+1');
    } else {
      this.notifyOutOfPromoStock(
        promoProduct,
        quantity - promoProduct.quantity
      );
    }

    // 프로모션 재고 부족 시 일반 재고에서 차감
    if (remainder > 0) {
      this.applyRegularDeduction(promoProduct, remainder);
    }
  }

  async notifyOutOfPromoStock(promoProduct, quantity) {}
}

export default new Cashier();
