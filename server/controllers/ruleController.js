const Rule= require('../model/ruleModel')
const { parseRule } = require('../utils/parser');


async function createRule(req, res) {
  try {
    const ruleString = req.body.rule;

    // Validate rule string before parsing
    if (!ruleString || typeof ruleString !== 'string') {
      return res.status(400).json({ message: 'Invalid rule string' });
    }

    const rootNode = parseRule(ruleString); // Convert string to AST

    const savedNode = await RuleModel.create(rootNode); // Store in DB
    res.status(201).json({ message: 'Rule created successfully', ruleId: savedNode._id });
  } catch (error) {
    console.error('Error creating rule:', error);
    res.status(500).json({ message: 'Error creating rule', error: error.message || error });
  }
}


  async function combineRules (req, res)  {
    const { ruleIds, operator } = req.body;
  
    try {
      const rules = await NodeModel.find({ _id: { $in: ruleIds } });
  
      let combinedAST = rules.reduce((acc, rule) => {
        return new Node('operator', acc, rule, operator);
      });
  
      const savedNode = await NodeModel.create(combinedAST);
      res.status(201).json({ message: 'Rules combined successfully', ruleId: savedNode._id });
    } catch (error) {
      res.status(500).json({ message: 'Error combining rules', error });
    }
  };


  const evaluateNode = (node, data) => {
    if (node.type === 'operand') {
      const { key, operator, value } = node.value;
      const userValue = data[key];
  
      switch (operator) {
        case '>': return userValue > value;
        case '<': return userValue < value;
        case '=': return userValue === value;
        default: return false;
      }
    } else if (node.type === 'operator') {
      const leftResult = evaluateNode(node.left, data);
      const rightResult = evaluateNode(node.right, data);
  
      if (node.value === 'AND') return leftResult && rightResult;
      if (node.value === 'OR') return leftResult || rightResult;
    }
    return false;
  };
  
  async function evaluateRule(req, res) {
    try {
      const { ruleId, userData } = req.body;
      const rule = await NodeModel.findById(ruleId).populate(['left', 'right']);
      const result = evaluateNode(rule, userData);
  
      res.status(200).json({ eligible: result });
    } catch (error) {
      res.status(500).json({ message: 'Error evaluating rule', error });
    }
  }


 
  



  module.exports = {
    createRule,
    combineRules,
    evaluateRule
  };