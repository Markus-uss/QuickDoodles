from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.conf import settings

# Create your views here.
def form(request):
    if request.method == 'POST':
        subject = request.POST['subject']
        message = request.POST['message']
        main_subject = 'QuickDoodles: ' + subject

        send_mail(
            main_subject,
            message,
            settings.EMAIL_HOST_USER,
            [settings.EMAIL_HOST_USER],
            )

        print("EMAIL SENT")
        return redirect('home')

    return render(request, 'feedback/suggestion_form.html')