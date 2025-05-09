export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: 'aluno' | 'professor' | 'admin';
  foto?: string;
  dataCadastro: string;
  ultimoAcesso?: string;
  pontos?: number;
  nivel?: number;
}