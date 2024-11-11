import { readFileSync } from 'fs';

const Strategy = {
  name: (_value) => _value,
  price: (_value) => Number(_value),
  quantity: (_value) => Number(_value),
  promotion: (_value) => {
    if (_value === 'null') {
      return null;
    }
    return _value;
  },
  buy: (_value) => Number(_value),
  get: (_value) => Number(_value),
  start_date: (_value) => new Date(_value),
  end_date: (_value) => new Date(_value),
};

class MdFileReader {
  read(filePath) {
    const file = this.#readFile(filePath);
    const [headers, ...rows] = this.#parseLines(file);

    return this.#parseRows(headers, rows);
  }

  #readFile(filePath) {
    return readFileSync(filePath, 'utf8');
  }

  #parseLines(file) {
    const lines = file.split('\n').filter((line) => line);
    return lines.map((line) => line.split(',').map((value) => value.trim()));
  }

  #parseRows(headers, rows) {
    return rows.map((values) => this.#mapRowToHeaders(headers, values));
  }

  #mapRowToHeaders(headers, values) {
    return headers.reduce((obj, header, index) => {
      obj[header] = this.#applyStrategy(header, values[index]);
      return obj;
    }, {});
  }

  #applyStrategy(header, value) {
    const strategy = Strategy[header];
    if (strategy) {
      return strategy(value);
    }
    return value;
  }
}

export default new MdFileReader();
