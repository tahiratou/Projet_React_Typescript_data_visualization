import React from 'react';
import { ExternalLink, Calendar, User, FileText } from 'lucide-react';
import { Dataset } from '../../types/dataset.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface DatasetCardProps {
  dataset: Dataset;
  onViewDetails?: (dataset: Dataset) => void;
}

const DatasetCard: React.FC<DatasetCardProps> = ({ dataset, onViewDetails }) => {
  const truncateText = (text: string | null, maxLength: number) => {
    if (!text) return 'Non disponible';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">
              {dataset.name_of_dataverse}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center space-x-2 text-xs">
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {dataset.identifier_of_dataverse}
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3">
          {truncateText(dataset.description, 150)}
        </p>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
          {dataset.authors && (
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span className="truncate">{truncateText(dataset.authors, 30)}</span>
            </div>
          )}
          {dataset.subjects && (
            <div className="flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span className="truncate">{truncateText(dataset.subjects, 30)}</span>
            </div>
          )}
          {dataset.date_info?.published_at && (
            <div className="flex items-center space-x-1 col-span-2">
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(dataset.date_info.published_at).toLocaleDateString('fr-CA')}
              </span>
            </div>
          )}
        </div>

        {/* Keywords */}
        {dataset.keywords && (
          <div className="flex flex-wrap gap-1">
            {dataset.keywords.split(',').slice(0, 3).map((keyword, index) => (
              <span
                key={index}
                className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
              >
                {keyword.trim()}
              </span>
            ))}
            {dataset.keywords.split(',').length > 3 && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                +{dataset.keywords.split(',').length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(dataset)}
              className="flex-1"
            >
              Détails
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(dataset.url, '_blank')}
            className="flex items-center space-x-1"
          >
            <ExternalLink className="h-3 w-3" />
            <span>Source</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatasetCard;
