import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Logo from '../components/layout/Logo';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center py-4">
            <Logo />
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#recursos" className="text-gray-600 hover:text-gray-900">Recursos</a>
              <a href="#planos" className="text-gray-600 hover:text-gray-900">Planos</a>
              <a href="#sobre" className="text-gray-600 hover:text-gray-900">Sobre</a>
              <Link to="/login" className="text-gray-600 hover:text-gray-900">Entrar</Link>
              <Link 
                to="/cadastro"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Criar Conta
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden p-2">
              <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Sua aprovação mais <span className="text-blue-600">próxima</span> do que nunca
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Prepare-se para concursos públicos com questões atualizadas, simulados e material exclusivo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/cadastro"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Começar Agora
              </Link>
              <a
                href="#planos"
                className="bg-gray-100 text-gray-800 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Ver Planos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recursos exclusivos para sua aprovação</h2>
            <p className="text-xl text-gray-600">Tudo que você precisa em um só lugar</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Banco de Questões',
                description: 'Milhares de questões atualizadas com gabarito e explicações detalhadas'
              },
              {
                title: 'Simulados',
                description: 'Simulados personalizados que se adaptam ao seu nível de conhecimento'
              },
              {
                title: 'Estatísticas',
                description: 'Acompanhe seu desempenho e evolução com análises detalhadas'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Escolha o plano ideal para você</h2>
            <p className="text-xl text-gray-600">Comece hoje mesmo sua preparação</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Básico',
                price: 'R$ 29,90',
                features: ['Acesso ao banco de questões', 'Simulados básicos', 'Suporte por email'],
                recommended: false
              },
              {
                name: 'Premium',
                price: 'R$ 49,90',
                features: ['Tudo do plano Básico', 'Simulados avançados', 'Estatísticas detalhadas', 'Suporte prioritário'],
                recommended: true
              },
              {
                name: 'Pro',
                price: 'R$ 79,90',
                features: ['Tudo do plano Premium', 'Mentoria individual', 'Conteúdo exclusivo', 'Acesso vitalício'],
                recommended: false
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-xl shadow-lg p-8 ${
                  plan.recommended ? 'ring-2 ring-blue-600 scale-105' : ''
                }`}
              >
                {plan.recommended && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Recomendado
                  </span>
                )}
                <h3 className="text-xl font-semibold text-gray-900 mt-4">{plan.name}</h3>
                <p className="text-3xl font-bold text-gray-900 mt-4">{plan.price}</p>
                <p className="text-gray-500 text-sm">por mês</p>
                
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full mt-8 px-4 py-2 rounded-lg font-medium ${
                  plan.recommended
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                } transition-colors`}>
                  Assinar Agora
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-blue-600 rounded-2xl p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto para começar sua jornada?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Junte-se a milhares de aprovados que confiam em nossa plataforma
            </p>
            <Link
              to="/cadastro"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Criar Conta Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo className="text-white" />
              <p className="text-sm mt-4">
                Sua plataforma completa de preparação para concursos públicos
              </p>
            </div>
            
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Banco de Questões</a></li>
                <li><a href="#" className="hover:text-white">Simulados</a></li>
                <li><a href="#" className="hover:text-white">Estatísticas</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Sobre</a></li>
                <li><a href="#" className="hover:text-white">Carreiras</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
                <li><a href="#" className="hover:text-white">Imprensa</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white">Privacidade</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
                <li><a href="#" className="hover:text-white">Licenças</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            <p>&copy; 2024 Império Concursos. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;