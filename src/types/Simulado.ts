import { Questao } from './Questao';

export interface RespostaUsuario {
  questaoId: string;
  alternativaId?: string;
  textoResposta?: string;
  correta: boolean;
  tempoResposta?: number;
}

export interface SimuladoConfig {
  id: string;
  titulo: string;
  descricao: string;
  disciplinas: string[];
  quantidadeQuestoes: number;
  tempoLimite: number; // em minutos
  dificuldade: 'facil' | 'media' | 'dificil' | 'misto';
  autorId?: string;
  dataPublicacao: string;
  publico: boolean;
}

export interface Simulado extends SimuladoConfig {
  questoes: Questao[];
}

export interface ResultadoSimulado {
  id: string;
  simuladoId: string;
  usuarioId: string;
  dataRealizacao: string;
  tempoTotal: number;
  acertos: number;
  respostas: RespostaUsuario[];
  finalizado: boolean;
  pontos: number;
}