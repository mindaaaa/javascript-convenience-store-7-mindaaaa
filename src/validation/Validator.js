class Validator {
  validatePurchaseInput(userInput) {
    const pattern = /^\[(\w+)-(\d+)\](,\s*\[(\w+)-(\d+)\])*$/;

    if (!pattern.test(userInput.trim())) {
      throw new Error(
        '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.'
      );
    }
  }

  validateYesNoInput(response) {
    const userInput = response.trim().toLowerCase();
    if (userInput !== 'y' && userInput !== 'n') {
      throw new Error(
        '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.'
      );
    }
  }
}
export default new Validator();
