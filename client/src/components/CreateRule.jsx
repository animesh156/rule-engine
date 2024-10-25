// CreateRule.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateRule = () => {
  const [ruleString, setRuleString] = useState('');
  const [message, setMessage] = useState('');
 
  const navigate = useNavigate();

  // Validate rule input format (simple validation example)
  const validateRule = (rule) => {
    // Example: Check for missing operators or incorrect format
    const operators = ['>', '<', '=', 'AND', 'OR'];
    const hasValidOperator = operators.some((op) => rule.includes(op));

    if (!hasValidOperator) {
      return 'Invalid rule: Must contain at least one valid operator (e.g., >, <, =, AND, OR).';
    }
    if (!/[a-zA-Z]+\s*[><=]\s*\d+/.test(rule)) {
      return 'Invalid rule: Ensure the format is like "age > 30" or "salary = 50000".';
    }
    return null; // Valid rule
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();

    // Validate rule string before sending it to the server
    const validationError = validateRule(ruleString);
    if (validationError) {
      window.alert(validationError);
      setMessage('');
    
      setRuleString('');
     
      return;
      
    }

    try {
      const response = await axios.post('https://rule-engine-backend-ivory.vercel.app/?vercelToolbarCode=e_rj4GRmUXsRQwL/create', { ruleString });
      setMessage(response.data.message);
    
      setRuleString('');
    } catch (err) {
      console.error(err);
      
    }
  };

  const handleEvaluate = () => navigate('/evaluate');
  const handleCombine = () => navigate('/combine');

  return (
    <div>
      <h2 className="text-3xl font-semibold text-red-500 mt-8 mb-5">Create Rule</h2>

      <form onSubmit={handleCreateRule} className="flex flex-col items-center mt-9">
        <textarea
          value={ruleString}
          onChange={(e) => setRuleString(e.target.value)}
          className="textarea textarea-secondary textarea-bordered textarea-lg w-full max-w-xs"
          placeholder="Enter rule string"
          required
        />

        <div>
          <button
            type="submit"
            className="text-white mr-4 bg-gradient-to-r w-28 mt-6 from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-2 py-2.5 text-center mb-2"
          >
            Create Rule
          </button>
        </div>
      </form>

      <div className="mt-5">
        <button
          onClick={handleEvaluate}
          className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Evaluate Rule
        </button>

        <button
          onClick={handleCombine}
          className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Combine Rules
        </button>

        <button
          type="button"
          onClick={() => navigate('/rules')}
          className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          View Rules
        </button>
      </div>

     
      {message && <p className="text-green-500 mt-4">{message}</p>}
    </div>
  );
};

export default CreateRule;
