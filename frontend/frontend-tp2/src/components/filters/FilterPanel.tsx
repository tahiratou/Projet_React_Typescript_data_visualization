import React, { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

export interface FilterValues {
  search?: string;
  mots_cles?: string;
  organisations?: string;
  localisations?: string;
  catalogue?: string;
  thematique?: string;
  producteur?: string;
  dateDebut?: string;
  dateFin?: string;
}

interface FilterPanelProps {
  onFilter: (filters: FilterValues) => void;
  onReset: () => void;
  initialFilters?: FilterValues; // ← NOUVEAU : pour restaurer les filtres
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilter, onReset, initialFilters = {} }) => {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  // Restaurer les filtres quand initialFilters change
  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      setFilters(initialFilters);
      // Ouvrir automatiquement si des filtres sont présents
      const hasAdvancedFilters = Object.keys(initialFilters).some(
        key => key !== 'search' && initialFilters[key as keyof FilterValues]
      );
      if (hasAdvancedFilters) {
        setIsExpanded(true);
      }
    }
  }, [initialFilters]);

  const handleInputChange = (field: keyof FilterValues, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({});
    setIsExpanded(false);
    onReset();
  };

  return (
    <Card className="mb-6 border-gray-200 shadow-sm">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ligne principale : Recherche + Boutons */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Recherche globale (toujours visible) */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher dans tous les champs..."
                  value={filters.search || ''}
                  onChange={(e) => handleInputChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center space-x-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Filter className="h-4 w-4" />
                <span>Filtres</span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Réinitialiser</span>
              </Button>
            </div>
          </div>

          {/* Filtres avancés (repliables) */}
          {isExpanded && (
            <div className="pt-4 border-t space-y-4 animate-in slide-in-from-top-2">
              {/* Grille de filtres */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Mots-clés */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Mots-clés
                  </label>
                  <Input
                    type="text"
                    placeholder="eau, climat..."
                    value={filters.mots_cles || ''}
                    onChange={(e) => handleInputChange('mots_cles', e.target.value)}
                  />
                </div>

                {/* Catalogue */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Catalogue
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={filters.catalogue || ''}
                    onChange={(e) => handleInputChange('catalogue', e.target.value)}
                  >
                    <option value="">Tous les catalogues</option>
                    <option value="fleuve-saint-laurent">Fleuve Saint-Laurent</option>
                    <option value="ocean-atlantique">Océan Atlantique</option>
                    <option value="grands-lacs">Grands Lacs</option>
                    <option value="arctique">Arctique</option>
                  </select>
                </div>

                {/* Thématique */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Thématique
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={filters.thematique || ''}
                    onChange={(e) => handleInputChange('thematique', e.target.value)}
                  >
                    <option value="">Toutes les thématiques</option>
                    <option value="environnement">Environnement</option>
                    <option value="biologie">Biologie</option>
                    <option value="climat">Climat</option>
                    <option value="oceanographie">Océanographie</option>
                    <option value="chimie">Chimie</option>
                  </select>
                </div>

                {/* Organisations */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Organisations
                  </label>
                  <Input
                    type="text"
                    placeholder="Université, Ministère..."
                    value={filters.organisations || ''}
                    onChange={(e) => handleInputChange('organisations', e.target.value)}
                  />
                </div>

                {/* Producteur */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Producteur
                  </label>
                  <Input
                    type="text"
                    placeholder="Nom du producteur..."
                    value={filters.producteur || ''}
                    onChange={(e) => handleInputChange('producteur', e.target.value)}
                  />
                </div>

                {/* Localisations */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Localisations
                  </label>
                  <Input
                    type="text"
                    placeholder="Région, zone..."
                    value={filters.localisations || ''}
                    onChange={(e) => handleInputChange('localisations', e.target.value)}
                  />
                </div>
              </div>

              {/* Filtres de date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Date de début
                  </label>
                  <Input
                    type="date"
                    value={filters.dateDebut || ''}
                    onChange={(e) => handleInputChange('dateDebut', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Date de fin
                  </label>
                  <Input
                    type="date"
                    value={filters.dateFin || ''}
                    onChange={(e) => handleInputChange('dateFin', e.target.value)}
                  />
                </div>
              </div>

              {/* Bouton Appliquer les filtres */}
              <div className="pt-4 border-t">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Appliquer les filtres
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;