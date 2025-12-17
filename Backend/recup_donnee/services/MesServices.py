import requests
from datetime import datetime
from django.utils.timezone import make_aware
from ..models import *

class ImportateurDatasets:
    """Service pour importer les données"""
    
    def __init__(self):
        self.url_api = "https://borealisdata.ca/api/search"
    
    def appeler_api(self, recherche="fleuve-saint-laurent"):
        """Appelle l'API et retourne les données brutes"""
        try:
            print(f"Appel de l'API pour: {recherche}")
            
            response = requests.get(
                self.url_api,
                params={'q': recherche, 'type': 'dataset', 'per_page': 300},
                timeout=30
            )
            
            if response.status_code == 200:
                donnees = response.json()
                print(f"Données reçues: {len(donnees['data']['items'])} datasets")
                return donnees
            else:
                print(f" Erreur API: {response.status_code}")
                return None
                
        except Exception as e:
            print(f" Erreur: {e}")
            return None
    
    def convertir_date(self, date_str):
        """Convertit une date string en datetime"""
        if not date_str:
            return make_aware(datetime.now())
        try:
            date_str = date_str.split('.')[0] + 'Z' if '.' in date_str else date_str
            dt = datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%SZ')
            return make_aware(dt)
        except:
            return make_aware(datetime.now())
    
    def liste_vers_texte(self, liste_donnees):
        """Transforme une liste en texte simple"""
        if not liste_donnees:
            return ""
        return ', '.join([str(item) for item in liste_donnees])
    
    def importer_donnees(self, recherche="fleuve-saint-laurent"):
        resultat_api = self.appeler_api(recherche)
        if not resultat_api:
            return []
        
        items = resultat_api['data']['items']
        print(f"Import de {len(items)} datasets...")

        datasets_importes = []
        for i, item in enumerate(items, 1):
            try:
                print(f"\n--- Dataset {i}/{len(items)} ---")
                print(f"{item.get('name_of_dataverse', 'Sans titre')[:60]}...")

                dataset = Dataset.objects.create(
                    identifier_of_dataverse=item.get('identifier_of_dataverse', ''),
                    name_of_dataverse=item.get('name_of_dataverse', 'Sans titre'),
                    url=item.get('url', ''),
                    description=item.get('description', ''),
                    keywords=self.liste_vers_texte(item.get('keywords', [])),
                    subjects=self.liste_vers_texte(item.get('subjects', [])),
                    authors=self.liste_vers_texte(item.get('authors', []))
                )

                for contact_data in item.get('contacts', []):
                    Contact.objects.create(
                        name=contact_data.get('name', ''),
                        affiliation=contact_data.get('affiliation', ''),
                        dataset=dataset
                    )

                for pub_data in item.get('publications', []):
                    Publication.objects.create(
                        citation=pub_data.get('citation', ''),
                        url=pub_data.get('url', ''),
                        dataset=dataset
                    )

                DateInfo.objects.create(
                    created_at=self.convertir_date(item.get('createdAt')),
                    updated_at=self.convertir_date(item.get('updatedAt')),
                    published_at=self.convertir_date(item.get('published_at')),
                    dataset=dataset
                )

                datasets_importes.append(dataset)
                print(f"Dataset importé : {dataset.name_of_dataverse}")

            except Exception as e:
                print(f"Erreur : {e}")
                continue

        print(f"\nIMPORTATION TERMINÉE!")
        print(f"Datasets: {Dataset.objects.count()}")
        print(f"Contacts: {Contact.objects.count()}")
        print(f"Publications: {Publication.objects.count()}")
        print(f"Infos dates: {DateInfo.objects.count()}")

        return datasets_importes
