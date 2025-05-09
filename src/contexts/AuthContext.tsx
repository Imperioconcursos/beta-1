import React, { createContext, useState, useEffect, useContext } from 'react';
import { Usuario } from '../types/Usuario';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  usuario: Usuario | null;
  carregando: boolean;
  erro: string | null;
  login: (email: string, senha: string) => Promise<void>;
  cadastro: (dados: Omit<Usuario, 'id'>) => Promise<void>;
  recuperarSenha: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        setCarregando(true);
        const usuarioSalvo = localStorage.getItem('imperio_usuario');
        
        if (usuarioSalvo) {
          const usuarioParsed = JSON.parse(usuarioSalvo);
          setUsuario(usuarioParsed);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        setErro('Falha ao iniciar sessão');
      } finally {
        setCarregando(false);
      }
    };

    carregarUsuario();
  }, []);

  const login = async (email: string, senha: string) => {
    setCarregando(true);
    setErro(null);
    
    try {
      const usuarioLogado = await authService.login(email, senha);
      localStorage.setItem('imperio_usuario', JSON.stringify(usuarioLogado));
      setUsuario(usuarioLogado);
    } catch (error) {
      console.error('Erro de login:', error);
      setErro('Email ou senha inválidos');
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  const cadastro = async (dados: Omit<Usuario, 'id'>) => {
    setCarregando(true);
    setErro(null);
    
    try {
      await authService.cadastro(dados);
    } catch (error) {
      console.error('Erro de cadastro:', error);
      setErro('Falha ao criar conta');
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  const recuperarSenha = async (email: string) => {
    setCarregando(true);
    setErro(null);
    
    try {
      await authService.recuperarSenha(email);
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      setErro('Falha ao recuperar senha');
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('imperio_usuario');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        usuario, 
        carregando, 
        erro, 
        login, 
        cadastro, 
        recuperarSenha, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};