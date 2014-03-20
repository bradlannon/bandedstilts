from django.shortcuts import render_to_response, render, get_object_or_404
from django.template import RequestContext
from gigs.models import Gig, Band, Venue

def GigsAll(request):
    gigs = Gig.objects.all().order_by('gigTime')
    context = {'gigs' : gigs}
    return render_to_response('gigs_all.html',context,context_instance=RequestContext(request))

def Detail(request, id):
    gig = Gig.objects.select_related('band__venue').get(id=id)
    context = {'gig' : gig }
    return render_to_response('gig.html',context, context_instance=RequestContext(request))

    #need to make it so that we can view a single gig.  Use the example beers.  ex:  beers/1/  is for Propeller. beers/2/ is for Molson  etc.