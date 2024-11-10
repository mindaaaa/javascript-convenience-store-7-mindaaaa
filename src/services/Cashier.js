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
          resultQuantity = await this.#handleOnePlusOnePromo(
            promProduct,
            quantity
          );
        }
        if (promProduct.promotion === '탄산2+1') {
          resultQuantity = await this.#handleTwoPlusOnePromo(
            promoProduct,
            quantity
          );
        }
      }
      if (regularProduct) {
        resultQuantity = this.#applyRegularDeduction(regularProduct, quantity);
      }

      let promotion = null;
      if (promProduct) {
        promotion = promProduct.promotion;
      }

      results.push({ name, quantity: resultQuantity, promotion });
    }
    return results; // [{name: '콜라', quantity: 3, promotion: '탄산2+1'}, ...]
  }

  async #handleOnePlusOnePromo(promoProduct, quantity) {
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
    }
  }

  #applyRegularDeduction(product, quantity) {
    const regularProduct = this.inventoryManager.getRegularProduct(
      product.name
    );

    regularProduct.quantity -= quantity;
  }

  async #handleTwoPlusOnePromo(promoProduct, quantity) {
    const sets = Math.floor(quantity / 2);
    const requiredPromoStock = sets * 3;
    const remainder = quantity % 2;

    if (promoProduct.quantity >= requiredPromoStock + remainder) {
      const isExtraPromo = await this.askForConfirmation(
        'promo',
        promoProduct.name,
        sets
      );

      if (isExtraPromo) {
        promoProduct.quantity -= sets * 3 + remainder;
      }
      if (!isExtraPromo) {
        promoProduct.quantity -= quantity;
      }
    } else {
      const promoSetsAvailable = Math.floor(promoProduct.quantity / 3);
      const promoQuantity = promoSetsAvailable * 3;
      const remainingQuantity = quantity - promoSetsAvailable * 2;

      promoProduct.quantity -= promoQuantity;

      const confirmRegular = await this.askForConfirmation(
        'noPromo',
        promoProduct.name,
        remainingQuantity
      );

      if (confirmRegular) {
        this.applyRegularDeduction(promoProduct, remainingQuantity);
      }
    }
  }
}

export default new Cashier();
