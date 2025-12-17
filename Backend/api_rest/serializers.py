from rest_framework import serializers
from recup_donnee.models import Dataset, Contact, Publication, DateInfo

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = '__all__'

class DateInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DateInfo
        fields = '__all__'

class DatasetSerializer(serializers.ModelSerializer):
    contacts = ContactSerializer(many=True, read_only=True)
    publications = PublicationSerializer(many=True, read_only=True)
    date_info = DateInfoSerializer(read_only=True)

    class Meta:
        model = Dataset
        fields = '__all__'
