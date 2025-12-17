from django.shortcuts import render, redirect
from django.contrib import messages
from django.test import RequestFactory
from users.views import inscription_user
from django.contrib.auth import logout
import requests
from django.conf import settings

API_BASE_URL = "http://127.0.0.1:8000/api/donnees/datasets/"  
GRAPHQL_URL = "http://127.0.0.1:8000/api/graphql/"

def home(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        resp = requests.post(
            request.build_absolute_uri('/api/users/login/'),
            json={'username': username, 'password': password}
        )

        if resp.status_code == 200:
            data = resp.json()
            token = data.get('token')
            request.session['token'] = token
            request.session['username'] = username
            return redirect('filtres_donnees')
        else:
            messages.error(request, "Identifiants incorrects.")
            return redirect('connexion')

    return render(request, 'frontend/login.html')

def deconnexion(request):
    request.session.flush()  # supprime toutes les données de session
    messages.success(request, "Vous êtes bien déconnecté(e).")
    return redirect('connexion')


def inscription(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        factory = RequestFactory()
        api_request = factory.post(
            '/api/users/inscription/',
            {
                'username': username,
                'email': email,
                'password': password
            },
            content_type='application/json'
        )

        response = inscription_user(api_request)

        if response.status_code == 201:
            messages.success(request, "Compte créé avec succès ! Vous pouvez vous connecter.")
            return redirect('connexion')  
        else:
            messages.error(request, "Erreur lors de la création du compte.")
            return redirect('inscription')

    return render(request, 'frontend/inscription.html')

def filtres_donnees(request):
    token = request.session.get('token')
    if not token:
        messages.warning(request, "Connectez-vous pour accéder aux filtres.")
        return redirect('connexion')

    username = request.session.get('username', 'Utilisateur')
    resultats = []

    if request.method == 'POST':
        mots_cles = request.POST.get('mots_cles', '')
        organisations = request.POST.get('organisations', '')
        authors = request.POST.get('authors', '')

        params = {}
        if mots_cles:
            params['mots_cles'] = mots_cles
        if organisations:
            params['organisations'] = organisations
        if authors:
            params['authors'] = authors

        headers = {'Authorization': f'Token {token}'}

        try:
            resp = requests.get(API_BASE_URL, headers=headers, params=params, timeout=15)
            if resp.status_code == 200:
                resultats = resp.json()  
            else:
                messages.error(request, f"Erreur REST ({resp.status_code})")
        except requests.RequestException as e:
            messages.error(request, f"Erreur de connexion REST : {e}")
            resultats = []

        if resultats:
            try:
                query = """
                {
                  allDatasets {
                    id
                    nameOfDataverse
                    authors
                    subjects
                    url
                  }
                }
                """

                gql_headers = {
                    'Authorization': f'Token {token}',
                    'Content-Type': 'application/json'
                }

                gql_resp = requests.post(GRAPHQL_URL, json={'query': query}, headers=gql_headers, timeout=15)

                if gql_resp.status_code == 200:
                    gql_data = gql_resp.json().get('data', {}).get('allDatasets', [])
                    gql_index = {d['id']: d for d in gql_data}

                    for r in resultats:
                        gql_item = gql_index.get(r.get('id'))
                        if gql_item:
                            r.update({
                                'authors': gql_item.get('authors'),
                                'subjects': gql_item.get('subjects')
                            })
                else:
                    messages.warning(request, "Impossible de contacter GraphQL, affichage REST uniquement.")
            except Exception as e:
                messages.warning(request, f"Erreur GraphQL : {e}")

    return render(request, 'frontend/filtres.html', {
        'resultats': resultats,
        'username': username,
    })
