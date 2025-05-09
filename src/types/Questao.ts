export interface Alternativa {
  id: string;
  texto: string;
  correta: boolean;
}

export interface Questao {
  id: string;
  enunciado: string;
  disciplina: string;
  topico: string;
  dificuldade: 'facil' | 'media' | 'dificil';
  tipo: 'multipla_escolha' | 'verdadeiro_falso' | 'dissertativa';
  alternativas: Alternativa[];
  explicacao: string;
  autorId: string;
  dataPublicacao: string;
  aprovada: boolean;
  fonte?: string;
  ano?: number;
  banca?: string;
}