# Projet_React_Typescript_data_visualization

## Description

Tableau de bord front-end moderne, prêt pour la production, développé avec **React** et **TypeScript**. L'application consomme des **API REST et GraphQL** afin de permettre l'exploration, le filtrage et la visualisation de données via des graphiques interactifs, avec possibilité d'exporter des rapports en **PDF**.

Ce projet met l'accent sur une architecture propre, une expérience utilisateur fluide et des bonnes pratiques de développement front-end.

---

## Fonctionnalités principales

* ✅ Authentification et gestion du profil utilisateur
* ✅ Récupération de données depuis des API REST et GraphQL
* ✅ Gestion de l'état global avec Redux Toolkit
* ✅ Filtres dynamiques (mots-clés, organisations, localisations)
* ✅ Visualisation des données avec graphiques interactifs (barres, lignes, circulaires)
* ✅ Exportation de graphiques et de rapports en PDF
* ✅ Interface utilisateur moderne et responsive

---

## Technologies utilisées

### Front-end

* **React 18** (avec TypeScript)
* **Vite** – Build tool rapide et moderne
* **React Router DOM** – Navigation et routage
* **Redux Toolkit** – Gestion de l'état
* **Axios** – Requêtes HTTP

### Back-end

* **Django 5.2** – Framework Python
* **Django REST Framework** – API REST
* **GraphQL (Graphene-Django)** – API GraphQL
* **MySQL** – Base de données

### Interface & Visualisation

* **ShadCN UI** – Composants UI modernes
* **Tailwind CSS** – Framework CSS
* **Lucide React** – Icônes
* **Recharts** – Graphiques et visualisation de données

### Exportation

* **jsPDF** – Génération de PDF
* **html2canvas** – Capture d'écran des graphiques


## 🚀 Installation et Exécution

### Prérequis

Avant de commencer, assurez-vous d'avoir installé :

