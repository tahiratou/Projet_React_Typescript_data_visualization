from django.urls import path
from .views import inscription_user, login_user, user_profile

urlpatterns = [
    path('inscription/', inscription_user, name='inscription'),
    path('login/', login_user, name='login'),
        path('profile/', user_profile, name='user_profile'),

]

