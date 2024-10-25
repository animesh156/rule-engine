// Tokenizer: Splits the input string into meaningful tokens
function tokenize(input) {
  const regex = /\s*(=>|AND|OR|\(|\)|[><=!]=?|[\w\d']+)\s*/g;
  return input.match(regex).map(token => token.trim());
}

// Parser: Converts tokens into an AST
function parse(tokens) {
  let index = 0;

  function parseExpression() {
    let node = parsePrimary();

    while (tokens[index] === 'AND' || tokens[index] === 'OR') {
      const operator = tokens[index++];
      const rightNode = parsePrimary();
      node = {
        type: 'LogicalExpression',
        operator: operator,
        left: node,
        right: rightNode,
      };
    }
    return node;
  }

  function parsePrimary() {
    if (tokens[index] === '(') {
      index++;
      const node = parseExpression();
      index++;
      return node;
    } else {
      return parseBinaryExpression();
    }
  }

  function parseBinaryExpression() {
    const left = { type: 'Identifier', name: tokens[index++] };
    const operator = tokens[index++];
    const rightValue = tokens[index++];
    const right = isNaN(rightValue)
      ? { type: 'Literal', value: rightValue.replace(/'/g, '') }
      : { type: 'Literal', value: Number(rightValue) };

    return { type: 'BinaryExpression', operator, left, right };
  }

  return parseExpression();
}

// Evaluator: Evaluates the AST based on input context
function evaluateAST(node, inputData) {
  switch (node.type) {
    case 'LogicalExpression': {
      const leftResult = evaluateAST(node.left, inputData);
      const rightResult = evaluateAST(node.right, inputData);

      if (node.operator === 'AND') {
        return leftResult && rightResult;
      } else if (node.operator === 'OR') {
        return leftResult || rightResult;
      }
      break;
    }
    case 'BinaryExpression': {
      const leftValue = inputData[node.left.name];
      const rightValue = node.right.value;

      switch (node.operator) {
        case '>':
          return leftValue > rightValue;
        case '<':
          return leftValue < rightValue;
        case '=':
          return leftValue === rightValue;
        default:
          throw new Error(`Unsupported operator: ${node.operator}`);
      }
    }
    default:
      throw new Error(`Unsupported node type: ${node.type}`);
  }
}

function evaluateBinaryExpression(node, context) {
  const leftValue = context[node.left.name];
  const rightValue = node.right.value;

  switch (node.operator) {
    case '>':
      return leftValue > rightValue;
    case '<':
      return leftValue < rightValue;
    case '>=':
      return leftValue >= rightValue;
    case '<=':
      return leftValue <= rightValue;
    case '=':
    case '==':
      return leftValue === rightValue;
    case '!=':
      return leftValue !== rightValue;
    default:
      throw new Error(`Unknown operator: ${node.operator}`);
  }
}

module.exports = { tokenize, parse, evaluateAST };
