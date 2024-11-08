import parseToObjectArray from '../utils/mdParser';

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
    });
  }

  #isValidProduct(name) {
    const products = parseToObjectArray('public/products.md');
    const productNames = products.map((product) => product.name);

    if (!productNames.includes(name)) {
      throw new Error('[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.');
    }
  }

  #parseProductInput(userInput) {
    const [name, quantity] = userInput.slice(1, -1).split('-');
    return { name, quantity: Number(quantity) };
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

// 구매 수량이 재고 수량을 초과한 경우: [ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.
// 기타 잘못된 입력의 경우: [ERROR] 잘못된 입력입니다. 다시 입력해 주세요.

export default new Validator();
