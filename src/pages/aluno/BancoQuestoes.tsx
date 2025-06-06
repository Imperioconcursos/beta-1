import { useState, useEffect } from 'react';
import { questoesService } from '../../services/questoesService';
import { Questao } from '../../types/Questao';
import { Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const BancoQuestoes: React.FC = () => {
    const [questoes, setQuestoes] = useState<Questao[]>([]);
    const [questaoAtual, setQuestaoAtual] = useState<Questao | null>(null);
    const [indiceAtual, setIndiceAtual] = useState(0);
    const [carregando, setCarregando] = useState(true);
    const [respostaUsuario, setRespostaUsuario] = useState<string | null>(null);
    const [mostrarResposta, setMostrarResposta] = useState(false);
    const [respostaCorreta, setRespostaCorreta] = useState<boolean | null>(null);
    const [alternativasRiscadas, setAlternativasRiscadas] = useState<Set<number>>(new Set());
    const [questaoRespondida, setQuestaoRespondida] = useState(false);
    const [disciplinaFiltro, setDisciplinaFiltro] = useState<string>('');
    const [dificuldadeFiltro, setDificuldadeFiltro] = useState<string>('');
    const [tipoFiltro, setTipoFiltro] = useState<string>('');
    const [anoFiltro, setAnoFiltro] = useState<string>('');
    const [bancaFiltro, setBancaFiltro] = useState<string>('');
    const [fonteFiltro, setFonteFiltro] = useState<string>(''); 
    const [assuntoFiltro, setAssuntoFiltro] = useState<string>('');
    const [textoBusca, setTextoBusca] = useState<string>('');
    const [filtrosAbertos, setFiltrosAbertos] = useState(false);

    // Definindo as disciplinas, dificuldades e tipos
    const disciplinas = ['Direito Constitucional', 'Direito Penal', 'Português', 'Conhecimentos Gerais', 'Matemática'];
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

    const anos = ['2020', '2021', '2022', '2023'];
    const bancas = ['Cespe', 'FGV', 'VUNESP', 'FCC', 'IADES', 'IBFC', 'AOCP', 'FUMARC', 'CESGRANRIO', 'FUNDATEC', 'INSTITUTO ÁGUAS', 'IDIB', 'QUADRIX', 'CONSULPLAN', 'CETRO', 'UNESP', 'OBJETIVA', 'UNIFESP', 'IESES'];

    // Inicializando a lista de fontes
    const fontes = [
        'PM-TO', 'PM-SP', 'PM-PR', 'PM-PA', 'IBGE',
        'PRF', 'PF', 'PC-DF', 'PM-DF', 'PC-SP', 'PM-SP',
        'PC-MG', 'PM-MG', 'PC-RJ', 'PM-RJ', 'PC-BA', 'PM-BA',
        'PC-RS', 'PM-RS', 'PC-PR', 'PM-PR', 'PC-SC', 'PM-SC',
        'PC-GO', 'PM-GO', 'PC-PE', 'PM-PE', 'PC-CE', 'PM-CE',
        'PC-AM', 'PM-AM', 'PC-PA', 'PM-PA', 'PC-MA', 'PM-MA',
        'PC-PB', 'PM-PB', 'PC-PI', 'PM-PI', 'PC-RN', 'PM-RN',
        'PC-MS', 'PM-MS', 'PC-MT', 'PM-MT', 'PC-ES', 'PM-ES',
        'DEPEN', 'DPU', 'MPU', 'TRE-SP', 'TRE-RJ', 'TRF-1', 'TRF-3', 'TJ-SP'
    ];

    // Aqui você pode definir seus assuntos
    const assuntos = [
        'Uso de Sinônimos', 'Direitos Humanos', 'Legislação', 'Estatística', 'Álgebra'
    ];

    useEffect(() => {
        carregarQuestoes();
    }, []);
    
    const carregarQuestoes = async () => {
        setCarregando(true);
        try {
            const filtros: Partial<Questao> = {};
            
            if (disciplinaFiltro) filtros.disciplina = disciplinaFiltro;
            if (dificuldadeFiltro) filtros.dificuldade = dificuldadeFiltro;
            if (tipoFiltro) filtros.tipo = tipoFiltro;
            if (anoFiltro) filtros.ano = anoFiltro;
            if (bancaFiltro) filtros.banca = bancaFiltro;
            if (assuntoFiltro) filtros.assunto = assuntoFiltro;

            const questoesData = await questoesService.listarQuestoes(filtros);
            
            const questoesFiltradas = questoesData.map(q => ({
                ...q,
                assunto: q.topico, 
                orgao: q.fonte 
            })).filter(q => {
                const pertenceAoFonte = fonteFiltro ? q.orgao === fonteFiltro : true;
                const correspondeBuscaTexto = textoBusca ? q.enunciado.toLowerCase().includes(textoBusca.toLowerCase()) : true;

                return pertenceAoFonte && correspondeBuscaTexto;
            });

            setQuestoes(questoesFiltradas);
            setQuestaoAtual(questoesFiltradas.length > 0 ? questoesFiltradas[0] : null);
            setIndiceAtual(0);
            resetarEstadoQuestao();
        } catch (error) {
            console.error('Erro ao carregar questões:', error);
            toast.error('Erro ao carregar questões: ' + error.message);
        } finally {
            setCarregando(false);
        }
    };
    
    const resetarEstadoQuestao = () => {
        setRespostaUsuario(null);
        setMostrarResposta(false);
        setRespostaCorreta(null);
        setAlternativasRiscadas(new Set());
        setQuestaoRespondida(false);
    };
    
    const verificarResposta = () => {
        if (!respostaUsuario) return;
        const alternativaCorreta = questaoAtual?.alternativas.find(a => a.correta);
        setRespostaCorreta(respostaUsuario === alternativaCorreta?.id);
        setMostrarResposta(true);
        setQuestaoRespondida(true);
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
    
    const aplicarFiltros = () => {
        carregarQuestoes();
    };
    
    const resetarFiltros = () => {
        setDisciplinaFiltro('');
        setDificuldadeFiltro('');
        setTipoFiltro('');
        setAnoFiltro('');
        setBancaFiltro('');
        setFonteFiltro('');
        setAssuntoFiltro('');
        setTextoBusca('');
    };

    const toggleRiscarAlternativa = (index: number) => {
        const novasAlternativasRiscadas = new Set(alternativasRiscadas);

        if (novasAlternativasRiscadas.has(index)) {
            novasAlternativasRiscadas.delete(index);
        } else {
            novasAlternativasRiscadas.add(index);
        }
        
        setAlternativasRiscadas(novasAlternativasRiscadas);
    };

    const marcarAlternativaComoResposta = (index: number) => {
        setAlternativasRiscadas(previous => {
            const novasAlternativas = new Set(previous);
            novasAlternativas.delete(index);
            return novasAlternativas;
        });
        setRespostaUsuario(questaoAtual?.alternativas[index]?.id);
    };

    const todasAlternativasRiscadas = () => {
        return questaoAtual && alternativasRiscadas.size === questaoAtual.alternativas.length;
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
            <h1 className="text-2xl font-bold mb-4">Banco de Questões</h1>
            <div className="flex mb-6">
                <input
                    type="text"
                    placeholder="Buscar questões..."
                    value={textoBusca}
                    onChange={(e) => setTextoBusca(e.target.value)}
                    className="border rounded p-3 flex-grow shadow-sm"
                />
                <button onClick={carregarQuestoes} className="ml-2 p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition">
                    <Search className="inline w-5 h-5" />
                </button>
                <button
                    onClick={() => setFiltrosAbertos(!filtrosAbertos)}
                    className="ml-2 p-2 bg-gray-100 rounded shadow flex items-center hover:bg-gray-200 transition"
                >
                    <Filter className="mr-1" /> Filtros
                </button>
            </div>

            {filtrosAbertos && (
                <div className="mb-6 bg-white rounded-lg shadow-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex flex-col">
                            <label className="mb-1">Disciplina</label>
                            <select value={disciplinaFiltro} onChange={(e) => setDisciplinaFiltro(e.target.value)} className="p-2 border bg-gray-50 rounded shadow-sm">
                                <option value="">Selecione</option>
                                {disciplinas.map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1">Assunto</label>
                            <select
                                value={assuntoFiltro}
                                onChange={(e) => setAssuntoFiltro(e.target.value)}
                                className="p-2 border bg-gray-50 rounded shadow-sm"
                                disabled={!disciplinaFiltro}
                            >
                                <option value="">Selecione</option>
                                {assuntos.map((assunto) => <option key={assunto} value={assunto}>{assunto}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1">Dificuldade</label>
                            <select value={dificuldadeFiltro} onChange={(e) => setDificuldadeFiltro(e.target.value)} className="p-2 border bg-gray-50 rounded shadow-sm">
                                <option value="">Selecione</option>
                                {dificuldades.map((d) => <option key={d.valor} value={d.valor}>{d.texto}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1">Tipo de Questão</label>
                            <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)} className="p-2 border bg-gray-50 rounded shadow-sm">
                                <option value="">Selecione</option>
                                {tipos.map((t) => <option key={t.valor} value={t.valor}>{t.texto}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1">Ano</label>
                            <select value={anoFiltro} onChange={(e) => setAnoFiltro(e.target.value)} className="p-2 border bg-gray-50 rounded shadow-sm">
                                <option value="">Selecione</option>
                                {anos.map((a) => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1">Banca</label>
                            <select value={bancaFiltro} onChange={(e) => setBancaFiltro(e.target.value)} className="p-2 border bg-gray-50 rounded shadow-sm">
                                <option value="">Selecione</option>
                                {bancas.map((b) => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1">Órgão</label>
                            <select value={fonteFiltro} onChange={(e) => setFonteFiltro(e.target.value)} className="p-2 border bg-gray-50 rounded shadow-sm">
                                <option value="">Selecione</option>
                                {fontes.map((fonte) => <option key={fonte} value={fonte}>{fonte}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end gap-2">
                        <button onClick={aplicarFiltros} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition">
                            Aplicar Filtros
                        </button>
                        <button onClick={resetarFiltros} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow transition">
                            Limpar Filtros
                        </button>
                    </div>
                </div>
            )}

            {questaoAtual ? (
                <div className="bg-white shadow-xl rounded-lg p-6 mb-6">
                    <div className="flex flex-col space-y-2">
                        <h2 className="text-lg font-bold text-indigo-800">
                            {indiceAtual + 1}. {questaoAtual.disciplina} - {questaoAtual.assunto}
                        </h2>
                        <div className="flex space-x-4 text-sm text-gray-500">
                            <span className="font-semibold">Banca:</span> <span>{questaoAtual.banca}</span>
                            <span className="font-semibold">Ano:</span> <span>{questaoAtual.ano}</span>
                            <span className="font-semibold">Órgão:</span> <span>{questaoAtual.orgao}</span>
                        </div>
                        <p className="text-gray-800 mt-2 text-base leading-6">{questaoAtual.enunciado}</p>
                    </div>
                    
                    {questaoAtual.alternativas.map((a, i) => (
                        <div key={i} className="mb-2 flex items-center">
                            <div className="relative">
                                <button
                                    onClick={() => toggleRiscarAlternativa(i)}
                                    className="text-red-500 opacity-0 hover:opacity-100 transition-opacity"
                                    style={{ marginRight: "10px" }} // Espaço adicional
                                >
                                    ❌
                                </button>
                            </div>
                            <label className={`flex items-center space-x-2 cursor-pointer border border-gray-300 rounded-lg p-3 bg-white shadow-md flex-grow transition-all duration-300 ease-in-out hover:bg-gray-100 ${alternativasRiscadas.has(i) ? 'line-through text-gray-500 opacity-60' : ''}`}>
                                <input
                                    type="radio"
                                    value={a.id}
                                    checked={respostaUsuario === a.id}
                                    onChange={() => marcarAlternativaComoResposta(i)} 
                                    className="form-radio text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-gray-800">{String.fromCharCode(65 + i)}) {a.texto}</span>
                            </label>
                        </div>
                    ))}
                    
                    <div className="flex items-center mt-4">
                        <button 
                            onClick={verificarResposta} 
                            disabled={questaoRespondida || todasAlternativasRiscadas()} 
                            className={`bg-indigo-600 text-white p-2 rounded-md shadow hover:bg-indigo-700 transition ${questaoRespondida || todasAlternativasRiscadas() ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Responder
                        </button>
                        {mostrarResposta && (
                            <span className={`ml-4 text-lg ${respostaCorreta ? 'text-green-500' : 'text-red-500'}`}>
                                {respostaCorreta ? 'Você Acertou! 🎉' : 'Você Errou! ❌'}
                            </span>
                        )}
                    </div>
                    
                    <div className="mt-6 flex justify-between">
                        <button onClick={questaoAnterior} disabled={indiceAtual === 0} className="px-4 py-2 bg-gray-300 rounded shadow hover:bg-gray-400 transition">
                            Anterior
                        </button>
                        <button onClick={proximaQuestao} disabled={indiceAtual === questoes.length - 1} className="px-4 py-2 bg-gray-300 rounded shadow hover:bg-gray-400 transition">
                            Próxima
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-500">Nenhuma questão encontrada.</div>
            )}
        </div>
    );
};

export default BancoQuestoes;
