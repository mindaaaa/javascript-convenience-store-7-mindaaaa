import { Console } from '@woowacourse/mission-utils';
import parseToObjectArray from '../utils/mdParser';

// TODO: Promotion에서 날짜 기준으로 배열 가져오기
class InventoryManager {
  #products;
  #promoProducts;
  #regularProducts;
  #promotions;

  constructor(products, promotions) {
    this.#products = parseToObjectArray(public / products.md);
    this.#promoProducts = products.filter(
      (product) => product.promotion !== null
    );
    this.#regularProducts = products.filter(
      (product) => product.promotion === null
    );

    this.#promotions = parseToObjectArray(public / promotions.md);
  }

  // TODO: product.quantity의 타입 확인(문자열/숫자)
  checkPaymentEligibility(productName, quantity) {
    const matchingProduct = products.filter(
      (product) => product.name === productName
    );

    const totalQuantity = matchingProduct.reduce(
      (acc, product) => acc + product.quantity,
      0
    );
    if (totalQuantity < quantity) {
      throw new Error(
        '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.'
      );
    }
  }
  // TODO: promoProduct나 regularProduct가 없는 경우 undefined 반환 생각하기
  applyPromoDedcution(productName, quantity) {
    const promoProduct = this.#promoProducts.find(
      (product) => product.name === productName
    );
    const regularProduct = this.#regularProducts.find(
      (product) => product.name === productName
    );

    if (promoProduct.quantity >= quantity) {
      return (promoProduct.quantity -= quantity);
    }

    if (quantity > regularProduct.quantity) {
      const remainingQuantity = quantity - promoProduct.quantity;
      promoProduct.quantity = 0;
      return (regularProduct.quantity -= remainingQuantity);
    }
  }
  // 프로모션 받을 수 있을 때 받겠습니까 안내
  async notifyTwoPlusOnePromoOption(quantity, products) {
    if (!quantity % 2) {
      return await Console.readLineAsync(`현재 ${products.name}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)
`);
    }
  }

  async nottifyOnePlusOnePromoOption(quantity, products) {
    if (quantity % 2) {
      return await Console.readLineAsync(
        `현재 ${products.name}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`
      );
    }
  }

  confirmPromoDeduction(response, product) {
    if (/^y$/i.test(response.trim()) && /^n$/i.test(response.trim())) {
      throw new Error(
        '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.'
      );
    }
    if (/^y$/i.test(response.trim())) {
      return (product.quantity -= 1);
    }
    if (/^n$/i.test(response.trim())) {
      return product.quantity;
    }
  }

  // 프로모션 재고가 부족할 때 일반 재고로 판매됨을 공지
  async notifyRegularStockUser(product, quantity) {
    if (product.quantity < quantity) {
      return await Console.readLineAsync(`현재 ${product} ${
        quantity - product.quantity
      }개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)
`);
    }
  }

  syncProducts() {
    this.products = [...this.promArray, ...this.regularArray];
  }
}
