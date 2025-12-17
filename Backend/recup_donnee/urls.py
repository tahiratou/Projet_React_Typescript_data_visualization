from django.urls import path
from .views import lister_datasets, importer_dataset, stats_view

from graphene_django.views import GraphQLView

urlpatterns = [
    path('', lister_datasets, name='liste_datasets'),
    path('importer/', importer_dataset, name='importer_dataset'),
    path('admin/recup_donnee/dataset/stats/', stats_view, name='admin-stats',
),
]
