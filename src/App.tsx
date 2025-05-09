import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import RecuperarSenha from './pages/RecuperarSenha';
import Layout from './components/layout/Layout';
import DashboardAluno from './pages/aluno/Dashboard';
import BancoQuestoes from './pages/aluno/BancoQuestoes';
import Simulados from './pages/aluno/Simulados';
import RealizarSimulado from './pages/aluno/RealizarSimulado';
import Estatisticas from './pages/aluno/Estatisticas';
import PerfilAluno from './pages/aluno/Perfil';
import DashboardProfessor from './pages/professor/Dashboard';
import GerenciarQuestoes from './pages/professor/GerenciarQuestoes';
import DashboardAdmin from './pages/admin/Dashboard';
import GerenciarUsuarios from './pages/admin/GerenciarUsuarios';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          
          {/* Rotas do Aluno */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['aluno', 'professor', 'admin']}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardAluno />} />
            <Route path="banco-questoes" element={<BancoQuestoes />} />
            <Route path="simulados" element={<Simulados />} />
            <Route path="simulados/:id" element={<RealizarSimulado />} />
            <Route path="estatisticas" element={<Estatisticas />} />
            <Route path="perfil" element={<PerfilAluno />} />
          </Route>

          {/* Rotas do Professor */}
          <Route 
            path="/professor" 
            element={
              <ProtectedRoute allowedRoles={['professor', 'admin']}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardProfessor />} />
            <Route path="questoes" element={<GerenciarQuestoes />} />
          </Route>

          {/* Rotas do Admin */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardAdmin />} />
            <Route path="usuarios" element={<GerenciarUsuarios />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;