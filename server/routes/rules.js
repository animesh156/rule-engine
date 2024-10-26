const express = require('express');
const Rule = require('../model/ruleModel');
const mongoose = require('mongoose');
const router = express.Router();

const { tokenize, parse, evaluateAST } = require('../utils/ruleUtil');

// Create Rule Route: Accepts a rule string and saves it with an auto-generated name
router.post('/create', async (req, res) => {
  try {
    const { ruleString } = req.body;

    // Tokenize and parse the rule string into an AST
    const tokens = tokenize(ruleString);
    const ast = parse(tokens);

    // Find the current number of rules to determine the next rule name
    const ruleCount = await Rule.countDocuments();
    const ruleName = `Rule ${ruleCount + 1}`; // e.g., "Rule 1", "Rule 2", etc.

    // Save the AST to MongoDB with the generated name
    const rule = new Rule({ name: ruleName, ast });
    await rule.save();

    res.status(201).json({ message: 'Rule created successfully', rule });
  } catch (error) {
    res.status(500).json({ error: 'Error creating rule' });
  }
});

// Evaluate Rule Route: Retrieves a rule by name and evaluates it
router.post('/evaluate', async (req, res) => {
  try {
    const { id, inputData } = req.body;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid rule ID' });
    }

    // Find the rule by ID
    const rule = await Rule.findById(id);
    if (!rule) return res.status(404).json({ error: 'Rule not found' });

    // Evaluate the AST with the given input data
    const result = evaluateAST(rule.ast, inputData);

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: 'Error evaluating rule' });
  }
});

// combine two rules by their id
router.post('/combine', async (req, res) => {
  try {
    const { id1, id2, operator } = req.body;

    // Validate both ObjectIds
    if (!mongoose.Types.ObjectId.isValid(id1) || !mongoose.Types.ObjectId.isValid(id2)) {
      return res.status(400).json({ error: 'Invalid rule IDs' });
    }

    // Fetch both rules from the database
    const [rule1, rule2] = await Promise.all([
      Rule.findById(id1),
      Rule.findById(id2)
    ]);

    if (!rule1 || !rule2) {
      return res.status(404).json({ error: 'One or both rules not found' });
    }

     const ruleCount = await Rule.countDocuments();
    const ruleName = `Rule ${ruleCount + 1}`

    // Combine the ASTs using the specified operator (AND / OR)
    const combinedAST = {
      type: 'LogicalExpression',
      operator: operator.toUpperCase(), // Use 'AND' or 'OR'
      left: rule1.ast,
      right: rule2.ast,
    };

    // Save the new combined rule to the database
    const newRule = new Rule({name: ruleName, ast: combinedAST });
    await newRule.save();

    res.status(201).json({
      message: 'Rules combined successfully',
      rule: newRule,
    });
  } catch (error) {
    console.error('Error combining rules:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



const convertASTToString = (ast) => {
  if (!ast) return '';

  switch (ast.type) {
    case 'BinaryExpression':
      return `${ast.left.name || convertASTToString(ast.left)} ${ast.operator} ${ast.right.value}`;
    case 'LogicalExpression':
      return `(${convertASTToString(ast.left)} ${ast.operator} ${convertASTToString(ast.right)})`;
    case 'Identifier':
      return ast.name;
    case 'Literal':
      return ast.value;
    default:
      return '';
  }
};

router.get('/rules', async (req, res) => {
  try {
    const rules = await Rule.find({}); // Fetch all rules
     console.log(rules)
    const formattedRules = rules.map((rule) => ({
      name: rule.name,
      id: rule._id,
      ruleString: convertASTToString(rule.ast),
    }));

    res.status(200).json({ rules: formattedRules });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching rules' });
  }
});


module.exports = router;
