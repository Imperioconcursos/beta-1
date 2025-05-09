import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BookOpen, CheckCircle, Clock, Award, BarChart2, 
  TrendingUp, Calendar, ChevronRight 
} from 'lucide-react';
import { simuladosService } from '../../services/simuladosService';
import { SimuladoConfig, ResultadoSimulado } from '../../types/Simulado';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DashboardAluno = () => {
  const { usuario } = useAuth();
  const [carregando, setCarregando] = useState(true);
  const [simulados, setSimulados] = useState<SimuladoConfig[]>([]);
  const [resultados, setResultados] = useState<ResultadoSimulado[]>([]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        const [simuladosData, resultadosData] = await Promise.all([
          simuladosService.listarSimulados(),
          simuladosService.obterResultados(usuario?.id || '')
        ]);
        
        setSimulados(simuladosData);
        setResultados(resultadosData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDados();
  }, [usuario?.id]);

  // Dados para exibição no dashboard (simulados para demonstração)
  const estatisticas = {
    questoesRespondidas: 1245,
    acertosMedios: 68,
    horasEstudo: 87,
    simuladosRealizados: 24,
    conquistasDesbloqueadas: 12,
    totalConquistas: 30
  };

  const progressoDisciplinas = [
    { nome: 'Direito Constitucional', progresso: 75 },
    { nome: 'Direito Administrativo', progresso: 60 },
    { nome: 'Português', progresso: 85 },
    { nome: 'Raciocínio Lógico', progresso: 45 },
    { nome: 'Conhecimentos Gerais', progresso: 70 }
  ];

  // Formata data para "há X tempo" (ex: "há 2 dias")
  const formatarTempoRelativo = (data: string) => {
    try {
      return formatDistanceToNow(new Date(data), { 
        addSuffix: true,
        locale: ptBR 
      });
    } catch (e) {
      return 'data inválida';
    }
  };

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mt-16 md:mt-20">
      {/* Saudação e resumo */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Olá, {usuario?.nome.split(' ')[0]}!
            </h1>
            <p className="text-gray-600">
              Continue sua preparação! Você está no <span className="font-semibold text-blue-600">Nível {usuario?.nivel || 1}</span> com <span className="font-semibold text-blue-600">{usuario?.pontos || 0} pontos</span>.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1.5 rounded-full flex items-center">
              <TrendingUp size={16} className="mr-1" />
              +15 pontos esta semana
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-blue-600 rounded-full" 
              style={{ width: '45%' }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1 text-gray-500">
            <span>{usuario?.pontos || 0} pts</span>
            <span>Próximo nível: 2000 pts</span>
          </div>
        </div>
      </div>
      
      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3.5 bg-blue-100 rounded-full">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">{estatisticas.questoesRespondidas}</h3>
              <p className="text-sm text-gray-600">Questões resolvidas</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3.5 bg-green-100 rounded-full">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">{estatisticas.acertosMedios}%</h3>
              <p className="text-sm text-gray-600">Taxa de acertos</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3.5 bg-orange-100 rounded-full">
              <Clock size={20} className="text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">{estatisticas.horasEstudo}h</h3>
              <p className="text-sm text-gray-600">Tempo de estudo</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3.5 bg-purple-100 rounded-full">
              <Award size={20} className="text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">{estatisticas.conquistasDesbloqueadas}/{estatisticas.totalConquistas}</h3>
              <p className="text-sm text-gray-600">Conquistas</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Simulados recentes e progresso */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Simulados recomendados */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="border-b px-4 py-3 flex justify-between items-center">
            <h2 className="font-semibold text-lg">Simulados Recomendados</h2>
            <a href="/simulados" className="text-sm text-blue-600 hover:underline flex items-center">
              Ver todos <ChevronRight size={16} />
            </a>
          </div>
          
          <div className="p-4">
            {simulados.slice(0, 3).map((simulado) => (
              <div key={simulado.id} className="mb-4 last:mb-0 border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900">{simulado.titulo}</h3>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {simulado.quantidadeQuestoes} questões
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1 mb-2 line-clamp-2">{simulado.descricao}</p>
                
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar size={14} className="mr-1" />
                    {formatarTempoRelativo(simulado.dataPublicacao)}
                  </div>
                  
                  <a 
                    href={`/simulados/${simulado.id}`} 
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                  >
                    Iniciar
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Desempenho por disciplina */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-4 py-3 flex justify-between items-center">
            <h2 className="font-semibold text-lg">Desempenho por Disciplina</h2>
            <a href="/estatisticas" className="text-sm text-blue-600 hover:underline flex items-center">
              Detalhes <ChevronRight size={16} />
            </a>
          </div>
          
          <div className="p-4">
            {progressoDisciplinas.map((disciplina, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {disciplina.nome}
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    {disciplina.progresso}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      disciplina.progresso > 70 
                        ? 'bg-green-500' 
                        : disciplina.progresso > 40 
                          ? 'bg-blue-500' 
                          : 'bg-orange-500'
                    }`}
                    style={{ width: `${disciplina.progresso}%` }}
                  ></div>
                </div>
              </div>
            ))}
            
            <a href="/questoes" className="mt-4 w-full flex justify-center items-center py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-md transition-colors">
              Praticar Questões
            </a>
          </div>
        </div>
      </div>
      
      {/* Últimas conquistas e atividades recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas conquistas */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-4 py-3">
            <h2 className="font-semibold text-lg">Conquistas Recentes</h2>
          </div>
          
          <div className="p-4">
            <div className="flex items-center mb-4 border-b border-gray-100 pb-4">
              <div className="p-2 bg-purple-100 rounded-full">
                <Award size={24} className="text-purple-600" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">Maratonista</h3>
                <p className="text-sm text-gray-600">Completou 10 simulados completos</p>
              </div>
              <div className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                +50 pts
              </div>
            </div>
            
            <div className="flex items-center mb-4 border-b border-gray-100 pb-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <CheckCircle size={24} className="text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">Especialista</h3>
                <p className="text-sm text-gray-600">95% de acertos em Direito Constitucional</p>
              </div>
              <div className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                +100 pts
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-full">
                <Clock size={24} className="text-orange-600" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">Dedicação</h3>
                <p className="text-sm text-gray-600">Estudou por 50 horas no total</p>
              </div>
              <div className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                +75 pts
              </div>
            </div>
          </div>
        </div>
        
        {/* Atividades recentes */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-4 py-3">
            <h2 className="font-semibold text-lg">Atividades Recentes</h2>
          </div>
          
          <div className="p-4">
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-4 w-px bg-gray-200"></div>
              
              <div className="relative mb-5">
                <div className="flex items-center">
                  <div className="bg-blue-600 rounded-full h-8 w-8 flex items-center justify-center z-10">
                    <BookOpen size={16} className="text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium">Resolveu 25 questões de Português</h3>
                    <p className="text-xs text-gray-500">Hoje, 15:30</p>
                  </div>
                </div>
              </div>
              
              <div className="relative mb-5">
                <div className="flex items-center">
                  <div className="bg-green-600 rounded-full h-8 w-8 flex items-center justify-center z-10">
                    <BarChart2 size={16} className="text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium">Completou Simulado de Direito Administrativo</h3>
                    <p className="text-xs text-gray-500">Ontem, 10:15</p>
                  </div>
                </div>
              </div>
              
              <div className="relative mb-5">
                <div className="flex items-center">
                  <div className="bg-purple-600 rounded-full h-8 w-8 flex items-center justify-center z-10">
                    <Award size={16} className="text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium">Desbloqueou conquista "Especialista"</h3>
                    <p className="text-xs text-gray-500">2 dias atrás</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="flex items-center">
                  <div className="bg-gray-600 rounded-full h-8 w-8 flex items-center justify-center z-10">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium">Atualizou perfil</h3>
                    <p className="text-xs text-gray-500">3 dias atrás</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAluno;