class NoneStrategy {
  get name() {
    return 'NoneStratege';
  }

  execute() {
    return { quantity: 0, violation: null, freebieCount: 0 };
  }
}

export default new NoneStrategy();
