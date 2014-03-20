from django.db import models
from datetime import datetime


PROVINCE_CHOICES = (
    ('AB','Alberta'),
    ('BC','British Columbia'),
    ('MB','Manitoba'),
    ('NB','New Brunswick'),
    ('NL','Newfoundland and Labrador'),
    ('NT','Northwest Territories'),
    ('NS','Nova Scotia'),
    ('NU','Nunavut'),
    ('ON','Ontario'),
    ('PE','Prince Edward Island'),
    ('QC','Quebec'),
    ('SK','Saskatchewan'),
    ('YT','Yukon'),
)

YESNO_CHOICES = (
    ('Y','Yes'),
    ('N','No'),
)

class Venue(models.Model):
    name                =   models.CharField(max_length=200)
    address             =   models.CharField(max_length=200, blank=True)
    city                =   models.CharField(max_length=200, blank=True)
    province            =   models.CharField(max_length=2, choices=PROVINCE_CHOICES, blank=True)
    phone               =   models.CharField(max_length=10, blank=True)
    website             =   models.URLField(blank=True,default='http://www.')

    def __unicode__(self):
        return unicode(self.name)

class Band(models.Model):
    name                = models.CharField(max_length=200)
    website             = models.URLField(blank=True,default='http://www.')
    contactInfo         = models.CharField(max_length=200, blank=True)

    def __unicode__(self):
        return unicode(self.name)

class Gig(models.Model):
    venue               = models.ForeignKey('Venue')
    gigTime             = models.DateTimeField(default=datetime.now())
    displayGig          = models.CharField(max_length=1,choices=YESNO_CHOICES,default='Yes')
    band                = models.ForeignKey('Band')
    otherBands          = models.CharField(max_length=200,blank=True)
    pay                 = models.IntegerField(default=0, blank=True, null=True)
    posterLink          = models.CharField(max_length=200,blank=True)
    purchaseLink        = models.CharField(max_length=200,blank=True)
    displayComments     = models.CharField(max_length=1,choices=YESNO_CHOICES,default='No')
    comments            = models.TextField(blank=True)
    whoIsPlaying        = models.CharField(max_length=200,blank=True)

    @property
    def futureShowTime(gigTime):
       if gigTime > datetime.today():
           return gigTime
       else:
           return None

    def __unicode__(self):
        return unicode(self.gigTime)
