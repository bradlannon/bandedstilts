from django.db import models
from datetime import datetime

DISPLAY_CHOICES = (
    ('Y', 'Yes'),
    ('N', 'No'),
)

class Blog(models.Model):
    title               = models.CharField(max_length=50)
    content             = models.TextField(blank=True)
    blogTime            = models.DateTimeField(default=datetime.now())
    tags                = models.CharField(max_length=200,blank=True)
    displayBlog         = models.CharField(max_length=1, choices=DISPLAY_CHOICES,default='Yes')

    def __unicode__(self):
        return self.title

