import { PromotionViolation } from '../utils/constants.js';
import Cart from '../domain/Cart.js';
import Cashier from '../domain/Cashier.js';

class ConvenienceStore {
  #shelf;
  #std;
  #paymentPlanner;
  #cashier;

  constructor(shelf, std, paymentPlanner) {
    this.#shelf = shelf;
    this.#std = std;
    this.#paymentPlanner = paymentPlanner;

    this.#cashier = new Cashier(8000, 0.3);
  }

  async run() {
    const rawGoodsInput = await this.#startStep();
    const draftPaymentPlan = await this.#selectGoodsStep(rawGoodsInput);
    const confirmedPlans = await this.#postSelectGoodsStep(draftPaymentPlan);
    const receipt = await this.#checkoutStep(confirmedPlans);
    return this.#endStep(receipt);
  }

  async #startStep() {
    const greeting = [
      `안녕하세요. W편의점입니다.`,
      `현재 보유하고 있는 상품입니다.`,
      ``,
      this.#shelf.toString(),
      ``,
    ];
    this.#std.write(greeting.join('\n'));
    return this.#std.readLine(
      '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n'
    );
  }

  async #selectGoodsStep(goodsInput) {
    let currentInput = goodsInput;
    while (true) {
      try {
        const shoppingCart = new Cart(currentInput);
        return this.#paymentPlanner.createDraftPaymentPlan(shoppingCart);
      } catch (e) {
        this.#std.write(e.message);
        currentInput = await this.#std.readLine(`\n`);
      }
    }
  }

  async #postSelectGoodsStep(paymentSummaries) {
    const confirmedPlans = [];

    for (const summary of paymentSummaries) {
      if (summary.violation.type) {
        const plan = await this.#handleViolatedPurchase(summary);
        confirmedPlans.push(plan);
      } else {
        const plan = this.#confirmPlan(summary);
        confirmedPlans.push(plan);
      }
    }

    return confirmedPlans;
  }

  async #handleViolatedPurchase(summary) {
    if (summary.violation.type === PromotionViolation.ONE_MORE) {
      return this.#handleOneMoreViolation(summary);
    }

    return this.#handleOutOfStockViolation(summary);
  }

  async #handleOneMoreViolation(summary) {
    const yesOrNo = await this.#std.yesOrNo(
      `\n현재 ${summary.name}은(는) ${summary.violation.quantity}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`
    );

    if (yesOrNo === 'Y') {
      return this.#confirmAfterUpdatePayment(summary, 1);
    }

    return this.#confirmPlan(summary);
  }

  async #handleOutOfStockViolation(summary) {
    const yesOrNo = await this.#std.yesOrNo(
      `\n현재 ${summary.name} ${summary.violation.quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`
    );
    if (yesOrNo === 'Y') {
      return this.#confirmPlan(summary);
    }

    return this.#confirmAfterUpdatePayment(
      summary,
      -summary.violation.quantity
    );
  }

  #confirmPlan(summary) {
    return {
      name: summary.name,
      price: summary.price,
      quantity: summary.quantity,
      requestedQuantity: summary.requestedQuantity,
      freebieCount: summary.freebieCount,
    };
  }

  #confirmAfterUpdatePayment(summary, quantityIncrement) {
    const sumOfCurrentSummary =
      summary.quantity.regular + summary.quantity.promotional;
    const updatedSummary = this.#paymentPlanner.createPaymentSummary(
      summary.name,
      sumOfCurrentSummary + quantityIncrement
    );
    return {
      name: updatedSummary.name,
      price: updatedSummary.price,
      quantity: updatedSummary.quantity,
      requestedQuantity: updatedSummary.requestedQuantity,
      freebieCount: updatedSummary.freebieCount,
    };
  }

  async #checkoutStep(confirmedPlans) {
    const shouldDiscount = await this.#shouldDiscount();

    const result = this.#cashier.checkout(confirmedPlans, shouldDiscount);

    for (const plan of confirmedPlans) {
      this.#shelf.tryFetchGoods(
        plan.name,
        plan.quantity.regular,
        plan.quantity.promotional
      );
    }

    return result;
  }

  async #shouldDiscount() {
    const yesOrNo = await this.#std.yesOrNo(
      '\n멤버십 할인을 받으시겠습니까? (Y/N)\n'
    );

    return yesOrNo === 'Y';
  }

  async #endStep(receipt) {
    this.#std.write(`\n${receipt.toString()}`);

    const yesOrNo = await this.#std.yesOrNo(
      '감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)\n'
    );
    this.#std.write('\n');
    const shouldEnd = yesOrNo === 'N';

    return shouldEnd;
  }
}

export default ConvenienceStore;
