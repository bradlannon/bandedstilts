from django.shortcuts import render_to_response, render, get_object_or_404
from django.template import RequestContext
from blog.models import Blog

def BlogPage(request):
    #homepage = Blog.objects.filter()
    blog = Blog.objects.all().order_by('-blogTime')[:2]
    context = {'blogs' : blog}
    return render_to_response('blog_all.html',context,context_instance=RequestContext(request))

def Detail(request, id):
    blog = get_object_or_404(Blog, pk=id)
    return render(request, 'blog.html', {'blogs': blog})

def Archive(request):
    #homepage = Blog.objects.filter()
    blog = Blog.objects.all().order_by('-blogTime')
    context = {'blogs' : blog}
    return render_to_response('blog_archive.html',context,context_instance=RequestContext(request))
