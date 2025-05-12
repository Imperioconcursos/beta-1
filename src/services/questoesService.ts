import { supabase } from '../lib/supabase';
import { Questao } from '../types/Questao';

export const questoesService = {
  listarQuestoes: async (filtros?: Partial<Questao>): Promise<Questao[]> => {
    let query = supabase
      .from('questions')
      .select(
        'id, statement, discipline, topic, difficulty, type, alternatives (id, text, is_correct), explanation, author_id, created_at, approved, source, year, board'
      )
      .eq('approved', true);

    // Aplicando filtros
    if (filtros?.disciplina) query = query.eq('discipline', filtros.disciplina);
    if (filtros?.dificuldade) query = query.eq('difficulty', filtros.dificuldade);
    if (filtros?.tipo) query = query.eq('type', filtros.tipo);
    if (filtros?.ano) query = query.eq('year', filtros.ano);
    if (filtros?.banca) query = query.eq('board', filtros.banca);
    if (filtros?.assunto) query = query.eq('topic', filtros.assunto);

    const { data, error } = await query;

    // Log para depuração
    console.log("Dados retornados:", data);

    if (error) {
      console.error('Erro ao listar questões:', error);
      throw error;
    }

    return data.map((q: any) => ({
      id: q.id,
      enunciado: q.statement,
      disciplina: q.discipline,
      topico: q.topic,
      dificuldade: q.difficulty,
      tipo: q.type,
      alternativas: q.alternatives.map((a: any) => ({
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
      .select(
        'id, statement, discipline, topic, difficulty, type, alternatives (id, text, is_correct), explanation, author_id, created_at, approved, source, year, board'
      )
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
      alternativas: data.alternatives.map((a: any) => ({
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
  },

  salvarProgresso: async (userId: string, respostas: { questionId: string; answer: string; isCorrect: boolean }[]) => {
    const promises = respostas.map(async (resposta) => {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          question_id: resposta.questionId,
          answer: resposta.answer,
          is_correct: resposta.isCorrect,
          created_at: new Date()
        });

      if (error) {
        console.error('Erro ao salvar progresso:', error);
        throw error;
      }
    });

    await Promise.all(promises);
  },

  obterDesempenhoUsuario: async (userId: string) => {
    const { data: progressData, error } = await supabase
      .from('user_progress')
      .select('is_correct')
      .eq('user_id', userId);

    if (error) {
      console.error('Erro ao obter desempenho:', error);
      throw error;
    }

    const totalQuestoes = progressData.length;
    const acertos = progressData.filter(p => p.is_correct).length;
    const taxaAcertos = totalQuestoes > 0 ? (acertos / totalQuestoes) * 100 : 0;

    return {
      totalQuestoes,
      taxaAcertos
    };
  }
};
