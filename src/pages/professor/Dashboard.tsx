import React from 'react';

function DashboardProfessor() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard do Professor</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Questões Cadastradas</h2>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Simulados Criados</h2>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Alunos Ativos</h2>
          <p className="text-3xl font-bold text-purple-600">0</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardProfessor;