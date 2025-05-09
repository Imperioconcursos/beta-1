import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { simuladosService } from '../../services/simuladosService';
import { Simulado } from '../../types/Simulado';
import { Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const RealizarSimulado = () => {
  const { id } = useParams();
  const [simulado, setSimulado] = useState<Simulado | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [tempoRestante, setTempoRestante] = useState<number>(0);
  const [questaoAtual, setQuestaoAtual] = useState(0);

  useEffect(() => {
    const carregarSimulado = async () => {
      if (!id) return;
      
      try {
        setCarregando(true);
        const dados = await simuladosService.obterSimuladoPorId(id);
        setSimulado(dados);
        setTempoRestante(dados.tempoLimite * 60); // Convertendo minutos para segundos
      } catch (error) {
        console.error('Erro ao carregar simulado:', error);
        toast.error('Erro ao carregar o simulado');
      } finally {
        setCarregando(false);
      }
    };

    carregarSimulado();
  }, [id]);

  useEffect(() => {
    if (!simulado || tempoRestante <= 0) return;

    const timer = setInterval(() => {
      setTempoRestante((tempo) => {
        if (tempo <= 1) {
          clearInterval(timer);
          finalizarSimulado();
          return 0;
        }
        return tempo - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [simulado, tempoRestante]);

  const formatarTempo = (segundos: number): string => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segsRestantes = segundos % 60;

    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segsRestantes.toString().padStart(2, '0')}`;
  };

  const responderQuestao = (questaoId: string, alternativaId: string) => {
    setRespostas((prev) => ({
      ...prev,
      [questaoId]: alternativaId
    }));
  };

  const proximaQuestao = () => {
    if (simulado && questaoAtual < simulado.questoes.length - 1) {
      setQuestaoAtual(questaoAtual + 1);
    }
  };

  const questaoAnterior = () => {
    if (questaoAtual > 0) {
      setQuestaoAtual(questaoAtual - 1);
    }
  };

  const finalizarSimulado = async () => {
    if (!simulado || !id) return;

    try {
      // Aqui você implementaria a lógica para salvar as respostas
      toast.success('Simulado finalizado com sucesso!');
    } catch (error) {
      console.error('Erro ao finalizar simulado:', error);
      toast.error('Erro ao finalizar o simulado');
    }
  };

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!simulado) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Simulado não encontrado</h2>
        <p className="text-gray-600">O simulado que você está procurando não existe ou foi removido.</p>
      </div>
    );
  }

  const questaoAtualObj = simulado.questoes[questaoAtual];

  return (
    <div className="mt-16 md:mt-20 p-4">
      {/* Cabeçalho do Simulado */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{simulado.titulo}</h1>
            <p className="text-gray-600">{simulado.descricao}</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center bg-blue-50 px-4 py-2 rounded-lg">
            <Clock size={20} className="text-blue-600 mr-2" />
            <span className="font-mono text-lg font-semibold text-blue-600">
              {formatarTempo(tempoRestante)}
            </span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Questão {questaoAtual + 1} de {simulado.questoes.length}
          </span>
          <span className="text-sm text-gray-600">
            {Object.keys(respostas).length} respondidas
          </span>
        </div>
        
        {/* Barra de progresso */}
        <div className="mt-2 h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${(Object.keys(respostas).length / simulado.questoes.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Questão Atual */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              {questaoAtualObj.disciplina}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
              {questaoAtualObj.topico}
            </span>
          </div>
          
          <p className="text-lg text-gray-800 mb-4">{questaoAtualObj.enunciado}</p>
          
          {questaoAtualObj.fonte && (
            <p className="text-sm text-gray-500 italic">
              Fonte: {questaoAtualObj.fonte}
              {questaoAtualObj.ano && ` (${questaoAtualObj.ano})`}
              {questaoAtualObj.banca && ` - ${questaoAtualObj.banca}`}
            </p>
          )}
        </div>

        {/* Alternativas */}
        <div className="space-y-3">
          {questaoAtualObj.alternativas.map((alternativa) => (
            <div
              key={alternativa.id}
              onClick={() => responderQuestao(questaoAtualObj.id, alternativa.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                respostas[questaoAtualObj.id] === alternativa.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${
                  respostas[questaoAtualObj.id] === alternativa.id
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300'
                }`}>
                  {alternativa.id}
                </div>
                <p className="text-gray-800">{alternativa.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navegação */}
      <div className="flex justify-between items-center">
        <button
          onClick={questaoAnterior}
          disabled={questaoAtual === 0}
          className={`px-4 py-2 rounded-md ${
            questaoAtual === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Anterior
        </button>

        {questaoAtual === simulado.questoes.length - 1 ? (
          <button
            onClick={finalizarSimulado}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Finalizar Simulado
          </button>
        ) : (
          <button
            onClick={proximaQuestao}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Próxima
          </button>
        )}
      </div>
    </div>
  );
};

export default RealizarSimulado;