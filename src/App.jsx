import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Contactanos from './pages/Contactanos';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<><Navbar /><Dashboard /><Footer /></>} />
        <Route path="/contactanos" element={<><Navbar /><Contactanos /><Footer /></>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
