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
    const file = readFileSync(filePath, 'utf8');
    const lines = file.split('\n').filter((e) => e);

    const [headers, ...restRows] = lines.map((line) => {
      return line.split(',').map((value) => value.trim());
    });

    const parsedData = restRows.map((values) => {
      return headers.reduce((obj, header, index) => {
        const currStrategy = Strategy[header];

        obj[header] = currStrategy(values[index]);

        return obj;
      }, {});
    });

    return parsedData;
  }
}

export default new MdFileReader();
