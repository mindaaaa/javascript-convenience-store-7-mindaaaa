import MdParser from './utils/MdParser.js';
import ConvenienceStore from './controller/ConvenienceStore.js';
import StandardIO from './views/StandardIO.js';
import Shelves from './domain/Shelves.js';
import Checkout from './services/Checkout.js';

class App {
  async run() {
    const products = MdParser.read('./public/products.md');
    const promotions = MdParser.read('./public/promotions.md');

    const shelves = new Shelves(products, promotions);
    const checkoutManager = new Checkout(shelves);
    const store = new ConvenienceStore(shelves, StandardIO, checkoutManager);

    while (true) {
      const shouldEnd = await store.run();
      if (shouldEnd) {
        break;
      }
    }
  }
}

export default App;
