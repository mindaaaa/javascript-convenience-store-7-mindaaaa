import { ERROR_MESSAGES, SETTINGS } from '../utils/constants.js';

class Cart {
  #items;

  constructor(userInput) {
    this.#validateUserInputFormat(userInput);
    const parsedList = this.#parseInputToList(userInput);

    this.#items = this.#removeDuplicateItems(parsedList);
  }

  #validateUserInputFormat(userInput) {
    if (typeof userInput !== 'string' || !userInput.length) {
      throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
    }

    if (!SETTINGS.PRODUCT_QUANTITY_INPUT_PATTERN.test(userInput)) {
      throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
    }
  }

  #parseInputToList(userInput) {
    return userInput
      .trim()
      .split(',')
      .map((e) => this.#parseSingleItem(e.trim()));
  }

  #parseSingleItem(item) {
    const [name, quantity] = item
      .slice(1, -1)
      .split(SETTINGS.PRODUCT_QUANTITY_SEPARATOR);

    return { name, quantity: Number(quantity) };
  }

  #removeDuplicateItems(parseList) {
    const uniqueNames = new Set();
    const result = [];

    for (const item of parseList) {
      if (uniqueNames.has(item.name)) {
        throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
      }
      uniqueNames.add(item.name);
      result.push(item);
    }
    return result;
  }

  get goods() {
    return this.#items;
  }
}

export default Cart;
