// CreateRule.js
import  { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateRule = () => {
  const [ruleString, setRuleString] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleCreateRule = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5500/create', { ruleString });
      setMessage(response.data.message);
      setRuleString('');
    } catch (error) {
      setMessage('Error creating rule',error);
    }
  };

  const handleEvaluate = () => {
   
    navigate('/evaluate'); // Navigate to the evaluate route
  };

  const handleCombine = () => {
    navigate('/combine')
  }

  return (
    <div>
      <h2 className='text-3xl font-semibold text-red-500 mt-8 mb-5'>Create Rule</h2>
      <form onSubmit={handleCreateRule} className='flex flex-col items-center mt-9'>
         <textarea
          value={ruleString}
        
         
         className="textarea textarea-secondary textarea-bordered textarea-lg w-full max-w-xs"
          onChange={(e) => setRuleString(e.target.value)}
          placeholder="Enter rule string"
          required
        /> 
 
        <div >
        <button type="submit" className="text-white  mr-4 bg-gradient-to-r w-28 mt-6 from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-2 py-2.5 text-center  mb-2">Create Rule</button>

      
        </div>


       
      </form>

      <div className='mt-5'>

      <button  onClick={handleEvaluate} className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Evaluate Rule</button>

      <button  onClick={handleCombine} className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Combine Rules</button>

      <button type="button" onClick={() => navigate('/rules')} className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">View Rules</button>

      </div>

   
   
      
 
     {message && <p className='text-3xl text-red-500'>{message}</p>}
    </div>
  );
};

export default CreateRule;
