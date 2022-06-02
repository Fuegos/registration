import { Routes, Route } from 'react-router-dom';
import Registration from './components/auth/Registration';
import Login from './components/auth/Login'
import Users from './components/Users'
import './index.css'

const App = () => {
    return (
      <div className="App">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/users" element={<Users />} />
            </Routes>
      </div>
    );
  };
  
export default App;