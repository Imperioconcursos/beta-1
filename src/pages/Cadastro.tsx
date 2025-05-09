import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [perfil, setPerfil] = useState<'aluno' | 'professor'>('aluno');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [enviando, setEnviando] = useState(false);
  
  const { cadastro } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !email || !senha || !confirmarSenha) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    if (senha !== confirmarSenha) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    try {
      setEnviando(true);
      
      await cadastro({
        nome,
        email,
        perfil,
        dataCadastro: new Date().toISOString()
      });
      
      toast.success('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      toast.error('Falha ao criar conta. Por favor, tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">Império Concursos</h1>
          <p className="text-gray-600 mt-2">Crie sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="nome" className="text-sm font-medium text-gray-700 block mb-2">
              Nome completo
            </label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Seu nome completo"
              disabled={enviando}
            />
          </div>

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
                placeholder="Crie uma senha forte"
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
            <p className="text-xs text-gray-500 mt-1">
              Use pelo menos 8 caracteres com letras e números
            </p>
          </div>

          <div>
            <label htmlFor="confirmarSenha" className="text-sm font-medium text-gray-700 block mb-2">
              Confirmar senha
            </label>
            <input
              type="password"
              id="confirmarSenha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Repita sua senha"
              disabled={enviando}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Você é:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setPerfil('aluno')}
                className={`border rounded-lg p-3 cursor-pointer ${
                  perfil === 'aluno'
                    ? 'border-blue-600 bg-blue-50 text-blue-800'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">Aluno</div>
                <div className="text-sm text-gray-600">
                  Estou me preparando para concursos
                </div>
              </div>
              <div
                onClick={() => setPerfil('professor')}
                className={`border rounded-lg p-3 cursor-pointer ${
                  perfil === 'professor'
                    ? 'border-green-600 bg-green-50 text-green-800'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">Professor</div>
                <div className="text-sm text-gray-600">
                  Quero criar questões e simulados
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="termos"
              type="checkbox"
              className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="termos" className="ml-2 block text-sm text-gray-700">
              Concordo com os <a href="#" className="text-blue-600 hover:underline">Termos de Uso</a> e a <a href="#" className="text-blue-600 hover:underline">Política de Privacidade</a>
            </label>
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
                <UserPlus size={18} className="mr-2" />
                Criar Conta
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;