import * as acorn from 'acorn';
import coffee from 'coffee-script';

export default content =>
  acorn.parse(coffee.compile(content), { sourceType: 'module' });
