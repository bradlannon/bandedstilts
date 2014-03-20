from django.contrib import admin
from pages.models import Page

class PageAdmin(admin.ModelAdmin):
    search_fields = ('title',)
    list_display = ('title','slug','tags',)
    prepopulated_fields = {'slug':('title',),}

#class TinyMCEAdmin(admin.ModelAdmin):
 #       class Media:
#                js = ('/static/js/tiny_mce/tiny_mce.js','/static/js/tiny_mce/tiny_mce_popup.js','/static/js/tiny_mce/tiny_mce_src.js',)

#js = ('tinymce/media/tiny_mce/tiny_mce.js', 'tinymce/media/tiny_mce/textareas.js',)

admin.site.register(Page, PageAdmin,)
#admin.site.register(HomePage, TinyMCEAdmin)
