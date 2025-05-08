import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Adduser from './components/Adduser';
import Login from './components/Login';
import CustomerDashboard from './components/CustomerDashboard';
import BusinessDashboard from './components/BusinessDashboard';
import AddItems from './components/AddItems';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/h" element={<Header />} />
          <Route path="/adduser" element={<Adduser />} />
          <Route path="/" element={<Login />} />
          <Route path="/additems" element={<AddItems />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/business-dashboard" element={<BusinessDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
