import { Console } from '@woowacourse/mission-utils';
import { ERROR_MESSAGES } from '../utils/constants.js';

class StandardIO {
  write(output) {
    Console.print(output);
  }

  readLine(guideMessage) {
    return Console.readLineAsync(guideMessage);
  }

  async yesOrNo(guideMessage) {
    let answer = await this.readLine(guideMessage);

    while (true) {
      try {
        if (answer !== 'N' && answer !== 'Y') {
          throw new Error(ERROR_MESSAGES.INVALID_INPUT);
        }

        return answer;
      } catch (e) {
        this.write(e.message);
        answer = await this.readLine(`\n`);
      }
    }
  }
}

export default new StandardIO();
