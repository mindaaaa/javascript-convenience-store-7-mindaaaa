import { Console } from '@woowacourse/mission-utils';
import Receipt from '../domain/Receipt.js';

class OutputHandler {
  printReceipt() {
    Console.print('==============W 편의점================');

    Console.print('상품명\t\t수량\t금액');
    Receipt.getPurchaseItems().forEach(({ name, quantity, price }) => {
      Console.print(`${name}\t\t${quantity}\t${price}`);
    });

    Console.print('=============증\t정===============');
    Receipt.getFreeItems().forEach(({ name, quantity }) => {
      Console.print(`${name}\t\t${quantity}`);
    });

    Console.print('====================================');

    Receipt.getPaymentSummary().forEach(({ label, count, value }) => {
      Console.print(`${label}\t\t${count}\t${value}`);
    });
  }
}
