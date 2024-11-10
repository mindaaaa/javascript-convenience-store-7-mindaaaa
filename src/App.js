import MdParser from './utils/MdParser';

class App {
  async run() {
    const products = MdParser.read('../public/products.md');
    const promotions = MdParser.read('../public/promotions.md');
  }
}

export default App;
