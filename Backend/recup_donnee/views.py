from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Dataset, Contact, Publication, DateInfo
from .serializers import DatasetSerializer
from django.shortcuts import render
from collections import Counter

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def lister_datasets(request):
    """Lister tous les datasets disponibles"""
    datasets = Dataset.objects.all()
    serializer = DatasetSerializer(datasets, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def importer_dataset(request):
    """Importer un dataset"""
    serializer = DatasetSerializer(data=request.data)
    if serializer.is_valid():
        name = serializer.validated_data.get("name_of_dataverse")
        if Dataset.objects.filter(name_of_dataverse=name).exists():
            return Response(
                {"error": "Dataset déjà existant."},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def stats_view(request):
    total_datasets = Dataset.objects.count()
    total_contacts = Contact.objects.count()
    total_publications = Publication.objects.count()
    

    context = {
        'total_datasets': total_datasets,
        'total_contacts': total_contacts,
        'total_publications': total_publications,
    }
    return render(request, "admin/stats.html", context)
    