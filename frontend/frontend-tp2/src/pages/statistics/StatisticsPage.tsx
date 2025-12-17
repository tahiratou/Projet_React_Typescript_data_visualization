import React, { useEffect, useState } from 'react';
import { BarChart3, Download } from 'lucide-react';
import { BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchDatasets } from '../../store/slices/datasetSlice';
import Layout from '../../components/layout/Layout';
import { activityService } from '../../services/api/activityService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
const StatisticsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { datasets, loading } = useAppSelector((state) => state.datasets);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (datasets.length === 0) {
      dispatch(fetchDatasets({}));
    }
  }, [dispatch, datasets.length]);

  // Préparer les données pour les graphiques
  const prepareDataByKeywords = () => {
    const keywordCount: { [key: string]: number } = {};
    
    datasets.forEach(dataset => {
      if (dataset.keywords) {
        const keywords = dataset.keywords.split(',').map(k => k.trim());
        keywords.forEach(keyword => {
          if (keyword) {
            keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
          }
        });
      }
    });

    return Object.entries(keywordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));
  };

  const prepareDataByMonth = () => {
    const monthCount: { [key: string]: number } = {};
    
    datasets.forEach(dataset => {
      if (dataset.date_info?.published_at) {
        const date = new Date(dataset.date_info.published_at);
        const month = date.toLocaleString('fr-CA', { year: 'numeric', month: 'short' });
        monthCount[month] = (monthCount[month] || 0) + 1;
      }
    });

    return Object.entries(monthCount)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, value]) => ({ name, value }));
  };

  const prepareDataBySubject = () => {
    const subjectCount: { [key: string]: number } = {};
    
    datasets.forEach(dataset => {
      if (dataset.subjects) {
        const subjects = dataset.subjects.split(',').map(s => s.trim());
        subjects.forEach(subject => {
          if (subject) {
            subjectCount[subject] = (subjectCount[subject] || 0) + 1;
          }
        });
      }
    });

    return Object.entries(subjectCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  };

  const keywordsData = prepareDataByKeywords();
  const monthData = prepareDataByMonth();
  const subjectData = prepareDataBySubject();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

  // Export to PDF
  const exportToPDF = async () => {

    setIsExporting(true);
    try {
      const element = document.getElementById('statistics-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Titre
      pdf.setFontSize(20);
      pdf.text('Statistiques OGSL', 15, 15);
      
      // Date
      pdf.setFontSize(10);
      pdf.text(`Généré le ${new Date().toLocaleDateString('fr-CA')}`, 15, 22);

      // Image
      pdf.addImage(imgData, 'PNG', 10, 30, pdfWidth - 20, pdfHeight - 20);

      pdf.save(`statistiques-ogsl-${new Date().toISOString().split('T')[0]}.pdf`);
      // Incrémenter les exports PDF
      activityService.incrementPdfExports();
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
              <BarChart3 className="h-8 w-8" />
              <span>Statistiques</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Visualisation des données collectées
            </p>
          </div>
          <Button
            onClick={exportToPDF}
            disabled={isExporting}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>{isExporting ? 'Export en cours...' : 'Exporter en PDF'}</span>
          </Button>
        </div>

        <div id="statistics-content" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Datasets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">{datasets.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mots-clés uniques</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-green-600">{keywordsData.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sujets couverts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-purple-600">{subjectData.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Chart 1: Top Keywords */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Mots-clés</CardTitle>
              <CardDescription>Répartition des datasets par mots-clés</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={keywordsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#0088FE" name="Nombre de datasets" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Chart 2: Publications par mois */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution temporelle</CardTitle>
              <CardDescription>Nombre de datasets publiés par mois</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#00C49F" name="Datasets publiés" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Chart 3: Distribution par sujet */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition par sujet</CardTitle>
              <CardDescription>Distribution des datasets par domaine</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RechartsPieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {subjectData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default StatisticsPage;
