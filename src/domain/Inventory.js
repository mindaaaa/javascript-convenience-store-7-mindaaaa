import Promotion from './Promotion.js';
import { PromotionViolation } from '../utils/constants';

class Inventory {
  #name;
  #price;
  #quantity;
  #promotion;

  constructor(data, promotion) {
    const { name = '', price = 0, quantity = 0 } = data;
    this.#name = name;
    this.#price = price;
    this.#quantity = quantity;

    this.#promotion = new Promotion(promotion);
  }
}

export default Inventory;
