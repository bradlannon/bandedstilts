from django.shortcuts import render_to_response, render, get_object_or_404
from django.template import RequestContext
from gallery.models import Gallery

def Gallery(request):
    #homepage = Blog.objects.filter()
    gallery = Gallery.objects.all().order_by('-dateTime')
    context = {'gallery' : gallery}
    return render_to_response('gallery.html',context,context_instance=RequestContext(request))