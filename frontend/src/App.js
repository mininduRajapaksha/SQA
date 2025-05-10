import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Adduser from './components/Adduser';
import Login from './components/Login';
import CustomerDashboard from './components/CustomerDashboard';
import BusinessDashboard from './components/BusinessDashboard';
import AddItems from './components/AddItems';
import ItemDetails from './components/ItemDetails';
import UpdateItem from './components/UpdateItem';
import CustomerItemDetails from './components/CustomerItemDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './components/Cart';
import Profile from './components/Profile';
import RatingComponent from './components/RatingComponent';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/h" element={<Header />} />
          <Route path="/adduser" element={<Adduser />} />
          <Route path="/" element={<Login />} />
          <Route path="/add-item" element={<AddItems />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/business-dashboard" element={<BusinessDashboard />} />    
          <Route path="/item/edit/:id" element={<UpdateItem />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile/>}/>

          <Route path="/item/:id" element={
    <ProtectedRoute>
      {({ user }) => (
        user.role === 'businessman' ? <ItemDetails /> : <CustomerItemDetails />
      )}
    </ProtectedRoute>
  } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
