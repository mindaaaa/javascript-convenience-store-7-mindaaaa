import mdParser from './utils/mdParser.js';
class App {
  async run() {
    console.log(mdParser('public/products.md'));
  }
}

export default App;
