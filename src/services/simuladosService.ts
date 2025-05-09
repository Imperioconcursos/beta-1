import { supabase } from '../lib/supabase';
import { SimuladoConfig, Simulado, ResultadoSimulado } from '../types/Simulado';

export const simuladosService = {
  listarSimulados: async (): Promise<SimuladoConfig[]> => {
    const { data, error } = await supabase
      .from('simulations')
      .select('*')
      .eq('is_public', true);

    if (error) {
      console.error('Erro ao listar simulados:', error);
      throw error;
    }

    return data.map(s => ({
      id: s.id,
      titulo: s.title,
      descricao: s.description,
      disciplinas: s.disciplines,
      quantidadeQuestoes: s.question_count,
      tempoLimite: s.time_limit,
      dificuldade: s.difficulty,
      autorId: s.author_id,
      dataPublicacao: s.created_at,
      publico: s.is_public
    }));
  },

  obterSimuladoPorId: async (id: string): Promise<Simulado> => {
    const { data: simulado, error: simuladoError } = await supabase
      .from('simulations')
      .select(`
        *,
        simulation_questions (
          question_id,
          order,
          questions (
            *,
            alternatives (*)
          )
        )
      `)
      .eq('id', id)
      .single();

    if (simuladoError) {
      console.error('Erro ao obter simulado:', simuladoError);
      throw simuladoError;
    }

    const questoes = simulado.simulation_questions
      .sort((a, b) => a.order - b.order)
      .map(sq => ({
        id: sq.questions.id,
        enunciado: sq.questions.statement,
        disciplina: sq.questions.discipline,
        topico: sq.questions.topic,
        dificuldade: sq.questions.difficulty,
        tipo: sq.questions.type,
        alternativas: sq.questions.alternatives.map(a => ({
          id: a.id,
          texto: a.text,
          correta: a.is_correct
        })),
        explicacao: sq.questions.explanation,
        autorId: sq.questions.author_id,
        dataPublicacao: sq.questions.created_at,
        aprovada: sq.questions.approved,
        fonte: sq.questions.source,
        ano: sq.questions.year,
        banca: sq.questions.board
      }));

    return {
      id: simulado.id,
      titulo: simulado.title,
      descricao: simulado.description,
      disciplinas: simulado.disciplines,
      quantidadeQuestoes: simulado.question_count,
      tempoLimite: simulado.time_limit,
      dificuldade: simulado.difficulty,
      autorId: simulado.author_id,
      dataPublicacao: simulado.created_at,
      publico: simulado.is_public,
      questoes
    };
  },

  obterResultados: async (usuarioId: string): Promise<ResultadoSimulado[]> => {
    const { data, error } = await supabase
      .from('simulation_results')
      .select(`
        *,
        simulations (
          title,
          description
        ),
        user_answers (
          *,
          questions (
            statement
          )
        )
      `)
      .eq('user_id', usuarioId);

    if (error) {
      console.error('Erro ao obter resultados:', error);
      throw error;
    }

    return data.map(r => ({
      id: r.id,
      simuladoId: r.simulation_id,
      usuarioId: r.user_id,
      dataRealizacao: r.started_at,
      tempoTotal: r.time_taken,
      acertos: r.correct_answers,
      respostas: r.user_answers.map(ua => ({
        questaoId: ua.question_id,
        alternativaId: ua.selected_alternative_id,
        correta: ua.is_correct,
        tempoResposta: ua.time_taken
      })),
      finalizado: !!r.finished_at,
      pontos: r.score
    }));
  }
};