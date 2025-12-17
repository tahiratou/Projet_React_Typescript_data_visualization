// Types pour les datasets basés sur votre API Django
export interface Contact {
  id: number;
  name: string;
  affiliation: string | null;
}

export interface Publication {
  id: number;
  citation: string;
  url: string | null;
}

export interface DateInfo {
  created_at: string;
  updated_at: string;
  published_at: string;
}

export interface Dataset {
  id: number;
  name_of_dataverse: string;
  identifier_of_dataverse: string;
  url: string;
  description: string | null;
  keywords: string | null;
  subjects: string | null;
  authors: string | null;
  contacts: Contact[];
  publications: Publication[];
  date_info: DateInfo | null;
}

export interface DatasetFilters {
  mots_cles?: string;
  organisations?: string;
  localisations?: string;
  langue?: string;
  search?: string;
}

export interface HarvestConfig {
  id: number;
  source_url: string;
  frequency: string;
  filters: string | null;
  active: boolean;
}
