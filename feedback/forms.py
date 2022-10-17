from django.forms import ModelForm
from .models import Suggestion

class SuggestionForm(ModelForm):
    class Meta:
        model = Suggestion
        fields = ('subject', 'description')