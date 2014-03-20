from django.db import models
from datetime import datetime
from embed_video.fields import EmbedVideoField

ALBUM_CHOICES = (
    ('EP','EP'),
    ('LP','LP'),
)

YESNO_CHOICES = (
    ('N','No'),
    ('Y','Yes'),
)

class Album(models.Model):
    title                   =   models.CharField(max_length=200)
    type                    =   models.CharField(max_length=2,choices=ALBUM_CHOICES)
    date                    =   models.DateField(max_length=200, default=datetime.now())
    image                   =   models.URLField(blank=True)
    displayComments         =   models.CharField(max_length=1,choices=YESNO_CHOICES,default='NO')
    albumComments           =   models.TextField(blank=True)

    def __unicode__(self):
        return unicode(self.title)

class Song(models.Model):
    title                   = models.CharField(max_length=200)
    album                   = models.ForeignKey('Album')
    trackNumber             = models.IntegerField(blank=True, null=True)
    lyrics                  = models.TextField(blank=True)
    musicians               = models.CharField(max_length=200,blank=True)
    displayComments         = models.CharField(max_length=1,choices=YESNO_CHOICES,default='NO')
    comments                = models.TextField(blank=True)
    video                   = EmbedVideoField(blank=True)  # same like models.URLField()
    html5                   = models.TextField(blank=True)

    def __unicode__(self):
        return unicode(self.title)
