import { supabase } from '../lib/supabase';
import { Questao } from '../types/Questao';

export const questoesService = {
  listarQuestoes: async (filtros?: Partial<Questao>): Promise<Questao[]> => {
    let query = supabase
      .from('questions')
      .select(`
        *,
        alternatives (
          id,
          text,
          is_correct,
          order
        )
      `)
      .eq('approved', true);

    if (filtros?.disciplina) {
      query = query.eq('discipline', filtros.disciplina);
    }
    if (filtros?.dificuldade) {
      query = query.eq('difficulty', filtros.dificuldade);
    }
    if (filtros?.tipo) {
      query = query.eq('type', filtros.tipo);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao listar questões:', error);
      throw error;
    }

    return data.map(q => ({
      id: q.id,
      enunciado: q.statement,
      disciplina: q.discipline,
      topico: q.topic,
      dificuldade: q.difficulty,
      tipo: q.type,
      alternativas: q.alternatives.map(a => ({
        id: a.id,
        texto: a.text,
        correta: a.is_correct
      })),
      explicacao: q.explanation,
      autorId: q.author_id,
      dataPublicacao: q.created_at,
      aprovada: q.approved,
      fonte: q.source,
      ano: q.year,
      banca: q.board
    }));
  },

  obterQuestaoPorId: async (id: string): Promise<Questao | null> => {
    const { data, error } = await supabase
      .from('questions')
      .select(`
        *,
        alternatives (
          id,
          text,
          is_correct,
          order
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao obter questão:', error);
      throw error;
    }

    if (!data) return null;

    return {
      id: data.id,
      enunciado: data.statement,
      disciplina: data.discipline,
      topico: data.topic,
      dificuldade: data.difficulty,
      tipo: data.type,
      alternativas: data.alternatives.map(a => ({
        id: a.id,
        texto: a.text,
        correta: a.is_correct
      })),
      explicacao: data.explanation,
      autorId: data.author_id,
      dataPublicacao: data.created_at,
      aprovada: data.approved,
      fonte: data.source,
      ano: data.year,
      banca: data.board
    };
  }
};