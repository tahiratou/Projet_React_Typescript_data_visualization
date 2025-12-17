import graphene
from graphene_django import DjangoObjectType
from recup_donnee.models import Dataset, Contact, Publication, DateInfo, HarvestConfig


class ContactType(DjangoObjectType):
    class Meta:
        model = Contact
        fields = ("id", "name", "affiliation", "dataset")


class PublicationType(DjangoObjectType):
    class Meta:
        model = Publication
        fields = ("id", "citation", "url", "dataset")


class DateInfoType(DjangoObjectType):
    class Meta:
        model = DateInfo
        fields = ("id", "created_at", "updated_at", "published_at", "dataset")


class HarvestConfigType(DjangoObjectType):
    class Meta:
        model = HarvestConfig
        fields = ("id", "source_url", "frequency", "filters", "active")


class DatasetType(DjangoObjectType):
    contacts = graphene.List(ContactType)
    publications = graphene.List(PublicationType)
    date_info = graphene.Field(DateInfoType)

    class Meta:
        model = Dataset
        fields = (
            "id",
            "name_of_dataverse",
            "identifier_of_dataverse",
            "url",
            "description",
            "keywords",
            "subjects",
            "authors",
        )

    def resolve_contacts(self, info):
        return self.contacts.all()

    def resolve_publications(self, info):
        return self.publications.all()

    def resolve_date_info(self, info):
        return getattr(self, "date_info", None)


class Query(graphene.ObjectType):
    all_datasets = graphene.List(DatasetType)
    dataset_by_id = graphene.Field(DatasetType, id=graphene.Int(required=True))
    all_harvests = graphene.List(HarvestConfigType)

    def resolve_all_datasets(root, info):
        return Dataset.objects.all()

    def resolve_dataset_by_id(root, info, id):
        return Dataset.objects.filter(pk=id).first()

    def resolve_all_harvests(root, info):
        return HarvestConfig.objects.all()


schema = graphene.Schema(query=Query)
