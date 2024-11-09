import { PRODUCTS, PROMOTIONS } from '../utils/constants.js';

class Validator {
  validatePurchaseInput(userInput) {
    const pattern = /^\[([\w가-힣]+)-(\d+)\](,\s*\[([\w가-힣]+)-(\d+)\])*$/;

    if (!pattern.test(userInput.trim())) {
      throw new Error(
        '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.'
      );
    }

    const requestedProducts = userInput.match(/\[([^\]]+)\]/g);
    requestedProducts.forEach((productInput) => {
      const { name } = this.#parseProductInput(productInput);
      this.#isValidProduct(name);
      this.#checkPaymentEligibility(name, quantity);
    });
  }

  #parseProductInput(userInput) {
    const [name, quantity] = userInput.slice(1, -1).split('-');
    return { name, quantity: Number(quantity) };
  }

  #isValidProduct(name) {
    const productNames = PRODUCTS.map((product) => product.name);

    if (!productNames.includes(name)) {
      throw new Error('[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.');
    }
  }

  #checkPaymentEligibility(name, quantity) {
    const matchingProducts = PRODUCTS.filter(
      (product) => product.name === name
    );
    const totalQuantity = matchingProducts.reduce(
      (acc, prodcut) => acc + prodcut.quantity,
      0
    );

    if (totalQuantity < quantity) {
      throw new Error(
        '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.'
      );
    }
  }

  validateYesNoInput(response) {
    const userInput = response.trim().toLowerCase();
    if (userInput !== 'y' && userInput !== 'n') {
      throw new Error(
        '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.'
      );
    }
  }
}

// TODO: [ERROR] 잘못된 입력입니다. 다시 입력해 주세요.
// userInput이 undefined나 null인 경우로 생각

export default new Validator();