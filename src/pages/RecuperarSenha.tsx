import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  
  const { recuperarSenha } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Por favor, informe seu email');
      return;
    }
    
    try {
      setEnviando(true);
      await recuperarSenha(email);
      setEnviado(true);
      toast.success('Email de recuperação enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar email de recuperação:', error);
      toast.error('Falha ao enviar email de recuperação. Verifique o endereço informado.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">Império Concursos</h1>
          <p className="text-gray-600 mt-2">Recuperação de senha</p>
        </div>

        {!enviado ? (
          <>
            <p className="text-gray-600 mb-6">
              Digite o email associado à sua conta. Enviaremos um link para você redefinir sua senha.
            </p>

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

              <button
                type="submit"
                disabled={enviando}
                className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {enviando ? (
                  <div className="h-5 w-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Mail size={18} className="mr-2" />
                    Enviar Email de Recuperação
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center bg-green-100 text-green-800 rounded-full w-16 h-16 mb-4">
              <Mail size={32} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Email enviado!
            </h2>
            <p className="text-gray-600 mb-6">
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha. O link é válido por 24 horas.
            </p>
            <button
              onClick={() => setEnviado(false)}
              className="text-blue-600 hover:underline flex items-center justify-center mx-auto"
            >
              <ArrowLeft size={16} className="mr-1" />
              Voltar para recuperação
            </button>
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Lembrou sua senha?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              Voltar para login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecuperarSenha;