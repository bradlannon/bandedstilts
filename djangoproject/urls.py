from django.conf.urls import patterns, include, url
import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

from dajaxice.core import dajaxice_autodiscover, dajaxice_config
dajaxice_autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
   # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    (r'^dajaxice/', include('dajaxice.urls')),
    url(dajaxice_config.dajaxice_url, include('dajaxice.urls')),
    (r'^$', 'blog.views.BlogPage'),
    (r'^tinymce/', include('tinymce.urls')),
    #(r'^gallery/', include('imagestore.urls', namespace='imagestore')),
    url(r'^blog_archive/', 'blog.views.Archive'),
    url(r'^gigs/', 'gigs.views.GigsAll'),
    url(r'^gig/(?P<id>.*)/$', 'gigs.views.Detail'),
    url(r'^blog/(?P<id>.*)/$', 'blog.views.Detail'),
    url(r'^press/(?P<id>.*)/$', 'reviews.views.Detail'),
    #url(r'^listen/', 'music.views.Music'),
    url(r'^press/', 'reviews.views.ReviewsPage'),
    url(r'^bio/', 'pages.views.MainBioPage'),
    url(r'^video/', 'pages.views.MainVideoPage'),
    url(r'^gallery/', 'pages.views.MainGalleryPage'),
    url(r'^contact/', 'pages.views.MainContactPage'),
    url(r'^listen/', 'pages.views.MainListenPage'),
    url(r'^demo/', 'pages.views.DemoPage'),
    url(r'^error/', 'pages.views.ErrorPage'),
    url(r'^player/', 'pages.views.PlayerPage'),
    url(r'^mplayer/', 'pages.views.MPlayerPage'),
)

urlpatterns += staticfiles_urlpatterns()