from django.db import models

class Dataset(models.Model):
    name_of_dataverse = models.CharField("Nom", max_length=500)
    identifier_of_dataverse = models.CharField("Identifiant Dataverse", max_length=255, default="UNKNOWN")
    url = models.URLField("URL")
    description = models.TextField("Description", blank=True, null=True)
    keywords = models.TextField("Mots-clés", blank=True, null=True)
    subjects = models.TextField("Sujets", blank=True, null=True)
    authors = models.TextField("Auteurs", blank=True, null=True)

    def __str__(self):
        return self.name_of_dataverse  

    class Meta:
        verbose_name = "Jeu de données"
        verbose_name_plural = "Jeux de données"

class Contact(models.Model):
    name = models.CharField("Nom", max_length=255)
    affiliation = models.CharField("Affiliation", max_length=500, blank=True, null=True)
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name='contacts')

    def __str__(self):
        return f"{self.name} ({self.affiliation})" if self.affiliation else self.name


class Publication(models.Model):
    citation = models.TextField("Citation")
    url = models.URLField("URL", blank=True, null=True)
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name='publications')

    def __str__(self):
        return self.citation[:100] + "..." if len(self.citation) > 100 else self.citation

class DateInfo(models.Model):
    created_at = models.DateTimeField("Date de création")
    updated_at = models.DateTimeField("Date de modification")
    published_at = models.DateTimeField("Date de publication")
    dataset = models.OneToOneField(Dataset, on_delete=models.CASCADE, related_name='date_info')

    def __str__(self):
        return f"Dates - {self.published_at.strftime('%Y-%m-%d')}"
    class Meta:
        verbose_name = "Date"
        verbose_name_plural = "Dates"
class HarvestConfig(models.Model):
    source_url = models.URLField("Source de moissonnage")
    frequency = models.CharField("Fréquence", max_length=100, help_text="Ex: quotidienne, hebdomadaire")
    filters = models.TextField("Filtres appliqués", blank=True, null=True)
    active = models.BooleanField("Actif", default=True)

    def __str__(self):
        return f"{self.source_url} ({'Actif' if self.active else 'Inactif'})"

    class Meta:
        verbose_name = "Moissonnage"
        verbose_name_plural = "Moissonnages"