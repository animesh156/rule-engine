const express = require("express");
const router = express.Router();
const Rule = require('../model/ruleModel');

// AST Node Class
class Node {
  constructor(type, left = null, right = null, value = null) {
    this.type = type;
    this.left = left;
    this.right = right;
    this.value = value;
  }
}

// Helper to Parse Rule String into AST
const parseRule = (ruleString) => {
  const tokens = ruleString.match(/\w+|[<>=!]+|AND|OR|\(|\)/g);
  let index = 0;

  const parseExpression = () => {
    let node = parseTerm();
    while (tokens[index] === "AND" || tokens[index] === "OR") {
      const operator = tokens[index++];
      const right = parseTerm();
      node = new Node("operator", node, right, operator);
    }
    return node;
  };

  const parseTerm = () => {
    if (tokens[index] === "(") {
      index++;
      const node = parseExpression();
      index++;
      return node;
    }
    const left = tokens[index++];
    const operator = tokens[index++];
    const right = tokens[index++];
    return new Node("operand", null, null, { left, operator, right });
  };

  return parseExpression();
};

// Create Rule API
router.post("/create", async (req, res) => {
  try {
    const { ruleString } = req.body;
    const ast = parseRule(ruleString);
    const savedRule = await Rule.create(ast);
    res.status(201).json(savedRule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Evaluate Rule API
const evaluateNode = (node, data) => {
  if (node.type === "operand") {
    const { left, operator, right } = node.value;
    switch (operator) {
      case ">":
        return data[left] > right;
      case "<":
        return data[left] < right;
      case ">=":
        return data[left] >= right;
      case "<=":
        return data[left] <= right;
      case "==":
        return data[left] == right;
      case "!=":
        return data[left] != right;
    }
  } else if (node.type === "operator") {
    const leftEval = evaluateNode(node.left, data);
    const rightEval = evaluateNode(node.right, data);
    return node.value === "AND" ? leftEval && rightEval : leftEval || rightEval;
  }
};

router.post("/evaluate", async (req, res) => {
  try {
    const { ruleId, data } = req.body;
    const rule = await Rule.findById(ruleId);
    const result = evaluateNode(rule, data);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
