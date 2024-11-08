class Receipt {
  constructor(purchaseItems, freeItems, paymentDetails) {
    this.purchaseItems = purchaseItems;
    this.freeItems = freeItems;
    this.paymentDetails = paymentDetails;
  }
  getPurchaseItems() {
    return this.purchaseItems.map(({ name, quantity, price }) => ({
      name,
      quantity,
      price,
    }));
  }
  getFreeItems() {
    return this.freeItems.map(({ name, quantity }) => ({ name, quantity }));
  }
  getPaymentSummary() {
    const totalItemCount =
      this.purchaseItems.reduce((sum, item) => sum + item.quantity, 0) +
      this.freeItems.reduce((sum, item) => sum + item.quantity, 0);

    const { totalAmount, eventDiscount, membershipDiscount, finalAmount } =
      this.paymentDetails;
    return [
      { label: '총구매액', count: totalItemCount, value: totalAmount },
      { label: '행사할인', value: -eventDiscount },
      { label: '멤버십할인', value: -membershipDiscount },
      { label: '내실돈', value: finalAmount },
    ];
  }
}

export default Receipt();
