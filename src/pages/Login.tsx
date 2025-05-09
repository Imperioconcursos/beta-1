import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [enviando, setEnviando] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (emailLogin: string, senhaLogin: string) => {
    if (!emailLogin || !senhaLogin) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    try {
      setEnviando(true);
      const result = await login(emailLogin, senhaLogin);
      
      // Default redirect path
      let redirectPath = '/dashboard';
      
      // Only try to access perfil if result exists and has the property
      if (result && typeof result === 'object' && 'perfil' in result) {
        if (result.perfil === 'professor') {
          redirectPath = '/professor';
        } else if (result.perfil === 'admin') {
          redirectPath = '/admin';
        }
      } else {
        console.warn('Login successful but user profile not found, using default redirect');
      }
      
      // Use the stored location if available, otherwise use the determined path
      const from = location.state?.from?.pathname || redirectPath;
      navigate(from, { replace: true });
      
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error('Email ou senha inválidos');
    } finally {
      setEnviando(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(email, senha);
  };

  const loginRapido = async (tipo: 'aluno' | 'professor' | 'admin') => {
    let emailLogin = '';
    const senhaLogin = 'senha123';
    
    switch (tipo) {
      case 'aluno':
        emailLogin = 'aluno@exemplo.com';
        break;
      case 'professor':
        emailLogin = 'professor@exemplo.com';
        break;
      case 'admin':
        emailLogin = 'admin@exemplo.com';
        break;
    }
    
    setEmail(emailLogin);
    setSenha(senhaLogin);
    
    await handleLogin(emailLogin, senhaLogin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">Império Concursos</h1>
          <p className="text-gray-600 mt-2">Acesse sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="seu@email.com"
              disabled={enviando}
            />
          </div>

          <div>
            <label htmlFor="senha" className="text-sm font-medium text-gray-700 block mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Sua senha"
                disabled={enviando}
              />
              <button
                type="button"
                className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="lembrar"
                type="checkbox"
                className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="lembrar" className="ml-2 block text-sm text-gray-700">
                Lembrar
              </label>
            </div>
            <Link to="/recuperar-senha" className="text-sm text-blue-600 hover:underline">
              Esqueceu a senha?
            </Link>
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {enviando ? (
              <div className="h-5 w-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn size={18} className="mr-2" />
                Entrar
              </>
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Demo - Entrar como</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => loginRapido('aluno')}
              disabled={enviando}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-blue-600 hover:bg-gray-50"
            >
              Aluno
            </button>
            <button
              type="button"
              onClick={() => loginRapido('professor')}
              disabled={enviando}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-green-600 hover:bg-gray-50"
            >
              Professor
            </button>
            <button
              type="button"
              onClick={() => loginRapido('admin')}
              disabled={enviando}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-purple-600 hover:bg-gray-50"
            >
              Admin
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="font-medium text-blue-600 hover:underline">
              Crie sua conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;