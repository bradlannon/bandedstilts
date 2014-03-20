from django.shortcuts import render_to_response
from django.template import RequestContext
from pages.models import Page

def MainContactPage(request):
    homepage = Page.objects.get(pk=1)
    context = {'homepage' : homepage}
    return render_to_response('home.html',context,context_instance=RequestContext(request))

def MainBioPage(request):
    homepage = Page.objects.get(pk=2)
    context = {'homepage' : homepage}
    return render_to_response('home.html',context,context_instance=RequestContext(request))

def MainVideoPage(request):
    homepage = Page.objects.get(pk=3)
    context = {'homepage' : homepage}
    return render_to_response('home.html',context,context_instance=RequestContext(request))

def MainGalleryPage(request):
    homepage = Page.objects.get(pk=4)
    context = {'homepage' : homepage}
    return render_to_response('home.html',context,context_instance=RequestContext(request))

def MainListenPage(request):
    homepage = Page.objects.get(pk=5)
    context = {'homepage' : homepage}
    return render_to_response('home.html',context,context_instance=RequestContext(request))

def PlayerPage(request):
    return render_to_response('player.html')

def MPlayerPage(request):
    return render_to_response('mplayer.html')

def ErrorPage(request):
    return render_to_response('error.html')

def DemoPage(request):
    homepage = Page.objects.all()
    context = {'homepage' : homepage}
    return render_to_response('demo.html',context,context_instance=RequestContext(request))
