import { useAuth } from '../../contexts/AuthContext';
import { Bell, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
    if (notificacoesAbertas) setNotificacoesAbertas(false);
  };

  const toggleNotificacoes = () => {
    setNotificacoesAbertas(!notificacoesAbertas);
    if (menuAberto) setMenuAberto(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed left-0 right-0 top-0 z-10 md:left-64">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center justify-start">
          <button
            onClick={toggleMenu}
            className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:bg-gray-100"
          >
            {menuAberto ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="ml-2 md:ml-0">
            <span className="text-xl font-semibold">
              {usuario?.perfil === 'aluno' && 'Portal do Aluno'}
              {usuario?.perfil === 'professor' && 'Portal do Professor'}
              {usuario?.perfil === 'admin' && 'Painel Administrativo'}
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <div className="relative mx-2">
            <button
              onClick={toggleNotificacoes}
              className="p-2 text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none"
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                3
              </span>
            </button>

            {notificacoesAbertas && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                <div className="px-4 py-2 font-medium border-b border-gray-200">
                  Notificações
                </div>
                
                <div className="max-h-60 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-medium">Nova questão disponível</p>
                    <p className="text-xs text-gray-500">Há 5 minutos</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-medium">Parabéns! Você subiu de nível</p>
                    <p className="text-xs text-gray-500">Há 2 horas</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50">
                    <p className="text-sm font-medium">Novo simulado disponível</p>
                    <p className="text-xs text-gray-500">Há 1 dia</p>
                  </div>
                </div>

                <div className="px-4 py-2 text-center text-sm text-blue-600 font-medium border-t border-gray-200">
                  Ver todas as notificações
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="flex items-center text-sm rounded-full focus:ring-4 focus:ring-gray-200"
            >
              <img
                className="w-8 h-8 rounded-full"
                src={usuario?.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario?.nome || '')}&background=1E3A8A&color=fff`}
                alt="Avatar do usuário"
              />
              <span className="ml-2 hidden md:inline-block font-medium">{usuario?.nome}</span>
            </button>

            {menuAberto && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                <div className="px-4 py-2 text-sm text-gray-900 border-b border-gray-200">
                  <div className="font-medium">{usuario?.nome}</div>
                  <div className="text-xs text-gray-500 truncate">{usuario?.email}</div>
                </div>
                
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                  <div className="flex items-center mb-1">
                    <div className="font-medium">Nível {usuario?.nivel || 1}</div>
                    <div className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      {usuario?.pontos || 0} pts
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                
                <a href="/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Meu Perfil
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Configurações
                </a>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;