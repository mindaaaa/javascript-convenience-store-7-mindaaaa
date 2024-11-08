import { readFileSync } from 'fs';

export default function parseToObjectArray(filePath) {
  const file = readFileSync(filePath, 'utf8');
  const lines = file.split('\n').filter((line) => line.includes(','));

  const headers = lines[0].split(',').map((header) => header.trim());

  const parsedData = lines.slice(1).map((line) => {
    const values = line.split(',').map((value) => value.trim());

    return headers.reduce((obj, header, index) => {
      let value = values[index];

      if (header === 'price' || header === 'quantity') {
        value = Number(value);
      }

      obj[header] = value;
      return obj;
    }, {});
  });

  return parsedData;
}
