// import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Adduser from './components/Adduser';
import Login from './components/Login';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
      <Header/>
      <Adduser/>
      {/* <Login/> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
