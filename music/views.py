from django.shortcuts import render_to_response, render, get_object_or_404
from django.template import RequestContext
from music.models import Album, Song

def Music(request):
    #homepage = Blog.objects.filter()
    albums = Album.objects.all()
    context = {'albums' : albums}
    return render_to_response('albums.html',context,context_instance=RequestContext(request))

def MusicDetail(request):
    songs = Song.objects.all().order_by('trackNumber')
    albums = get_object_or_404(Album, pk=id)
    return render(request, 'albums.html', {'songs': songs, 'albums': albums})

#need to make it so that we can view a single gig.  Use the example beers.  ex:  beers/1/  is for Propeller. beers/2/ is for Molson  etc.