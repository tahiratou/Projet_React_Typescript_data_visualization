import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchDatasets, clearFilters } from '../../store/slices/datasetSlice';
import Layout from '../../components/layout/Layout';
import FilterPanel, { FilterValues } from '../../components/filters/FilterPanel';
import DatasetCard from '../../components/dataset/DatasetCard';
import { Button } from '../../components/ui/button';
import { activityService } from '../../services/api/activityService';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { datasets, loading, error, filters: savedFilters, hasSearched } = useAppSelector((state) => state.datasets);
  
  // Initialiser avec les filtres sauvegardés dans Redux
  const [activeFilters, setActiveFilters] = useState<FilterValues>(savedFilters);

  // Charger les datasets seulement si aucune recherche n'a été faite
  useEffect(() => {
    if (!hasSearched && datasets.length === 0) {
      dispatch(fetchDatasets({}));
    }
  }, [dispatch, hasSearched, datasets.length]);

  // Appliquer les filtres
  const handleFilter = (filters: FilterValues) => {
    setActiveFilters(filters);
    
    // Incrémenter les recherches
    if (Object.keys(filters).some(key => filters[key as keyof FilterValues])) {
      activityService.incrementSearches();
    }
    
    // Construire les paramètres pour l'API
    const apiFilters: any = {};
    
    if (filters.search) {
      apiFilters.search = filters.search;
    }
    if (filters.mots_cles) {
      apiFilters.mots_cles = filters.mots_cles;
    }
    if (filters.organisations) {
      apiFilters.organisations = filters.organisations;
    }
    if (filters.localisations) {
      apiFilters.localisations = filters.localisations;
    }
    if (filters.catalogue) {
      apiFilters.catalogue = filters.catalogue;
    }
    if (filters.thematique) {
      apiFilters.thematique = filters.thematique;
    }
    if (filters.producteur) {
      apiFilters.producteur = filters.producteur;
    }
    if (filters.dateDebut) {
      apiFilters.date_debut = filters.dateDebut;
    }
    if (filters.dateFin) {
      apiFilters.date_fin = filters.dateFin;
    }

    // Appeler l'API avec les filtres (Redux va sauvegarder les filtres)
    dispatch(fetchDatasets(apiFilters));
  };

  // Réinitialiser les filtres
  const handleReset = () => {
    setActiveFilters({});
    dispatch(clearFilters());
    dispatch(fetchDatasets({}));
  };

  // Naviguer vers les détails d'un dataset
  const handleViewDetails = (id: number) => {
    navigate(`/datasets/${id}`);
  };

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600 text-xl">{error}</p>
          <Button onClick={() => dispatch(fetchDatasets({}))} className="mt-4">
            Réessayer
          </Button>
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
              <Database className="h-8 w-8" />
              <span>Tableau de bord</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Explorez et filtrez les jeux de données disponibles
            </p>
          </div>
        </div>

        {/* Panneau de filtres - Initialiser avec les filtres sauvegardés */}
        <FilterPanel 
          onFilter={handleFilter} 
          onReset={handleReset}
          initialFilters={activeFilters}
        />

        {/* Indicateur de filtres actifs */}
        {Object.keys(activeFilters).length > 0 && Object.values(activeFilters).some(v => v) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">
                Filtres actifs : {Object.keys(activeFilters).filter(k => activeFilters[k as keyof FilterValues]).length}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {datasets.length} résultat{datasets.length > 1 ? 's' : ''} trouvé{datasets.length > 1 ? 's' : ''}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Effacer les filtres
            </Button>
          </div>
        )}

        {/* Liste des datasets */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des données...</p>
          </div>
        ) : datasets.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">Aucun dataset trouvé</p>
            <p className="text-gray-500 mt-2">
              {hasSearched 
                ? "Essayez d'ajuster vos critères de recherche" 
                : "Chargez des données en utilisant les filtres"}
            </p>
            {hasSearched && (
              <Button onClick={handleReset} className="mt-4">
                Réinitialiser les filtres
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {datasets.map((dataset) => (
                <DatasetCard
                  key={dataset.id}
                  dataset={dataset}
                  onViewDetails={() => handleViewDetails(dataset.id)}
                />
              ))}
            </div>
            
            {/* Statistiques */}
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>
                Affichage de {datasets.length} dataset{datasets.length > 1 ? 's' : ''}
              </p>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;