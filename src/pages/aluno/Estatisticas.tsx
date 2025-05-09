import { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Clock, Award, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Estatisticas = () => {
  const { usuario } = useAuth();
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Simulando carregamento de dados
    const timer = setTimeout(() => {
      setCarregando(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const estatisticas = {
    questoesRespondidas: 1245,
    acertosMedios: 68,
    horasEstudo: 87,
    simuladosRealizados: 24
  };

  const desempenhoPorDisciplina = [
    { nome: 'Direito Constitucional', acertos: 75, total: 100 },
    { nome: 'Direito Administrativo', acertos: 60, total: 100 },
    { nome: 'Português', acertos: 85, total: 100 },
    { nome: 'Raciocínio Lógico', acertos: 45, total: 100 },
    { nome: 'Conhecimentos Gerais', acertos: 70, total: 100 }
  ];

  const evolucaoMensal = [
    { mes: 'Jan', acertos: 55 },
    { mes: 'Fev', acertos: 58 },
    { mes: 'Mar', acertos: 62 },
    { mes: 'Abr', acertos: 65 },
    { mes: 'Mai', acertos: 68 },
    { mes: 'Jun', acertos: 72 }
  ];

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mt-16 md:mt-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meu Desempenho</h1>
        <p className="text-gray-600">Acompanhe sua evolução nos estudos</p>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3.5 bg-blue-100 rounded-full">
              <BarChart2 size={20} className="text-blue-600" />
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
              <TrendingUp size={20} className="text-green-600" />
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
              <h3 className="text-lg font-semibold">{estatisticas.simuladosRealizados}</h3>
              <p className="text-sm text-gray-600">Simulados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desempenho por disciplina */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-4 py-3 flex justify-between items-center">
            <h2 className="font-semibold text-lg">Desempenho por Disciplina</h2>
            <a href="#" className="text-sm text-blue-600 hover:underline flex items-center">
              Ver detalhes <ChevronRight size={16} />
            </a>
          </div>
          <div className="p-4">
            {desempenhoPorDisciplina.map((disciplina, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {disciplina.nome}
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    {Math.round((disciplina.acertos / disciplina.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      (disciplina.acertos / disciplina.total) * 100 > 70
                        ? 'bg-green-500'
                        : (disciplina.acertos / disciplina.total) * 100 > 40
                        ? 'bg-blue-500'
                        : 'bg-orange-500'
                    }`}
                    style={{ width: `${(disciplina.acertos / disciplina.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evolução mensal */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-4 py-3 flex justify-between items-center">
            <h2 className="font-semibold text-lg">Evolução Mensal</h2>
            <a href="#" className="text-sm text-blue-600 hover:underline flex items-center">
              Ver detalhes <ChevronRight size={16} />
            </a>
          </div>
          <div className="p-4">
            <div className="h-64 flex items-end justify-between">
              {evolucaoMensal.map((mes, index) => (
                <div key={index} className="flex flex-col items-center w-1/6">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${mes.acertos}%` }}
                  ></div>
                  <span className="text-xs font-medium text-gray-600 mt-2">{mes.mes}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nível e conquistas */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Nível {usuario?.nivel || 1}</h2>
            <p className="text-gray-600">
              {usuario?.pontos || 0} pontos • Próximo nível em {2000 - (usuario?.pontos || 0)} pontos
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <Award size={16} className="mr-1" />
              12 conquistas desbloqueadas
            </span>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="h-2 bg-blue-600 rounded-full"
            style={{ width: `${((usuario?.pontos || 0) / 2000) * 100}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Dedicação</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Conquistado
              </span>
            </div>
            <p className="text-xs text-gray-500">Complete 50 horas de estudo</p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Especialista</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Em progresso
              </span>
            </div>
            <p className="text-xs text-gray-500">Acerte 90% em uma disciplina</p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Maratonista</span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                Bloqueado
              </span>
            </div>
            <p className="text-xs text-gray-500">Complete 10 simulados</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estatisticas;