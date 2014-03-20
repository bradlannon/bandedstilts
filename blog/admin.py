from django.contrib import admin
from blog.models import Blog

class BlogAdmin(admin.ModelAdmin):
    search_fields = ('title',)
    list_display = ('blogTime','title','tags','displayBlog')

#class TinyMCEAdmin(admin.ModelAdmin):
#        class Media:
#                js = ('tinymce/media/tiny_mce/tiny_mce.js', 'tinymce/media/tiny_mce/textareas.js',)

admin.site.register(Blog, BlogAdmin)
#admin.site.register(HomePage, TinyMCEAdmin)
