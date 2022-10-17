from django.shortcuts import render, redirect
from .forms import SuggestionForm

# Create your views here.
def form(request):
    form = SuggestionForm()
    context = {'form': form}

    if request.method == 'POST':
        form = SuggestionForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('home')

    return render(request, 'feedback/suggestion_form.html', context)