from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'base/home.html')

def canvas(request):
    context = {'time': 0, 'frame': 0}

    if request.method == 'POST':
        context['time'] = request.POST['time']
        context['frame'] = request.POST['frame']
        return render(request, 'base/canvas.html', context)
    return render(request, 'base/canvas.html')