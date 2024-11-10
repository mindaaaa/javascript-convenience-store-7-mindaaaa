import { Console } from '@woowacourse/mission-utils';
import { MESSAGES } from '../utils/constants.js';
import Validator from '../validation/Validator.js';

class InputHandler {
  async askPurchaseInput() {
    // TODO: 객체 배열로 parse하는 코드 만들기
    try {
      const userInput = await Console.readLineAsync(
        '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])'
      );
      return Validator.validatePurchaseInput(userInput);
    } catch (error) {
      Console.print(error.message);
      return this.askPurchaseInput();
    }
  }

  async askForConfirmation(type, productName, quantity) {
    const message = this.#getMessage(type, productName, quantity);

    try {
      const userInput = await Console.readLineAsync(message);
      return Validator.parseYesNoResponse(userInput);
    } catch (error) {
      Console.print(error.message);
      return this.askForConfirmation(type, productName, quantity);
    }
  }

  #getMessage(type, productName, quantity) {
    let message;

    if (typeof MESSAGES[type] === 'function') {
      message = MESSAGES[type](productName, quantity);
    }

    if (message === undefined) {
      message = MESSAGES[type];
    }

    return message;
  }
}

export default new InputHandler();
