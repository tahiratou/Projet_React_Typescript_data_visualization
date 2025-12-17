# recup_donnee/admin.py
from django.contrib import admin
from django.urls import path
from django.shortcuts import render
from .models import Dataset, Contact, Publication, DateInfo, HarvestConfig

@admin.register(Dataset)  # Unique enregistrement ici
class DatasetAdmin(admin.ModelAdmin):
    list_display = ('name_of_dataverse', 'identifier_of_dataverse')

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('stats/', self.admin_site.admin_view(self.stats_view), name='dataset-stats'),
        ]
        return custom_urls + urls

    def stats_view(self, request):
        total_datasets = Dataset.objects.count()
        total_contacts = Contact.objects.count()
        total_publications = Publication.objects.count()
        context = dict(
            self.admin_site.each_context(request),
            total_datasets=total_datasets,
            total_contacts=total_contacts,
            total_publications=total_publications,
        )
        return render(request, "admin/stats.html", context)

# On enregistre tous les autres modèles 
admin.site.register(Contact)
admin.site.register(Publication)
admin.site.register(DateInfo)
