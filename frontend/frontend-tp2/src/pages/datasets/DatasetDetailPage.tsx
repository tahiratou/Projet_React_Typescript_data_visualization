import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Users, ExternalLink } from 'lucide-react';
import { datasetService } from '../../services/api/datasetService';
import { Dataset } from '../../types/dataset.types';
import Layout from '../../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { activityService } from '../../services/api/activityService';

const DatasetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchDataset = async () => {
      try {
        if (id) {
          const data = await datasetService.getById(parseInt(id));
          setDataset(data);
          // Incrémenter les datasets consultés
            activityService.incrementDatasetsViewed();
        }
      } catch (error) {
        console.error('Erreur chargement dataset:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDataset();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!dataset) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Dataset non trouvé</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Retour au tableau de bord
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{dataset.name_of_dataverse}</CardTitle>
            <p className="text-sm text-gray-500">ID: {dataset.identifier_of_dataverse}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700">
                  {dataset.description || 'Aucune description disponible'}
                </p>
              </div>

              {/* Mots-clés */}
              {dataset.keywords && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Mots-clés
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {dataset.keywords.split(',').map((keyword, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {keyword.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Auteurs */}
              {dataset.authors && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Auteurs
                  </h3>
                  <p className="text-gray-700">{dataset.authors}</p>
                </div>
              )}

              {/* Sujets */}
              {dataset.subjects && (
                <div>
                  <h3 className="font-semibold mb-2">Sujets</h3>
                  <p className="text-gray-700">{dataset.subjects}</p>
                </div>
              )}

              {/* Dates */}
              {dataset.date_info && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Dates
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Créé</p>
                      <p>{new Date(dataset.date_info.created_at).toLocaleDateString('fr-CA')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Modifié</p>
                      <p>{new Date(dataset.date_info.updated_at).toLocaleDateString('fr-CA')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Publié</p>
                      <p>{new Date(dataset.date_info.published_at).toLocaleDateString('fr-CA')}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Lien vers la source */}
              <div className="pt-4 border-t">
                <a 
                  href={dataset.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Voir sur le site source
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts */}
        {dataset.contacts && dataset.contacts.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dataset.contacts.map((contact) => (
                  <div key={contact.id} className="p-3 bg-gray-50 rounded">
                    <p className="font-medium">{contact.name}</p>
                    {contact.affiliation && (
                      <p className="text-sm text-gray-600">{contact.affiliation}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Publications */}
        {dataset.publications && dataset.publications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Publications liées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dataset.publications.map((pub) => (
                  <div key={pub.id} className="p-3 bg-gray-50 rounded">
                    <p className="text-sm">{pub.citation}</p>
                    {pub.url && (
                      <a 
                        href={pub.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
                      >
                        Lien vers la publication →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default DatasetDetailPage;