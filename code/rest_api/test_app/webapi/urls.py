from django.urls import path
from . import views

urlpatterns = [
		path('api/compile/',views.Compile),
]
