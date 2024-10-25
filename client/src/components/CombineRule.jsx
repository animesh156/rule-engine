// CombineRule.js
import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CombineRule = () => {
  const [rules, setRules] = useState([]);
  const [id1, setId1] = useState('');
  const [id2, setId2] = useState('');
  const [operator, setOperator] = useState('OR');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRules = async () => {
      const response = await axios.get('https://rule-engine-backend-ivory.vercel.app/rules'); // Assuming this endpoint returns all rules
      setRules(response.data.rules);
    };
    fetchRules();
  }, []);

  const handleCombineRules = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('https://rule-engine-backend-ivory.vercel.app/combine', { id1, id2, operator });
      setMessage(response.data.message);

      navigate('/evaluate')

    } catch (error) {
      setMessage('Error combining rules',error);
    }
  };

  return (
    <div>
      <h2 className='text-3xl text-red-500 font-bold mb-5'>Combine Rules</h2>
      <form onSubmit={handleCombineRules} className='flex flex-col items-center'>
        <select value={id1} onChange={(e) => setId1(e.target.value)} required className="select select-secondary w-full max-w-xs mb-2">
          
          <option disabled selected>Select Rule 1</option>
          {rules.map(rule => (
            <option key={rule._id} value={rule._id}>{rule.name}</option>
          ))}
        </select>
        <select value={id2} onChange={(e) => setId2(e.target.value)} required className="select select-secondary w-full max-w-xs mb-2">
          <option disabled selected>Select Rule 2</option>
          {rules.map(rule => (
            <option key={rule._id} value={rule._id}>{rule.name}</option>
          ))}
        </select>
        <select value={operator} onChange={(e) => setOperator(e.target.value)} className="select select-secondary w-full max-w-xs mb-2">
          <option value="OR">OR</option>
          <option value="AND">AND</option>
        </select>
        <div>

        <button type="submit"  className="btn btn-accent mt-3 mr-3">Combine Rules</button>
        <button onClick={() => navigate('/')}  className="btn btn-accent mt-3">Home</button>

        </div>
      
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CombineRule;
