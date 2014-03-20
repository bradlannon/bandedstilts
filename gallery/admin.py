from django.contrib import admin
from gallery.models import Gallery

class galleryAdmin(admin.ModelAdmin):
    search_fields = ('image_field',)


#class TinyMCEAdmin(admin.ModelAdmin):
#        class Media:
#                js = ('tinymce/media/tiny_mce/tiny_mce.js', 'tinymce/media/tiny_mce/textareas.js',)

admin.site.register(Gallery, galleryAdmin)
#admin.site.register(HomePage, TinyMCEAdmin)
