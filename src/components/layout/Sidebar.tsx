import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from './Logo';
import { 
  Home, BookOpen, ClipboardCheck, BarChart2, UserCircle,
  Users, Settings, Award, HelpCircle, Layers
} from 'lucide-react';

const Sidebar = () => {
  const { usuario } = useAuth();
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setMenuAberto(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setMenuAberto(false);
    }
  }, [location]);

  const navLinkClasses = (isActive: boolean) => 
    `flex items-center p-2 text-base font-medium rounded-lg ${
      isActive 
        ? 'bg-blue-100 text-blue-700' 
        : 'text-gray-900 hover:bg-gray-100'
    }`;

  const getNavLinks = () => {
    const perfil = usuario?.perfil || 'aluno';
    
    if (perfil === 'admin') {
      return [
        { to: '/admin', icon: <Home size={20} />, text: 'Dashboard' },
        { to: '/admin/usuarios', icon: <Users size={20} />, text: 'Usuários' },
        { to: '/admin/questoes', icon: <BookOpen size={20} />, text: 'Banco de Questões' },
        { to: '/admin/simulados', icon: <ClipboardCheck size={20} />, text: 'Simulados' },
        { to: '/admin/estatisticas', icon: <BarChart2 size={20} />, text: 'Estatísticas' },
        { to: '/admin/configuracoes', icon: <Settings size={20} />, text: 'Configurações' }
      ];
    } else if (perfil === 'professor') {
      return [
        { to: '/professor', icon: <Home size={20} />, text: 'Dashboard' },
        { to: '/professor/questoes', icon: <BookOpen size={20} />, text: 'Minhas Questões' },
        { to: '/professor/simulados', icon: <ClipboardCheck size={20} />, text: 'Meus Simulados' },
        { to: '/professor/alunos', icon: <Users size={20} />, text: 'Alunos' },
        { to: '/professor/perfil', icon: <UserCircle size={20} />, text: 'Meu Perfil' }
      ];
    } else {
      return [
        { to: '/dashboard', icon: <Home size={20} />, text: 'Dashboard' },
        { to: '/dashboard/banco-questoes', icon: <BookOpen size={20} />, text: 'Banco de Questões' },
        { to: '/dashboard/simulados', icon: <ClipboardCheck size={20} />, text: 'Simulados' },
        { to: '/dashboard/estatisticas', icon: <BarChart2 size={20} />, text: 'Meu Desempenho' },
        { to: '/dashboard/conquistas', icon: <Award size={20} />, text: 'Conquistas' },
        { to: '/dashboard/perfil', icon: <UserCircle size={20} />, text: 'Meu Perfil' }
      ];
    }
  };

  return (
    <>
      {menuAberto && window.innerWidth < 768 && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20"
          onClick={() => setMenuAberto(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-30 w-64 h-screen transition-transform bg-white border-r border-gray-200 ${
          menuAberto ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="flex items-center justify-center mb-5 p-2">
            <Logo />
          </div>

          <ul className="space-y-2">
            {getNavLinks().map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => navLinkClasses(isActive)}
                  end={link.to === '/dashboard' || link.to === '/admin' || link.to === '/professor'}
                >
                  {link.icon}
                  <span className="ml-3">{link.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="pt-5 mt-5 space-y-2 border-t border-gray-200">
            <a
              href="#"
              className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <HelpCircle size={20} />
              <span className="ml-3">Ajuda</span>
            </a>
            <a
              href="#"
              className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <Layers size={20} />
              <span className="ml-3">Planos</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;