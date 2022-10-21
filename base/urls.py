from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name="home"),
    path('canvas', views.canvas, name="canvas"),
    path('finalize', views.finalize, name="finalize"),
]