
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateRule from './components/CreateRule';
import CombineRule from './components/CombineRule';
import EvaluateRule from './components/EvaluateRule';
import RuleList from './components/RuleList'

const App = () => {
  return (
    <Router>
      <div>
        <h1 className='text-5xl font-bold text-sky-500 mb-4'>Rule Engine</h1>
        <Routes>
          <Route path="/" element={<CreateRule />} />
          <Route path="/combine" element={<CombineRule />} />
          <Route path="/evaluate" element={<EvaluateRule />} />
          <Route path="/rules" element={<RuleList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
