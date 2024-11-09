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

// applyDeduction(productName, quantity) {
//   const { promoProduct, regularProduct } = this.#findProduct(productName);

//   if (promoProduct && regularProduct) {
//     this.deductPromoAndRegular(promoProduct, regularProduct, quantity);
//   }
//   if (promoProduct) {
//     this.deductPromoSockOnly(promoProduct, quantity);
//   }
//   if (regularProduct) {
//     this.deductRegularStockOnly(regularProduct, quantity);
//   }
//   if (!(promoProduct && regularProduct)) {
//     this.handleMissingProduct(productName);
//   }
// }

// #findProduct(productName) {
//   const promoProduct = this.#promoProducts.find(
//     (product) => product.name === productName
//   );
//   const regularProduct = this.#regularProducts.find(
//     (product) => product.name === productName
//   );
//   return { promoProduct, regularProduct };
// }

// deductPromoAndRegular() {
//   this.#findProduct(productName);
//   this.#checkPaymentEligibility(productName, quantity);
//   // TODO: 프로모션을 더 받을 수 있음을 알리는 핸들
//   this.#applyPromoDedcution(productName, quantity);
//   this.#syncProducts();
// }

// // TODO: product.quantity의 타입 확인(문자열/숫자)
// #checkPaymentEligibility(productName, quantity) {
//   const matchingProduct = products.filter(
//     (product) => product.name === productName
//   );

//   const totalQuantity = matchingProduct.reduce(
//     (acc, product) => acc + product.quantity,
//     0
//   );
//   if (totalQuantity < quantity) {
//     throw new Error(
//       '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.'
//     );
//   }
// }

// // TODO: promoProduct나 regularProduct가 없는 경우 undefined 반환 생각하기
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

// // 프로모션 재고만 있는 경우
// deductPromoSockOnly() {
//   this.#findProduct(productName);
//   this.#checkPaymentEligibility(productName, quantity);
//   promoProduct.quantity -= quantity;
//   return syncProducts();
// }

// // 일반 재고만 있는 경우
// deductRegularStockOnly() {
//   this.#findProduct(productName);
//   this.#checkPaymentEligibility(productName, quantity);
//   regularProduct -= quantity;
//   return syncProducts();
// }

// async handleMissingProduct(productName) {
//   // TODO: 에러 메시지를 던지고 입력받을 수 있는 로직 구현
//   if (!this.#products.find((product) => product.name === productName)) {
//     return await Console.readLineAsync(
//       '[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.'
//     );
//   }
// }

// async #notifyTwoPlusOnePromoOption(quantity, product) {
//   if (quantity % 3 === 2) {
//     const response =
//       await Console.readLineAsync(`현재 ${product.name}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)
// `);

//     try {
//       this.#confirmPromoDeduction(response, product);
//     } catch (error) {
//       Console.print(error.message);
//       await this.#nottifyOnePlusOnePromoOption(quantity, product);
//     }
//   }
// }

// async #nottifyOnePlusOnePromoOption(quantity, product) {
//   if (quantity % 2) {
//     const response = await Console.readLineAsync(
//       `현재 ${product.name}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`
//     );

//     try {
//       this.#confirmPromoDeduction(response, product);
//     } catch (error) {
//       Console.print(error.message);
//       await this.#nottifyOnePlusOnePromoOption(quantity, product);
//     }
//   }
// }

// // TODO: 수정사항 확인
// #confirmPromoDeduction(response, product) {
//   if (/^y$/i.test(response.trim())) {
//     return (product.quantity -= 1);
//   }
// }

// // 프로모션 재고가 부족할 때 일반 재고로 판매됨을 공지
// async notifyRegularStockUser(product, quantity) {
//   if (product.quantity < quantity) {
//     return await Console.readLineAsync(`현재 ${product} ${
//       quantity - product.quantity
//     }개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)
// `);
//   }
// }

// #syncProducts() {
//   this.#products = [...this.promArray, ...this.regularArray];
// }

// get products() {
//   return this.#products;
// }
