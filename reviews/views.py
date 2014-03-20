from django.shortcuts import render_to_response, render, get_object_or_404
from django.template import RequestContext
from reviews.models import Review

def ReviewsPage(request):
    #homepage = Blog.objects.filter()
    reviews = Review.objects.all().order_by('-dateTime')
    context = {'reviews' : reviews}
    return render_to_response('reviews.html',context,context_instance=RequestContext(request))

def Detail(request, id):
    reviews = get_object_or_404(Review, pk=id)
    return render(request, 'review_detail.html', {'reviews': reviews})
