import { PRODUCTS, PROMOTIONS } from '../utils/constants.js';
import Promotion from './Promotion.js';

class InventoryManagerV2 {
  #PromotionUnit;
  /*
  {
    '탄산2+1': 3,
    'MD추천상품':2,
    '반짤할인':2,
    };
    */

  constructor() {
    this.#PromotionUnit = Promotion.gatValidPromotions(PROMOTIONS).reduce(
      (obj, promotion) => {
        obj[promotion.name] = promotion.buy + promotion.get;

        return obj;
      },
      {}
    );
  }

  // 나 콜라 3개 살거야!
  // 결제 가능 여부 파악
  // 프로모션 unit 단위로 나눠서 프로모션 재고랑 비교하고, 적으면 안내문구

  temp(productName, requestedQuantity) {
    if (this.#isNotPaymentEligible(productName, requestedQuantity)) {
      return { violation: 'OUT_OF_STOCK' };
    }
    const targetProducts = PRODUCTS.filter(
      (product) => product.name === productName
    );

    const promotedTarget = targetProducts.find((product) =>
      Reflect.has(this.#PromotionUnit, product.promotion)
    );

    if (!promotedTarget) {
      // 일반 재고를 우선 소진 시켜야 함!
      const regularProduct = targetProducts.find(
        (product) => !product.promotion
      );
      if (regularProduct.quantity >= requestedQuantity) {
        return {
          regularQuantity: requestedQuantity,
          promoQuantity: 0,
          violation: null,
        }; // 일반 재고로 모두 처리 가능한 경우
      } else {
        return {
          promoQuantity: requestedQuantity - regularProduct.quantity,
          regularProduct: regularProduct.quantity,
          violation: null,
        };
      }
    } else {
      if (this.#isOutOfPromotionStock(productName, requestedQuantity)) {
        return { violation: 'OUT_OF_PROMOTION_STOCK' };
      }
    }
  }

  #isNotPaymentEligible(productName, requestedQuantity) {
    const matchingProduct = PRODUCTS.filter(
      (product) => product.name === productName
    );

    const totalQuantity = matchingProduct.reduce(
      (acc, product) => acc + product.quantity,
      0
    );

    return totalQuantity < requestedQuantity;
  }

  #isOutOfPromotionStock(productName, requestedQuantity) {
    if (!temp) {
    }
    requestedQuantity % 3 === 2;
    // 5개를 사는 경우(2+1 / 5)
    // requestedQuantity % 3 === 2 // requestedQuantity+1
  }
}
