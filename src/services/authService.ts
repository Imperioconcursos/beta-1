import { Usuario } from '../types/Usuario';

// Dados mock para simulação
const usuariosMock: Usuario[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'aluno@exemplo.com',
    perfil: 'aluno',
    dataCadastro: '2023-01-15',
    pontos: 1250,
    nivel: 5
  },
  {
    id: '2',
    nome: 'Maria Oliveira',
    email: 'professor@exemplo.com',
    perfil: 'professor',
    dataCadastro: '2022-11-20',
  },
  {
    id: '3',
    nome: 'Carlos Administrador',
    email: 'admin@exemplo.com',
    perfil: 'admin',
    dataCadastro: '2022-10-05',
  }
];

// Para simular atrasos de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (email: string, senha: string): Promise<Usuario> => {
    // Simulando validação e delay de API
    await delay(1000);
    
    const usuario = usuariosMock.find(u => u.email === email);
    
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }
    
    // Em uma implementação real, verificaríamos a senha aqui
    
    return { 
      ...usuario, 
      ultimoAcesso: new Date().toISOString() 
    };
  },
  
  cadastro: async (dados: Omit<Usuario, 'id'>): Promise<void> => {
    // Simulando delay de API
    await delay(1000);
    
    const emailExistente = usuariosMock.some(u => u.email === dados.email);
    
    if (emailExistente) {
      throw new Error('E-mail já cadastrado');
    }
    
    // Simulando sucesso (em uma implementação real, salvaríamos no banco de dados)
    console.log('Usuário cadastrado:', dados);
  },
  
  recuperarSenha: async (email: string): Promise<void> => {
    // Simulando delay de API
    await delay(1000);
    
    const usuario = usuariosMock.find(u => u.email === email);
    
    if (!usuario) {
      throw new Error('E-mail não encontrado');
    }
    
    // Simulando envio de e-mail (em uma implementação real, enviaríamos um e-mail)
    console.log('Link de recuperação enviado para:', email);
  }
};