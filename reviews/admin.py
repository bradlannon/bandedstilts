from django.contrib import admin
from reviews.models import Review

class ReviewAdmin(admin.ModelAdmin):
    search_fields = ('title',)
    list_display = ('company','title','website','displayPress','dateTime')

#class TinyMCEAdmin(admin.ModelAdmin):
#        class Media:
#                js = ('tinymce/media/tiny_mce/tiny_mce.js', 'tinymce/media/tiny_mce/textareas.js',)

admin.site.register(Review, ReviewAdmin)
#admin.site.register(HomePage, TinyMCEAdmin)