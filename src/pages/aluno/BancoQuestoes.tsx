import { useState, useEffect } from 'react';
import { questoesService } from '../../services/questoesService';
import { Questao } from '../../types/Questao';
import { 
  Search, Filter, CheckCircle, XCircle, ArrowRight, 
  HelpCircle, RefreshCw, ChevronLeft, ChevronRight 
} from 'lucide-react';
import toast from 'react-hot-toast';

const BancoQuestoes = () => {
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [questaoAtual, setQuestaoAtual] = useState<Questao | null>(null);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [respostaUsuario, setRespostaUsuario] = useState<string | null>(null);
  const [mostrarResposta, setMostrarResposta] = useState(false);
  const [respostaCorreta, setRespostaCorreta] = useState<boolean | null>(null);
  
  // Estados para filtros
  const [disciplinaFiltro, setDisciplinaFiltro] = useState<string>('');
  const [dificuldadeFiltro, setDificuldadeFiltro] = useState<string>('');
  const [tipoFiltro, setTipoFiltro] = useState<string>('');
  const [textoBusca, setTextoBusca] = useState<string>('');
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  // Listas para filtros
  const disciplinas = ['Direito Constitucional', 'Direito Administrativo', 'Português', 'Conhecimentos Gerais'];
  const dificuldades = [
    { valor: 'easy', texto: 'Fácil' },
    { valor: 'medium', texto: 'Média' },
    { valor: 'hard', texto: 'Difícil' }
  ];
  const tipos = [
    { valor: 'multiple_choice', texto: 'Múltipla Escolha' },
    { valor: 'true_false', texto: 'Verdadeiro/Falso' },
    { valor: 'essay', texto: 'Dissertativa' }
  ];

  useEffect(() => {
    carregarQuestoes();
  }, [disciplinaFiltro, dificuldadeFiltro, tipoFiltro]);

  const carregarQuestoes = async () => {
    try {
      setCarregando(true);
      
      const filtros: Partial<Questao> = {};
      if (disciplinaFiltro) filtros.disciplina = disciplinaFiltro;
      if (dificuldadeFiltro) filtros.dificuldade = dificuldadeFiltro as any;
      if (tipoFiltro) filtros.tipo = tipoFiltro as any;
      
      const questoesData = await questoesService.listarQuestoes(filtros);
      
      // Filtragem adicional pelo texto de busca (cliente-side)
      const questoesFiltradas = textoBusca
        ? questoesData.filter(q => 
            q.enunciado.toLowerCase().includes(textoBusca.toLowerCase()) ||
            q.disciplina.toLowerCase().includes(textoBusca.toLowerCase()) ||
            q.topico.toLowerCase().includes(textoBusca.toLowerCase())
          )
        : questoesData;
      
      setQuestoes(questoesFiltradas);
      if (questoesFiltradas.length > 0) {
        setQuestaoAtual(questoesFiltradas[0]);
        setIndiceAtual(0);
      } else {
        setQuestaoAtual(null);
      }
      
      resetarEstadoQuestao();
    } catch (error) {
      console.error('Erro ao carregar questões:', error);
      toast.error('Erro ao carregar questões');
    } finally {
      setCarregando(false);
    }
  };

  const aplicarFiltros = () => {
    carregarQuestoes();
    setFiltrosAbertos(false);
  };

  const resetarFiltros = () => {
    setDisciplinaFiltro('');
    setDificuldadeFiltro('');
    setTipoFiltro('');
    setTextoBusca('');
    setFiltrosAbertos(false);
  };

  const buscarTexto = () => {
    carregarQuestoes();
  };

  const resetarEstadoQuestao = () => {
    setRespostaUsuario(null);
    setMostrarResposta(false);
    setRespostaCorreta(null);
  };

  const proximaQuestao = () => {
    if (indiceAtual < questoes.length - 1) {
      setIndiceAtual(indiceAtual + 1);
      setQuestaoAtual(questoes[indiceAtual + 1]);
      resetarEstadoQuestao();
    }
  };

  const questaoAnterior = () => {
    if (indiceAtual > 0) {
      setIndiceAtual(indiceAtual - 1);
      setQuestaoAtual(questoes[indiceAtual - 1]);
      resetarEstadoQuestao();
    }
  };

  const selecionarResposta = (alternativaId: string) => {
    if (mostrarResposta) return;
    
    setRespostaUsuario(alternativaId);
    
    if (questaoAtual) {
      const alternativaCorreta = questaoAtual.alternativas.find(a => a.correta);
      setRespostaCorreta(alternativaId === alternativaCorreta?.id);
    }
    
    setMostrarResposta(true);
  };

  const verificarResposta = () => {
    setMostrarResposta(true);
  };

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Banco de Questões</h1>
        <p className="text-gray-600">Pratique com questões de concursos anteriores</p>
      </div>
      
      {/* Barra de pesquisa e filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={textoBusca}
              onChange={(e) => setTextoBusca(e.target.value)}
              placeholder="Buscar questões..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={buscarTexto}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Buscar
            </button>
            
            <button
              onClick={() => setFiltrosAbertos(!filtrosAbertos)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors flex items-center"
            >
              <Filter size={18} className="mr-1" /> Filtros
            </button>
          </div>
        </div>
        
        {filtrosAbertos && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="disciplina" className="block text-sm font-medium text-gray-700 mb-1">
                  Disciplina
                </label>
                <select
                  id="disciplina"
                  value={disciplinaFiltro}
                  onChange={(e) => setDisciplinaFiltro(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todas as disciplinas</option>
                  {disciplinas.map((disc, idx) => (
                    <option key={idx} value={disc}>{disc}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="dificuldade" className="block text-sm font-medium text-gray-700 mb-1">
                  Dificuldade
                </label>
                <select
                  id="dificuldade"
                  value={dificuldadeFiltro}
                  onChange={(e) => setDificuldadeFiltro(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Qualquer dificuldade</option>
                  {dificuldades.map((dif, idx) => (
                    <option key={idx} value={dif.valor}>{dif.texto}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Questão
                </label>
                <select
                  id="tipo"
                  value={tipoFiltro}
                  onChange={(e) => setTipoFiltro(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos os tipos</option>
                  {tipos.map((tipo, idx) => (
                    <option key={idx} value={tipo.valor}>{tipo.texto}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={resetarFiltros}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                Limpar Filtros
              </button>
              <button
                onClick={aplicarFiltros}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Container da questão */}
      {questaoAtual ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Cabeçalho da questão */}
          <div className="bg-blue-600 p-4 text-white">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm opacity-80">
                  {questaoAtual.disciplina} • {questaoAtual.topico}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    questaoAtual.dificuldade === 'easy'
                      ? 'bg-green-200 text-green-800'
                      : questaoAtual.dificuldade === 'medium'
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-red-200 text-red-800'
                  }`}>
                    {questaoAtual.dificuldade === 'easy'
                      ? 'Fácil'
                      : questaoAtual.dificuldade === 'medium'
                        ? 'Média'
                        : 'Difícil'}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm">
                  Questão {indiceAtual + 1} de {questoes.length}
                </span>
              </div>
            </div>
          </div>
          
          {/* Corpo da questão */}
          <div className="p-6">
            <div className="mb-6">
              <p className="text-lg text-gray-800">{questaoAtual.enunciado}</p>
              {questaoAtual.fonte && (
                <p className="text-sm text-gray-500 mt-3">
                  Fonte: {questaoAtual.fonte}
                  {questaoAtual.ano && ` - ${questaoAtual.ano}`}
                  {questaoAtual.banca && ` | Banca: ${questaoAtual.banca}`}
                </p>
              )}
            </div>
            
            {/* Alternativas */}
            <div className="space-y-3">
              {questaoAtual.alternativas
                .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
                .map((alternativa, index) => (
                  <div
                    key={alternativa.id}
                    onClick={() => selecionarResposta(alternativa.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      respostaUsuario === alternativa.id && mostrarResposta
                        ? alternativa.correta
                          ? 'bg-green-50 border-green-300'
                          : 'bg-red-50 border-red-300'
                        : respostaUsuario === alternativa.id
                          ? 'bg-blue-50 border-blue-300'
                          : mostrarResposta && alternativa.correta
                            ? 'bg-green-50 border-green-300'
                            : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                        respostaUsuario === alternativa.id
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <p className="text-gray-800">{alternativa.texto}</p>
                      
                      {mostrarResposta && alternativa.correta && (
                        <CheckCircle size={18} className="ml-auto text-green-600" />
                      )}
                      {mostrarResposta && !alternativa.correta && respostaUsuario === alternativa.id && (
                        <XCircle size={18} className="ml-auto text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
            </div>
            
            {/* Explicação */}
            {mostrarResposta && questaoAtual.explicacao && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Explicação</h3>
                <p className="text-gray-800">{questaoAtual.explicacao}</p>
              </div>
            )}
          </div>
          
          {/* Footer com botões */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <div>
              {!mostrarResposta ? (
                <button
                  onClick={verificarResposta}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center"
                >
                  <HelpCircle size={18} className="mr-2" />
                  Ver Resposta
                </button>
              ) : (
                <div className="flex items-center">
                  {respostaCorreta === true ? (
                    <span className="text-green-600 font-medium flex items-center">
                      <CheckCircle size={18} className="mr-2" />
                      Correto!
                    </span>
                  ) : respostaCorreta === false ? (
                    <span className="text-red-600 font-medium flex items-center">
                      <XCircle size={18} className="mr-2" />
                      Incorreto
                    </span>
                  ) : (
                    <span className="text-blue-600 font-medium flex items-center">
                      <HelpCircle size={18} className="mr-2" />
                      Resposta revelada
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={questaoAnterior}
                disabled={indiceAtual === 0}
                className={`px-4 py-2 rounded-md flex items-center ${
                  indiceAtual === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft size={18} className="mr-1" />
                Anterior
              </button>
              
              <button
                onClick={() => {
                  resetarEstadoQuestao();
                  carregarQuestoes();
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md flex items-center"
              >
                <RefreshCw size={18} className="mr-1" />
                Nova
              </button>
              
              <button
                onClick={proximaQuestao}
                disabled={indiceAtual === questoes.length - 1}
                className={`px-4 py-2 rounded-md flex items-center ${
                  indiceAtual === questoes.length - 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Próxima
                <ChevronRight size={18} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="text-gray-500 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            Nenhuma questão encontrada
          </h3>
          <p className="text-gray-600 mb-4">
            Tente ajustar os filtros ou fazer uma busca diferente.
          </p>
          <button
            onClick={resetarFiltros}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default BancoQuestoes;