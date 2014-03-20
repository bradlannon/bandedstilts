from django.contrib import admin
from gigs.models import Gig
from gigs.models import Band
from gigs.models import Venue

class BandAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    list_display = ('name','website','contactInfo')

class VenueAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    list_display = ('name','address','city','province','phone','website',)

class GigAdmin(admin.ModelAdmin):
    search_fields = ('band',)
    list_display = ('venue','gigTime','band','otherBands','displayGig','pay','comments','whoIsPlaying')

admin.site.register(Gig,GigAdmin)
admin.site.register(Band,BandAdmin)
admin.site.register(Venue,VenueAdmin)