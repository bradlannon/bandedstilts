from django.db import models

class Page(models.Model):
    title = models.CharField(max_length=50)
    slug = models.SlugField(unique=True)
    content = models.TextField(blank=True)
    tags = models.CharField(max_length=200, blank=True)

    def __unicode__(self):
        return self.title
