# api_rest/views.py
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from recup_donnee.models import Dataset
from .serializers import DatasetSerializer
from django.db.models import Q
from datetime import datetime

class DatasetViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Endpoint de lecture des datasets avec filtres complets.
    
    Paramètres GET acceptés :
      - search          -> recherche globale (DRF SearchFilter)
      - mots_cles       -> recherche dans keywords
      - organisations   -> recherche dans authors
      - localisations   -> recherche dans subjects
      - catalogue       -> recherche dans subjects (catalogue spécifique)
      - thematique      -> recherche dans subjects (thématique)
      - producteur      -> recherche dans authors (producteur)
      - date_debut      -> filtre date >= date_debut
      - date_fin        -> filtre date <= date_fin
    """
    queryset = Dataset.objects.all()
    serializer_class = DatasetSerializer
    permission_classes = [IsAuthenticated]  
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    # Champs pour la recherche globale (search)
    search_fields = ['name_of_dataverse', 'authors', 'keywords', 'subjects', 'description']
    ordering_fields = ['name_of_dataverse', 'identifier_of_dataverse']

    def get_queryset(self):
        qs = super().get_queryset()
        params = self.request.query_params

        # 1. MOTS-CLÉS (keywords)
        mots_cles = params.get('mots_cles') or params.get('keywords')
        if mots_cles:
            terms = [t.strip() for t in mots_cles.split(',') if t.strip()]
            q = Q()
            for t in terms:
                q |= Q(keywords__icontains=t) | Q(name_of_dataverse__icontains=t) | Q(description__icontains=t)
            qs = qs.filter(q)

        # 2. ORGANISATIONS (authors)
        organisations = params.get('organisations')
        if organisations:
            terms = [t.strip() for t in organisations.split(',') if t.strip()]
            q = Q()
            for t in terms:
                q |= Q(authors__icontains=t)
            qs = qs.filter(q)

        # 3. LOCALISATIONS (subjects)
        localisations = params.get('localisations')
        if localisations:
            terms = [t.strip() for t in localisations.split(',') if t.strip()]
            q = Q()
            for t in terms:
                q |= Q(subjects__icontains=t)
            qs = qs.filter(q)

        # 4. CATALOGUE (subjects - filtre par catalogue)
        catalogue = params.get('catalogue')
        if catalogue:
            # Mapper les valeurs frontend aux termes dans la base
            catalogue_mapping = {
                'fleuve-saint-laurent': ['saint-laurent', 'saint laurent', 'st-laurent', 'st laurent', 'fleuve'],
                'ocean-atlantique': ['atlantique', 'atlantic'],
                'grands-lacs': ['grands lacs', 'great lakes', 'lacs'],
                'arctique': ['arctique', 'arctic', 'nord'],
            }
            
            search_terms = catalogue_mapping.get(catalogue, [catalogue])
            q = Q()
            for term in search_terms:
                q |= Q(subjects__icontains=term) | Q(keywords__icontains=term) | Q(description__icontains=term)
            qs = qs.filter(q)

        # 5. THÉMATIQUE (subjects - filtre par thématique)
        thematique = params.get('thematique')
        if thematique:
            # Mapper les valeurs frontend aux termes dans la base
            thematique_mapping = {
                'environnement': ['environnement', 'environment', 'écologie', 'ecology'],
                'biologie': ['biologie', 'biology', 'biodiversité', 'biodiversity'],
                'climat': ['climat', 'climate', 'météo', 'weather'],
                'oceanographie': ['océanographie', 'oceanography', 'océan', 'ocean'],
                'chimie': ['chimie', 'chemistry', 'chimique', 'chemical'],
            }
            
            search_terms = thematique_mapping.get(thematique, [thematique])
            q = Q()
            for term in search_terms:
                q |= Q(subjects__icontains=term) | Q(keywords__icontains=term) | Q(description__icontains=term)
            qs = qs.filter(q)

        # 6. PRODUCTEUR (authors - producteur de données)
        producteur = params.get('producteur')
        if producteur:
            qs = qs.filter(Q(authors__icontains=producteur))

        # 7. DATE DÉBUT (filtre sur date_info__published_at)
        date_debut = params.get('date_debut')
        if date_debut:
            try:
                # Convertir la date string en objet date
                date_debut_obj = datetime.strptime(date_debut, '%Y-%m-%d').date()
                # Filtrer les datasets dont la date de publication >= date_debut
                qs = qs.filter(date_info__published_at__gte=date_debut_obj)
            except (ValueError, TypeError):
                pass  # Ignorer si le format de date est invalide

        # 8. DATE FIN (filtre sur date_info__published_at)
        date_fin = params.get('date_fin')
        if date_fin:
            try:
                # Convertir la date string en objet date
                date_fin_obj = datetime.strptime(date_fin, '%Y-%m-%d').date()
                # Filtrer les datasets dont la date de publication <= date_fin
                qs = qs.filter(date_info__published_at__lte=date_fin_obj)
            except (ValueError, TypeError):
                pass  # Ignorer si le format de date est invalide

        return qs.distinct()