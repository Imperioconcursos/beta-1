import React from 'react';
import { Users, BookOpen, FileSpreadsheet } from 'lucide-react';

const DashboardAdmin = () => {
  const stats = [
    {
      title: 'Total de Usuários',
      value: '150',
      icon: <Users className="w-8 h-8 text-blue-500" />,
    },
    {
      title: 'Questões Cadastradas',
      value: '500',
      icon: <BookOpen className="w-8 h-8 text-green-500" />,
    },
    {
      title: 'Simulados Realizados',
      value: '75',
      icon: <FileSpreadsheet className="w-8 h-8 text-purple-500" />,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Administrativo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Atividades Recentes</h2>
        <div className="space-y-4">
          <p className="text-gray-600">Ainda não há atividades registradas.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;