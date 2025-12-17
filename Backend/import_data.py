# import_data.py
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "gestion_donnee.settings")
django.setup()

from recup_donnee.services.MesServices import ImportateurDatasets

try:
    importateur = ImportateurDatasets()
    resultats = importateur.importer_donnees("fleuve-saint-laurent")
    print("✅ Données importées avec succès :", resultats)
except Exception as e:
    print("⚠️ Erreur pendant l'importation :", e)


from django.contrib.auth import get_user_model
from django.core.management import call_command

User = get_user_model()

def run():
    try:
        call_command('loaddata', 'initial_data.json')
    except Exception:
        pass

    if not User.objects.filter(username="admin").exists():
        User.objects.create_superuser("admin", "admin@example.com", "admin1234")
        print("✅ Superutilisateur créé : admin / admin1234")
