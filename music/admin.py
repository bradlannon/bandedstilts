from django.contrib import admin
from music.models import Album, Song

class AlbumAdmin(admin.ModelAdmin):
    list_display = ('title','type','date','albumComments')

class SongAdmin(admin.ModelAdmin):
    list_display = ('title','album','trackNumber','lyrics','musicians','comments')

admin.site.register(Song,SongAdmin)
admin.site.register(Album,AlbumAdmin)
