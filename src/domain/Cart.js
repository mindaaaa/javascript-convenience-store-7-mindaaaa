class Cart {
  #items;

  constructor(userInput) {
    if (typeof userInput !== 'string' || !userInput.length) {
      throw new Error(
        '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.'
      );
    }

    this.#items = this.#tryParseToList(userInput);
  }

  #tryParseToList(userInput) {
    const regex =
      /^\[([가-힣a-zA-Z0-9]+)-([1-9]\d*)](,\[([가-힣a-zA-Z0-9]+)-([1-9]\d*)])*$/;
    if (!regex.test(userInput)) {
      throw new Error(
        '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.'
      );
    }

    const parsedList = userInput
      .trim()
      .split(',')
      .map((e) => {
        const [name, quantity] = e.trim().slice(1, -1).split('-');

        return { name, quantity: Number(quantity) };
      });

    if (parsedList.length !== new Set(parsedList.map((e) => e.name)).size) {
      throw new Error(
        '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.'
      );
    }

    return parsedList;
  }

  get goods() {
    return this.#items;
  }
}

export default Cart;
