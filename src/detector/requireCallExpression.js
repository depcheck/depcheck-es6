function isValidType(type) {
  return type === 'CallExpression'
      || type === 'NewExpression';
}

export default node =>
  isValidType(node.type) &&
  node.callee &&
  node.callee.type === 'Identifier' &&
  node.callee.name === 'require' &&
  node.arguments[0] &&
  typeof node.arguments[0].value === 'string'
  ? [node.arguments[0].value]
  : [];
