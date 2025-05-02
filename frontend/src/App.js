<<<<<<< HEAD
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
=======
import './App.css';
import Header from './Components/Header';

function App() {
  return (
    <div className="App">
     <Header/>
    </div>
>>>>>>> f059af4d7b6b0e74327c9c5a8871d7b3f776c66a
  );
}

export default App;
