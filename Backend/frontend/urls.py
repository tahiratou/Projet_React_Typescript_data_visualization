from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='connexion'),
    path('inscription/', views.inscription, name='inscription'), 
    path('filtres/', views.filtres_donnees, name='filtres_donnees'),
     path('deconnexion/', views.deconnexion, name='deconnexion'),
]
