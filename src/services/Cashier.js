import InventoryManager from '../domain/InventoryManager.js';
import Validator from '../validation/Validator.js';

class Cashier {
  constructor(inventoryManager) {
    this.inventoryManager = inventoryManager;
  }

  async handlePurchase(purchaseRequests) {
    const results = [];

    for (const { name, quantity } of purchaseRequests) {
      const promProduct = this.inventoryManager.getPromoProduct(name);
      const regularProduct = this.inventoryManager.getRegularProduct(name);
      let resultQuantity;

      if (promProduct) {
        if (
          promProduct.promotion === 'MD추천상품' ||
          promProduct.promotion === '반짝할인'
        ) {
          resultQuantity = await this.handleOnePlusOnePromo(
            promProduct,
            quantity
          );
        }
        if (promProduct.promotion === '탄산2+1') {
          resultQuantity = await this.handleTwoPlusOnePromo(
            promoProduct,
            quantity
          );
        }
      }
      if (regularProduct) {
        resultQuantity = this.applyRegularDeduction(regularProduct, quantity);
      }

      let promotion = null;
      if (promProduct) {
        promotion = promProduct.promotion;
      }

      results.push({ name, quantity: resultQuantity, promotion });
    }
    return results; // [{name: '콜라', quantity: 3, promotion: '탄산2+1'}, ...]
  }

  async handleOnePlusOnePromo(promoProduct, quantity) {
    const requiredPromoStock = quantity * 2;

    if (promoProduct.quantity >= requiredPromoStock) {
      const isExtraPromo = await this.askForConfirmation(
        'promo',
        promoProduct.name,
        quantity
      );

      if (isExtraPromo) {
        promoProduct.quantity -= requiredPromoStock;
      }
      if (!isExtraPromo) {
        promoProduct.quantity -= quantity;
      }
    } else {
      const promoUnitsAvailable = Math.floor(promoProduct.quantity / 2);
      const remainingUnits = quantity - promoUnitsAvailable;

      promoProduct.quantity -= promoUnitsAvailable * 2;

      const confirmRegular = await this.askForConfirmation(
        'noPromo',
        promoProduct.name,
        remainingUnits
      );

      if (confirmRegular) {
        this.applyRegularDeduction(promoProduct, remainingUnits);
      }

      if (!confirmRegular) {
        const finalQuantity = quantity - remainingUnits;
        this.applyRegularDeduction(promoProduct, finalQuantity);
      }
    }
  }

  // 일반 재고에서 차감하는 메서드
  applyRegularDeduction(product, quantity) {
    const regularProduct = this.inventoryManager.getRegularProduct(
      product.name
    );
    if (regularProduct && regularProduct.quantity >= quantity) {
      regularProduct.quantity -= quantity;
    } else {
      throw new Error('[ERROR] 일반 재고가 부족합니다.');
    }
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
