import './App.css'
import Signin from './assets/components/Signin'
import Signup from './assets/components/Signup'
import AdminSignin from './assets/components/AdminSignin';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { StudentDashboard } from './assets/components/StudentDashboard';
import AdminPortal from './assets/components/AdminPortal';
import PortalHome from './assets/components/PortalHome';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Signin" element={<Signin />} />
        <Route path="/" element={<PortalHome />} />
        <Route path="/AdminSignin" element={<AdminSignin />} />
        <Route path='/AdminPortal/*' element={<AdminPortal/>}/>
        <Route path="/StudentDashboard/*" element={<StudentDashboard/>}/>
      </Routes>
    </Router>
  );
  
}

export default App;