* **Python 3.10+** - [Télécharger Python](https://www.python.org/downloads/)
* **Node.js 18+** et **npm** - [Télécharger Node.js](https://nodejs.org/)
* **MySQL** (ou SQLite pour le développement) - [Télécharger MySQL](https://www.mysql.com/downloads/)

---

### 📥 ÉTAPE 1 : Cloner le projet
```bash
git clone https://github.com/votre-username/projet-react-typescript-data-viz.git
cd projet-react-typescript-data-viz
```

---

### 🔧 ÉTAPE 2 : Configuration du Backend (Django)

#### 2.1 Aller dans le dossier backend
```bash
cd TRAVAIL_PRATIQUE_1
```

#### 2.2 Créer un environnement virtuel Python

**Sur Windows :**
```bash
python -m venv venv
venv\Scripts\activate
```

**Sur macOS/Linux :**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### 2.3 Installer les dépendances Python
```bash
pip install -r requirements.txt
```

#### 2.4 Configurer la base de données

**Option 1 : Utiliser SQLite (plus simple pour le développement)**

Dans `gestion_donnee/settings.py`, la configuration SQLite est déjà présente :
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

**Option 2 : Utiliser MySQL**

Créez d'abord la base de données :
```bash
mysql -u root -p
CREATE DATABASE gestion_donnee_db;
EXIT;
```

Puis dans `settings.py` :
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'gestion_donnee_db',
        'USER': 'root',
        'PASSWORD': 'votre_mot_de_passe',
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}
```

#### 2.5 Appliquer les migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

#### 2.6 Créer un superutilisateur (optionnel)
```bash
python manage.py createsuperuser
```

#### 2.7 Importer les données initiales
```bash
python import_data.py
```

#### 2.8 Démarrer le serveur Django
```bash
python manage.py runserver
```

✅ **Le backend Django est maintenant accessible sur :** http://127.0.0.1:8000

**Vérifications :**
- Admin Django : http://127.0.0.1:8000/admin
- API REST : http://127.0.0.1:8000/api/donnees/datasets/
- API GraphQL : http://127.0.0.1:8000/api/graphql/

---

### ⚛️ ÉTAPE 3 : Configuration du Frontend (React)

**Ouvrez un NOUVEAU terminal** (laissez Django tourner dans l'autre terminal)

#### 3.1 Aller dans le dossier frontend
```bash
cd TRAVAIL_PRATIQUE_2/frontend-tp2
```

#### 3.2 Installer les dépendances Node.js
```bash
npm install
```

⏱️ *Cela peut prendre 2-3 minutes...*

#### 3.3 Configurer les variables d'environnement

Vérifiez que le fichier `.env` existe et contient :
```env
VITE_API_URL=http://127.0.0.1:8000
```

**Si le fichier n'existe pas, créez-le :**
```bash
# Sur Windows
echo VITE_API_URL=http://127.0.0.1:8000 > .env

# Sur macOS/Linux
echo "VITE_API_URL=http://127.0.0.1:8000" > .env
```

#### 3.4 Démarrer l'application React
```bash
npm start
```

ou
```bash
npm run dev
```

✅ **Le frontend React est maintenant accessible sur :** http://localhost:3000

L'application devrait s'ouvrir automatiquement dans votre navigateur !

---

## 🌐 Utilisation de l'application

### 1️⃣ Créer un compte

1. Ouvrez http://localhost:3000
2. Cliquez sur **"S'inscrire"** ou **"Créer un compte"**
3. Remplissez le formulaire :
   - **Nom d'utilisateur** : `testuser`
   - **Email** : `test@example.com`
   - **Mot de passe** : `password123`
4. Cliquez sur **"Créer un compte"**

### 2️⃣ Se connecter

1. Entrez vos identifiants
2. Cliquez sur **"Se connecter"**
3. Vous êtes redirigé vers le **Dashboard**

### 3️⃣ Explorer les données

- **Dashboard** : Liste des datasets avec recherche et filtres
- **Statistiques** : Visualisation avec 3 graphiques interactifs
- **Profil** : Gérer vos informations personnelles

### 4️⃣ Utiliser les filtres

Sur la page Dashboard, vous pouvez filtrer par :
- **Mots-clés** : `eau`, `climat`, `environnement`
- **Organisations** : `Université`, `Ministère`
- **Localisations** : `Fleuve Saint-Laurent`, `Océan`

### 5️⃣ Exporter en PDF

1. Allez sur la page **Statistiques**
2. Cliquez sur **"Exporter en PDF"**
3. Le PDF contenant les graphiques est téléchargé automatiquement

---

## 🎯 Fonctionnalités détaillées

### Authentification
- ✅ Inscription avec validation
- ✅ Connexion sécurisée avec token JWT
- ✅ Déconnexion
- ✅ Protection des routes (accès uniquement si connecté)

### Gestion du profil (Étape 3.3)
- ✅ Affichage des informations utilisateur
- ✅ Modification de l'email
- ✅ Changement de mot de passe
- ✅ Interface sécurisée et responsive

### Récupération des données (Étape 3.4)
- ✅ Connexion aux API REST et GraphQL
- ✅ Gestion de l'état avec Redux Toolkit
- ✅ Cache des données pour optimiser les performances

### Filtres dynamiques (Étape 3.6)
- ✅ Recherche par mots-clés
- ✅ Filtrage par organisations
- ✅ Filtrage par localisations
- ✅ Combinaison de plusieurs filtres
- ✅ Réinitialisation des filtres

### Visualisation (Étape 3.7)
- ✅ Graphique à barres (Top 10 mots-clés)
- ✅ Graphique linéaire (Évolution temporelle)
- ✅ Graphique circulaire (Répartition par sujet)
- ✅ Graphiques interactifs avec Recharts

### Export PDF (Étape 3.8)
- ✅ Export des statistiques en PDF
- ✅ Inclusion des graphiques
- ✅ En-tête avec date de génération

---

## 🔧 Commandes utiles

### Backend (Django)
```bash
# Démarrer le serveur
python manage.py runserver

# Créer les migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Importer des données
python import_data.py

# Lancer les tests
python manage.py test
```

### Frontend (React)
```bash
# Démarrer en mode développement
npm start
# ou
npm run dev

# Créer le build de production
npm run build

# Prévisualiser le build
npm run preview

# Installer une nouvelle dépendance
npm install nom-du-package

# Voir les dépendances installées
npm list
```

---

## 🐛 Dépannage

### Problème : Page blanche dans le navigateur

**Solution :**
1. Ouvrez la console du navigateur (F12 → Console)
2. Vérifiez les erreurs en rouge
3. Assurez-vous que Django tourne sur http://127.0.0.1:8000

### Problème : Erreur CORS

**Solution :**
Dans `TRAVAIL_PRATIQUE_1/gestion_donnee/settings.py`, ajoutez :
```python
CORS_ALLOW_ALL_ORIGINS = True
```

Puis redémarrez Django.

### Problème : Module not found

**Solution :**
```bash
# Frontend
cd TRAVAIL_PRATIQUE_2/frontend-tp2
npm install

# Backend
cd TRAVAIL_PRATIQUE_1
pip install -r requirements.txt
```

### Problème : Port déjà utilisé

**Pour Django (port 8000) :**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

**Pour React (port 3000) :**
Changez le port dans le fichier `.env` :
```env
PORT=3001
```

---

## 📊 Aperçu des fonctionnalités

### Page de connexion
* Interface moderne et épurée
* Validation des champs
* Messages d'erreur clairs

### Dashboard
* Liste des datasets en cartes
* Recherche en temps réel
* Filtres multiples
* Pagination

### Statistiques
* 3 graphiques interactifs
* Cartes récapitulatives
* Export PDF fonctionnel
* Design responsive

### Profil utilisateur
* Affichage des informations
* Modification sécurisée
* Validation côté client et serveur

---

## 🔒 Sécurité

* ✅ Authentification par token JWT
* ✅ Protection des routes sensibles
* ✅ Validation des données côté client et serveur
* ✅ Gestion sécurisée des mots de passe
* ✅ CORS configuré correctement
* ✅ Séparation claire entre logique métier et interface

---

## 🎓 Contexte académique

**Cours :** Technologies de l'inforoute (INF37407)  
**Session :** Automne 2025  
**Institution :** UQAR (Université du Québec à Rimouski)  
**Travaux pratiques :**
- **TP1** : Backend Django avec API REST et GraphQL
- **TP2** : Frontend React avec visualisation de données

---

## 📝 Licence

Ce projet est fourni à des fins de démonstration et de portfolio académique.

---

## 👥 Auteurs

Développé par **Sokhna Tahiratou Mbaye** et **Amadou Tidiane Diallo**

📧 N'hésitez pas à nous contacter pour toute question ou collaboration.

---

## 🙏 Remerciements

* **Professeur :** Yacine Yaddaden
* **Université :** UQAR
* **Framework :** React, Django, ShadCN UI
* **Inspiration :** Projets open-source de la communauté

---

**⭐ Si ce projet vous a été utile, n'hésitez pas à lui donner une étoile sur GitHub !**