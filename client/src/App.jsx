import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Bem-vindo ao GradeMatcher!</div>} />
        {/* Adicione mais rotas aqui */}
      </Routes>
    </Router>
  );
}

export default App;
