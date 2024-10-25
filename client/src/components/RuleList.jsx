// RuleList.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const RuleList = () => {
  const [rules, setRules] = useState([]);
  const [error, setError] = useState('');
  const [loading,setLoading] = useState(true)
  const navigate = useNavigate();


  // Fetch all rules when the component mounts
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get('https://rule-engine-backend-ivory.vercel.app/rules');
        setRules(response.data.rules); // Store rules in state
        setLoading(false)
      } catch (err) {
        console.error(err);
        setError('Error fetching rules');
        setLoading(false)
      }
    };

    fetchRules();
  }, []);

  if(loading === true) return <span className="loading loading-spinner text-warning  w-28"></span>

  return (
    <div>
      <h2 className="text-3xl text-red-500 mt-8 font-semibold mb-4">All Rules</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul className="overflow-y-scroll h-80 ml-5">
        {rules.map((rule,index) => (
          <li key={index} className="mb-3 border rounded-3xl border-red-500">
            <p className="text font-bold">{rule.name}</p>
            <p className="text-md  font-bold text-gray-600">{rule.ruleString}</p>
          </li>
        ))}
      </ul>

      <button type="button" onClick={() => navigate('/')} className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mt-4 mb-2">Home</button>
    </div>
  );
};

export default RuleList;
