import { Console } from '@woowacourse/mission-utils';
import parseToObjectArray from '../utils/mdParser';
import Promotion from './Promotion.js';

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

  getPromotionType() {
    // 유효한 프로모션 찾기
    const promotion = new Promotion();
    const validPromotions = promotion.getValidPromotions(this.#promotions);

    const promotionType = validPromotions.map; // 여기부터 구현하기
  }
  applyDeduction(productName, quantity) {
    // TODO: handle이 이름 더 낫지 않나
    const { promoProduct, regularProduct } = this.#findProduct(productName);

    if (promoProduct && regularProduct) {
      this.deductPromoAndRegular(promoProduct, regularProduct, quantity);
    }
    if (promoProduct) {
      this.deductPromoSockOnly(promoProduct, quantity);
    }
    if (regularProduct) {
      this.deductRegularStockOnly(regularProduct, quantity);
    }
    if (!(promoProduct && regularProduct)) {
      this.handleMissingProduct(productName);
    }
  }

  #findProduct(productName) {
    const promoProduct = this.#promoProducts.find(
      (product) => product.name === productName
    );
    const regularProduct = this.#regularProducts.find(
      (product) => product.name === productName
    );
    return { promoProduct, regularProduct };
  }

  deductPromoAndRegular() {
    this.#findProduct(productName);
    this.#checkPaymentEligibility(productName, quantity);
    // TODO: 프로모션을 더 받을 수 있음을 알리는 핸들
    this.#applyPromoDedcution(productName, quantity);
    this.#syncProducts();
  }

  // TODO: product.quantity의 타입 확인(문자열/숫자)
  #checkPaymentEligibility(productName, quantity) {
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
  #applyPromoDedcution(productName, quantity) {
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

  // 프로모션 재고만 있는 경우
  deductPromoSockOnly() {
    this.#findProduct(productName);
    this.#checkPaymentEligibility(productName, quantity);
    promoProduct.quantity -= quantity;
    return syncProducts();
  }

  // 일반 재고만 있는 경우
  deductRegularStockOnly() {
    this.#findProduct(productName);
    this.#checkPaymentEligibility(productName, quantity);
    regularProduct -= quantity;
    return syncProducts();
  }

  async handleMissingProduct(productName) {
    // TODO: 에러 메시지를 던지고 입력받을 수 있는 로직 구현
    if (!this.#products.find((product) => product.name === productName)) {
      return await Console.readLineAsync(
        '[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.'
      );
    }
  }

  async #notifyTwoPlusOnePromoOption(quantity, product) {
    if (quantity % 3 === 2) {
      const response =
        await Console.readLineAsync(`현재 ${product.name}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)
`);

      try {
        this.#confirmPromoDeduction(response, product);
      } catch (error) {
        Console.print(error.message);
        await this.#nottifyOnePlusOnePromoOption(quantity, product);
      }
    }
  }

  async #nottifyOnePlusOnePromoOption(quantity, product) {
    if (quantity % 2) {
      const response = await Console.readLineAsync(
        `현재 ${product.name}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`
      );

      try {
        this.#confirmPromoDeduction(response, product);
      } catch (error) {
        Console.print(error.message);
        await this.#nottifyOnePlusOnePromoOption(quantity, product);
      }
    }
  }

  #confirmPromoDeduction(response, product) {
    if (/^y$/i.test(response.trim()) && /^n$/i.test(response.trim())) {
      throw new Error(
        '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.'
      );
    }
    if (/^y$/i.test(response.trim())) {
      return (product.quantity -= 1);
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

  #syncProducts() {
    return (this.products = [...this.promArray, ...this.regularArray]);
  }
}
