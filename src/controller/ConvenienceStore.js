import { PromotionViolation, MESSAGES } from '../utils/constants.js';
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
    const greeting = [MESSAGES.GREETING, this.#shelf.toString(), ''].join('\n');
    this.#std.write(greeting);
    return this.#std.readLine(MESSAGES.PROMPT_PRODUCT_INPUT);
  }

  async #selectGoodsStep(goodsInput) {
    let currentInput = goodsInput;
    while (true) {
      try {
        const shoppingCart = new Cart(currentInput);
        return this.#paymentPlanner.createPaymentPlan(shoppingCart);
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
      MESSAGES.PROMPT_ONE_MORE(summary.name, summary.violation.quantity)
    );

    if (yesOrNo === 'Y') {
      return this.#confirmAfterUpdatePayment(summary, 1);
    }

    return this.#confirmPlan(summary);
  }

  async #handleOutOfStockViolation(summary) {
    const yesOrNo = await this.#std.yesOrNo(
      MESSAGES.PROMPT_OUT_OF_STOCK(summary.name, summary.violation.quantity)
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
      MESSAGES.PROMPT_MEMBERSHIP_DISCOUNT
    );

    return yesOrNo === 'Y';
  }

  async #endStep(receipt) {
    this.#std.write(`\n${receipt.toString()}`);

    const yesOrNo = await this.#std.yesOrNo(MESSAGES.THANK_YOU_MESSAGE);
    this.#std.write('\n');
    const shouldEnd = yesOrNo === 'N';

    return shouldEnd;
  }
}

export default ConvenienceStore;
