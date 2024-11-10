import { Console } from '@woowacourse/mission-utils';

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
          throw new Error('[ERROR] 잘못된 입력입니다. 다시 입력해 주세요.');
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
