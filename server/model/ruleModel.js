const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  name: String,
  ast: Object,  // Store the AST as JSON
});

module.exports = mongoose.model('Rule', ruleSchema);
