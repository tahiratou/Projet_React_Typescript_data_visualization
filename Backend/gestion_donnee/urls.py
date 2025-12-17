from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from graphene_django.views import GraphQLView
from api_graphql.schema import schema

schema_view = get_schema_view(
    openapi.Info(
        title="API Données Borealis",
        default_version='v1',
        description="Documentation interactive de l'API pour le projet de moissonnage et d'importation des données",
        contact=openapi.Contact(email="admin@gmail.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/users/', include('users.urls')),
    path('api/datasets/', include('recup_donnee.urls')),
    path('api/donnees/', include('api_rest.urls')),

    path('', include('frontend.urls')),

    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    path('api/', include('api_graphql.urls')), 

]
