from django.db import models

# Create your models here.

class Suggestion(models.Model):
    subject = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    complete = models.BooleanField(default=False)

    def __str__(self):
        return self.subject