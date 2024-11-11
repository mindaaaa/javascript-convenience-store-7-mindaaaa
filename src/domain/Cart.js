import { ERROR_MESSAGES, SETTINGS } from '../utils/constants.js';

class Cart {
  #items;

  constructor(userInput) {
    if (typeof userInput !== 'string' || !userInput.length) {
      throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
    }

    this.#items = this.#tryParseToList(userInput);
  }

  #tryParseToList(userInput) {
    const regex = SETTINGS.PRODUCT_QUANTITY_INPUT_PATTERN;
    if (!regex.test(userInput)) {
      throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
    }

    const parsedList = userInput
      .trim()
      .split(',')
      .map((e) => {
        const [name, quantity] = e
          .trim()
          .slice(1, -1)
          .split(SETTINGS.PRODUCT_QUANTITY_SEPARATOR);

        return { name, quantity: Number(quantity) };
      });

    if (parsedList.length !== new Set(parsedList.map((e) => e.name)).size) {
      throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
    }

    return parsedList;
  }

  get goods() {
    return this.#items;
  }
}

export default Cart;
