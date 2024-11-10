import InventoryManager from '../domain/InventoryManager.js';
import Validator from '../validation/Validator.js';
import InputHandler from '../views/InputHandler.js';

class Cashier {
  constructor(inventoryManager) {
    this.inventoryManager = inventoryManager;
  }

  async handlePurchase(purchaseRequests) {
    const results = [];

    for (const { name, quantity } of purchaseRequests) {
      const promProduct = this.inventoryManager.getPromProduct(name);
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
            promProduct,
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

  async #handleOnePlusOnePromo(promProduct, quantity) {
    const requiredPromoStock = quantity * 2;

    if (promProduct.quantity >= requiredPromoStock) {
      const isExtraPromo = await InputHandler.askForConfirmation(
        'promo',
        promProduct.name,
        quantity
      );

      if (isExtraPromo) {
        promProduct.quantity -= requiredPromoStock;
      }
      if (!isExtraPromo) {
        promProduct.quantity -= quantity;
      }
    } else {
      const promoUnitsAvailable = Math.floor(promProduct.quantity / 2);
      const remainingUnits = quantity - promoUnitsAvailable;

      promProduct.quantity -= promoUnitsAvailable * 2;

      const confirmRegular = await InputHandler.askForConfirmation(
        'noPromo',
        promProduct.name,
        remainingUnits
      );

      if (confirmRegular) {
        this.#applyRegularDeduction(promProduct, remainingUnits);
      }
    }
  }

  #applyRegularDeduction(product, quantity) {
    const regularProduct = this.inventoryManager.getRegularProduct(
      product.name
    );

    regularProduct.quantity -= quantity;
  }

  async #handleTwoPlusOnePromo(promProduct, quantity) {
    const sets = Math.floor(quantity / 2);
    const requiredPromoStock = sets * 3;
    const remainder = quantity % 2;

    if (promProduct.quantity >= requiredPromoStock + remainder) {
      const isExtraPromo = await InputHandler.askForConfirmation(
        'promo',
        promProduct.name,
        sets
      );

      if (isExtraPromo) {
        promProduct.quantity -= sets * 3 + remainder;
      }
      if (!isExtraPromo) {
        promProduct.quantity -= quantity;
      }
    } else {
      const promoSetsAvailable = Math.floor(promProduct.quantity / 3);
      const promoQuantity = promoSetsAvailable * 3;
      const remainingQuantity = quantity - promoSetsAvailable * 2;

      promProduct.quantity -= promoQuantity;

      const confirmRegular = await InputHandler.askForConfirmation(
        'noPromo',
        promProduct.name,
        remainingQuantity
      );

      if (confirmRegular) {
        this.#applyRegularDeduction(promProduct, remainingQuantity);
      }
    }
  }
}

export default Cashier;
