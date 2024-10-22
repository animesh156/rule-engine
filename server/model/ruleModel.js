const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  type: String, // 'operator' or 'operand'
  left: mongoose.Schema.Types.Mixed, // Reference to child nodes
  right: mongoose.Schema.Types.Mixed,
  value: mongoose.Schema.Types.Mixed, // Comparison value (for operands)
});

const Rule = mongoose.model('Rule', nodeSchema);
module.exports = Rule;
