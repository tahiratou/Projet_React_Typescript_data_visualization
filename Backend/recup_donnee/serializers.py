from rest_framework import serializers
from .models import Dataset, Contact, Publication, DateInfo

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'name', 'affiliation']

class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = ['id', 'citation', 'url']

class DateInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DateInfo
        fields = ['created_at', 'updated_at', 'published_at']

class DatasetSerializer(serializers.ModelSerializer):
    contacts = ContactSerializer(many=True, read_only=True)
    publications = PublicationSerializer(many=True, read_only=True)
    date_info = DateInfoSerializer(read_only=True)

    class Meta:
        model = Dataset
        fields = [
            'id', 'name_of_dataverse', 'identifier_of_dataverse',
            'url', 'description', 'keywords', 'subjects', 'authors',
            'contacts', 'publications', 'date_info'
        ]
