#!/usr/bin/env bash
# ==============================
# Render startup script
# ==============================

echo " Applying migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput
echo " Importing data..."
python - <<'PYCODE'
python manage.py shell <<EOF
import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "gestion_donnee.settings")
django.setup()
from recup_donnee.services.MesServices import ImportateurDatasets
try:
    importateur = ImportateurDatasets()
    resultats = importateur.importer_donnees("fleuve-saint-laurent")
    print(" Données importées avec succès :", resultats)
except Exception as e:
    print(" Erreur lors de l'importation :", e)
PYCODE

echo " Starting Gunicorn..."
gunicorn gestion_donnee.wsgi:application --bind 0.0.0.0:$PORT
