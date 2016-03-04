import fs from 'fs';
import path from 'path';
import lodash from 'lodash';

function generateBigJson() {
  return new Promise((resolve, reject) => {
    const file = path.resolve(__dirname, './big.js');
    const pairs = lodash.times(100000, index => [String(index), Math.random()]);
    const json = lodash.fromPairs(pairs);
    const content = `module.exports = ${JSON.stringify(json, null, 2)}`;
    fs.writeFile(file, content, error => error ? reject(error) : resolve());
  });
}

generateBigJson();
