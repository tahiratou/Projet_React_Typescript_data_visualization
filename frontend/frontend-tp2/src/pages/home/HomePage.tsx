import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, BarChart3, Filter, FileDown, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Database className="h-12 w-12 text-blue-600" />,
      title: "Exploration de données",
      description: "Consultez et explorez des milliers de jeux de données scientifiques"
    },
    {
      icon: <Filter className="h-12 w-12 text-green-600" />,
      title: "Filtres dynamiques",
      description: "Affinez vos recherches avec des filtres puissants et intuitifs"
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-purple-600" />,
      title: "Visualisation avancée",
      description: "Graphiques interactifs pour analyser les données"
    },
    {
      icon: <FileDown className="h-12 w-12 text-orange-600" />,
      title: "Export PDF",
      description: "Exportez vos analyses et graphiques en PDF"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Plateforme de Visualisation
            <span className="block text-blue-600 mt-2">de Données Scientifiques</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Explorez, analysez et visualisez des données provenant du 
            Fleuve Saint-Laurent et des océans grâce à nos outils interactifs
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/login')}
              className="flex items-center"
            >
              Commencer
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/register')}
            >
              Créer un compte
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Fonctionnalités principales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold mb-2">300+</p>
              <p className="text-xl">Jeux de données</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">50+</p>
              <p className="text-xl">Organisations</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">10+</p>
              <p className="text-xl">Catégories</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Prêt à explorer ?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Créez votre compte gratuit et commencez dès maintenant
        </p>
        <Button 
          size="lg" 
          onClick={() => navigate('/register')}
          className="flex items-center mx-auto"
        >
          S'inscrire gratuitement
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>
    </div>
  );
};

export default HomePage;