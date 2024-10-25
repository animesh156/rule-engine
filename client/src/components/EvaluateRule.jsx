// EvaluateRule.js
import  { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const EvaluateRule = () => {
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState('');
  const [inputData, setInputData] = useState({
    age: '',
    department: '',
    salary: '',
    experience: '',
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch existing rules
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get('https://rule-engine-backend-ivory.vercel.app/?vercelToolbarCode=e_rj4GRmUXsRQwL/rules');
        setRules(response.data.rules);
      } catch (err) {
        console.error(err);
        setError('Error fetching rules');
      }
    };

    fetchRules();
  }, []);

  // Handle rule selection
  const handleRuleChange = (event) => {
    setSelectedRule(event.target.value);
  };

  // Handle input data change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle evaluation
  const handleEvaluate = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://rule-engine-backend-ivory.vercel.app/?vercelToolbarCode=e_rj4GRmUXsRQwL/evaluate', {
        id: selectedRule, // Send the selected rule ID
        inputData, // Send the input data
      });
      setResult(response.data.result); 

      setInputData({
        age: '',
        department: '',
        salary: '',
        experience: '',
      });
      setSelectedRule(''); 
      // Assuming your backend returns a result field
    } catch (err) {
      console.error(err);
      setError('Error evaluating rule');
    }
  };

  const handleCreateRule = (e) => {
    e.preventDefault(); 
    navigate('/'); 
  };

  return (
    <div>
      <h2 className='text-3xl text-red-500 mt-8 font-semibold mb-4'>Evaluate Rule</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div className='mt-2 mb-4'>
       
        <select value={selectedRule}  onChange={handleRuleChange} className="select select-success w-full max-w-xs">
          <option selected >Select a rule</option>
          {rules.map((rule) => (
            <option key={rule._id} value={rule._id}>
              {rule.name}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleEvaluate}>
        <div>
        
        

<input
  type="number"
 placeholder='age'
    name="age"
    value={inputData.age}
    onChange={handleInputChange}
    required
  className="input input-bordered input-success w-full max-w-xs" />


         
        </div>
        <div>
       
         

<input
  type="text"
 placeholder='department'
    name="department"
    value={inputData.department}
    onChange={handleInputChange}
    required
  className="input input-bordered input-success w-full max-w-xs mt-3" />


        </div>
        <div>
         
         
<input
  type="number"
  name="salary"
  placeholder='salary'
  value={inputData.salary}
  onChange={handleInputChange}
  required
  className="input input-bordered input-success w-full max-w-xs mt-3" />

        </div>


        <div>
       
          


<input
 type="number"
 name="experience"
 value={inputData.experience}
 onChange={handleInputChange}
 placeholder='experience'
  required
  className="input input-bordered input-success w-full max-w-xs mt-3 mb-3" />

          
        </div>
<div>

<button className="btn btn-accent mt-3 mr-3" type="submit">Evaluate</button>

<button className="btn btn-accent mt-3"onClick={handleCreateRule} >Home</button>

</div>
      
      
      </form>

      {result !== null && <p className='text-3xl text-green-500 font-bold mt-2'>Evaluation Result: {JSON.stringify(result)}</p>}
    </div>
  );
};

export default EvaluateRule;
