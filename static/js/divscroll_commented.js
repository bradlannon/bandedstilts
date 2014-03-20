/*

DHTML SCROLLER v4.0 RC (c) 2001-2006 Angus Turnbull, http://www.twinhelix.com
Altering this notice or redistributing this file is prohibited.

*/



// This is the full, commented script file, to use for reference purposes or if you feel
// like tweaking anything. I used the "CodeTrimmer" utility availble from my site
// (under 'Miscellaneous' scripts) to trim the comments out of this JS file.



// *** COMMON CROSS-BROWSER COMPATIBILITY CODE ***


// This is taken from the "Modular Layer API" available on my site.
// See that for the readme if you are extending this part of the script.

var isDOM=document.getElementById?1:0,
 isIE=document.all?1:0,
 isNS4=navigator.appName=='Netscape'&&!isDOM?1:0,
 isIE4=isIE&&!isDOM?1:0,
 isOp=self.opera?1:0,
 isDyn=isDOM||isIE||isNS4;

function getRef(i, p)
{
 p=!p?document:p.navigator?p.document:p;
 return isIE ? p.all[i] :
  isDOM ? (p.getElementById?p:p.ownerDocument).getElementById(i) :
  isNS4 ? p.layers[i] : null;
};

function getSty(i, p)
{
 var r=getRef(i, p);
 return r?isNS4?r:r.style:null;
};

if (!self.LayerObj) var LayerObj = new Function('i', 'p',
 'this.ref=getRef(i, p); this.sty=getSty(i, p); return this');
function getLyr(i, p) { return new LayerObj(i, p) };

function LyrFn(n, f)
{
 LayerObj.prototype[n] = new Function('var a=arguments,p=a[0],px=isNS4||isOp?0:"px"; ' +
  'with (this) { '+f+' }');
};
LyrFn('x','if (!isNaN(p)) sty.left=p+px; else return parseInt(sty.left)');
LyrFn('y','if (!isNaN(p)) sty.top=p+px; else return parseInt(sty.top)');
LyrFn('w','if (p) (isNS4?sty.clip:sty).width=p+px; ' +
 'else return (isNS4?ref.document.width:ref.offsetWidth)');
LyrFn('h','if (p) (isNS4?sty.clip:sty).height=p+px; ' +
 'else return (isNS4?ref.document.height:ref.offsetHeight)');
LyrFn('vis','sty.visibility=p');
LyrFn('clip','if (isNS4) with(sty.clip){left=a[0];top=a[1];right=a[2];bottom=a[3]} ' +
 'else sty.clip="rect("+a[1]+"px "+a[2]+"px "+a[3]+"px "+a[0]+"px)" ');

if (!self.page) var page = { win:self, minW:0, minH:0, MS:isIE&&!isOp };

page.db = function(p) { with (this.win.document) return (isDOM?documentElement[p]:0)||body[p]||0 };

page.winW=function() { with (this) return Math.max(minW, MS ? db('clientWidth') : win.innerWidth) };
page.winH=function() { with (this) return Math.max(minH, MS ? db('clientHeight') : win.innerHeight) };

page.scrollY=function() { with (this) return MS ? db('scrollTop') : win.pageYOffset };

page.elmPos=function(e,p)
{
 var x=0,y=0,w=p?p:this.win;
 e=e?(e.substr?(isNS4?w.document.anchors[e]:getRef(e,w)):e):p;
 if(isNS4){if(e&&(e!=p)){x=e.x;y=e.y};if(p){x+=p.pageX;y+=p.pageY}}
 if (e && this.MS && navigator.platform.indexOf('Mac')>-1 && e.tagName=='A')
 {
  e.onfocus = new Function('with(event){self.tmpX=clientX-offsetX;' +
   'self.tmpY=clientY-offsetY}');
  e.focus();x=tmpX;y=tmpY;e.blur()
 }
 else while(e){x+=e.offsetLeft;y+=e.offsetTop;e=e.offsetParent}
 return{x:x,y:y};
};



// *** SCROLLER OBJECT CONSTRUCTOR FUNCTIONS ***


// This takes arrays of data and names and assigns the values to a specified object.
function addProps(obj, data, names, addNull)
{
 for (var i = 0; i < names.length; i++) if(i < data.length || addNull) obj[names[i]] = data[i];
};


// The function to create the data structure for the scroller divs.
function ScrDiv()
{
 addProps(this, arguments, ['id','x','y','w','h','v','par','lyr'], true);
};


// Main object of which instances are created.
function DHTMLScroller()
{
 // Only the first is actually passed to the function, the rest are just added as 'undefined'.
 var names = ['myName', 'loadingFile', 'loadedFile', 'loadedHTML', 'bookmark',
  'buf', 'div', 'bar', 'thm', 'loaded', 'timer', 'loadFix', 'noXFrame',
  'divHeight', 'thmHeight', 'barHeight', 'cHeight', 'cWidth', 'dragOffset',
  'onbeforeload', 'onload', 'onscroll', 'onsetup', 'onlayout', 'onthumbdown', 'onthumbup'];
 addProps(this, arguments, names, true);

 // The top clipping position by default is zero, the top of the file.
 this.cTop = 0;

 // Scroller history setup, an array of data and current position.
 this.history = new Array();
 this.histPos = -1;

 // Array of objects to move when the window is resized (e.g. scrollbar, arrows).
 this.divs = new Array();

 // Minimum height of scrollbar thumb, defaults to 20, set to something else if you want.
 this.minThmHeight = 20;
 // Maximum height.
 this.maxThmHeight = 9999;

 // Padding at the top and bottom -- set these manually if you want.
 this.padTop = this.padBot = 0;
 // Whether or not to allow scrolling out of the normal region.
 this.checkBounds = true;

 // Current speed of the scroller, and the steps left to reach that speed.
 this.ySpeed = this.stepsLeft = 0;

 // The 'stickiness' of the scroller, 1 means perfect scrolling, decimals = floating.
 this.stick = 1;
 // Target point to which we scroll, and a timer variable managing sticky scroll.
 this.stickTop = 0;

 // Add this scroller to our list for activation.
 DHTMLScroller.list[this.myName] = this;
};

// The list of declared scroller objects.
DHTMLScroller.list = {};

// One global variable that points to the scroller currently being dragged.
// It's used by the thumb move/up functions which are not part of the object above.
var activeScr = null;

// A quick reference to speed things up.
var DsPt = DHTMLScroller.prototype;



// *** LOAD FILES INTO DIV FUNCTIONS ***


DsPt.load = function(fName) { with (this)
{
 if (!fName || fName=='#' || !loaded || !isDyn) return;

 // Detect whether we've been passed a "file#bookmark" URL, and if we need to load anything new.
 if (fName.match(/^(.*)#(.*)$/))
 {
  var r = RegExp;
  bookmark = r.$2;
  // Skip straight to the loaded routine if this bookmark is in the currently loaded file.
  if (!r.$1 || r.$1 == loadedFile) { fileLoaded(); return }
  fName = r.$1;
 }
 else bookmark = '';

 // Otherwise, set this as the currently loading file, and fire the 'onbeforeload' event.
 loadingFile = fName;
 if (onbeforeload) onbeforeload();

 // History -- if we're moving to a new location, add it to the history.
 if (fName != history[histPos])
 {
  histPos++;
  history[histPos] = fName;
  history.length = histPos + 1;
 }

 // Opera 5 and 6 will throw errors, might as well quit gracefully.
 if (isOp && !document.documentElement) { fileLoaded(); return }

 // v7 seems to load, but 7.01 and higher throw security errors when accessing the
 // buf.document object, so I have to use the DOM-ish contentDocument property.
 // I hope other DHTML-capable browsers will handle the rest of the load routine :).

 // Trigger a file load in IE/NS6+/etc, that calls the 'fileLoaded()' function when complete.
 if (isIE || isDOM) with (isOp ? getRef(myName+'Buf').contentDocument : buf.document)
 {
  // In supported browsers (IE, Opera, KHTML), use a .readyState checking loop.
  // I've found this better than the nested-frame approach in Safari at least.
  if (document.readyState)
  {
   location.href = fName;
   setTimeout(myName + '.checkState()', 100);
  }
  else
  {
   // Write a small HTML document with a nested IFRAME and an "onload" handler.
   write('<html><body onload="setTimeout(\'parent.' + myName + '.swapContent()\', 100)">' +
    '<iframe name="nestBuf" src="' + fName + '"></iframe></body></html>');
   close();
   // In early versions of NS6 (and others e.g. Opera7b1), the nested IFrame is not invoked and
   // the onload event isn't fired. So we set the normal location and give it 5 secs to load.
   // Yeah, it's a nasty hack, but there really isn't another cross-browser way to handle it,
   if (!buf.nestBuf)
   {
    buf.location.href = fName;
    setTimeout(myName + '.swapContent()', 5000);
   }
  }
 }
 else if (isNS4)
 {
  // NS4-specific file loading routine.
  // Use a delay if needed, as weirdly it won't do concurrent loads.
  if (window.ns4LayerLoading)
  {
   setTimeout(myName + '.load("' + fName + '")', 100);
   return;
  }
  window.ns4LayerLoading = true;

  // Otherwise: on load, clear loading flag and scroll to top.
  div.ref.onload = new Function(myName + '.fileLoaded()');
  // Netscape's load(URL, width) method...
  div.ref.load(fName, eval(divs[0].w));
 }
 return;
}};

DsPt.checkState = function() { with (this)
{
 // This will periodically check the IFRAME's .readyState property, in supported browsers.
 // Same Opera 7 hack as above.
 var b = isOp ? getRef(myName+'Buf').contentDocument : buf.document;
 if (b.location.href != 'about:blank' && b.readyState == 'complete') swapContent();
 else setTimeout(myName + '.checkState()', 50);
}};

DsPt.swapContent = function() { with (this)
{
 // In IE or NS6, shift the contents of the IFrame buffer into the DIV.
 // Detect if we're not using the nested IFrame (i.e. our NS6 kludge).
 var bufDoc = buf.nestBuf ? buf.nestBuf.document : buf.document;
 if (bufDoc && bufDoc.body)
 {
  loadedHTML = bufDoc.body.innerHTML;
  buf.location.replace('about:blank');
  // I know what you're thinking, why use a first timeout here of all places?
  // Otherwise, if you swap the content BEFORE the IFrame, early Mozilla versions will forget
  // all onclick/mouse/etc events in the loaded file! This seems to fix it though.
  // Then call the fileLoaded() function to continue, on a second timeout.
  setTimeout('with(' + myName + ') { div.ref.innerHTML=loadedHTML; ' +
   'setTimeout("' + myName + '.fileLoaded()", 100) }', 1);
 }
}};


DsPt.fileLoaded = function() { with (this)
{
 // Stop dragging any scroller while we switch files.
 activeScr = null;

 if (isNS4)
 {
  // Clear the NS4 file loading flag.
  window.ns4LayerLoading = false;
  // NS4 scroller link parsing... capture click on all links in the scroll area.
  var tags = div.ref.document.links;
  for (var i in tags)
  {
   // Backup the preceding event, and watch for onclick="return false" in said event.
   tags[i].scrOC = tags[i].onclick;
   tags[i].onclick = new Function('return (!(this.scrOC?this.scrOC()==false:0)) &&' +
    myName + '.checkURI(this.href)');
  }
 }

 // Set the loaded file as the one we've just loaded.
 loadedFile = loadingFile;

 // XFrame support: If enabled for each scroller object, build a new location hash string with
 // the URLs of any enabled scroller objects in the document.
 var xfr = '', DSL = DHTMLScroller.list;
 for (var s in DSL) if (!DSL[s].noXFrame && DSL[s].loadedFile) xfr += ',' + DSL[s].myName + '=' +
  DSL[s].loadedFile;
 // Changing the regular location resulted in MozillaFirebird dying for me. NS4's way too buggy,
 // and Safari misbehaves, so it looks like I can only really enable this in IE (Opera 7 is OK).
 // Also, don't set the hash if there's already a frames() in the CGI query string,
 // or if this scroller specifically has XFrame support disabled.
 if (xfr && isIE && !noXFrame && location.search.indexOf('frames(') < 0)
  location.hash = 'frames(' + xfr.substring(1) + ')';


 // Call the layout function to handle div visibility (depending on content dimensions etc.)
 layout();

 // The new scroll position will be the bookmark position less the scroller div position,
 // otherwise zero if that can't be found (i.e. back to top of new document).
 // Use getElementsByName() as many people have <a name> tags without IDs in documents.
 var newPos = 0;
 if (isDOM) bookmark = document.getElementsByName(bookmark)[0];
 if (bookmark)
 {
  newPos = page.elmPos(bookmark, div.ref).y;
  // Check... if it's an invalid bookmark, leave the scroll position at zero.
  if (newPos) newPos -= page.elmPos(null, div.ref).y;
 }

 // Scroll to the new position and fire the 'onload' event while we're at it.
 scrollTo(newPos);
 if (onload) onload();
}};


// History loading function -- cycles through history[] array.
DsPt.go = function(dir) { with (this)
{
 histPos += dir;
 if (histPos < 0) { histPos = 0; return }
 if (histPos >= history.length) { histPos = history.length - 1; return }
 load(history[histPos]);
}};


// Auto Link Loading -- parse clicks on document links, load the right ones in scroller.
DsPt.checkURI = function(uri) { with (this)
{
 // Check if we have a URI, and that it's loadable (from the same domain?)
 // We either allow URLs with no colon (like 'file.html') or enforce a proper URL.
 if (uri && (uri.indexOf(':')<0 || uri.match(new RegExp(location.hostname ?
  '^(file|http.?):\/\/[^\/]*' + location.hostname : '^file:'))))
 {
  // Next, we need to parse #bookmark URIs which come in as divscroll.html#bookmark,
  // so retrieve the proper filename from the current URI (minus existing bookmark).
  var hashPos = location.href.indexOf('#');
  if (hashPos == -1) hashPos = 9999;
  var locPath = location.href.substring(0, hashPos), r = RegExp;
  // Check for (1) a valid hash and (2) it's pointing at the current document.
  if (uri.match(/(.*)#(.*)/) && (!r.$1 || locPath == r.$1))
  {
   if (r.$2) load('#'+r.$2);
  }
  // Otherwise, to be safe, let the load() method handle the whole original URI.
  else load(uri);
  // Either way, we've loaded something, so cancel the click event.
  return false;
 }
 // ...or return true if we didn't load anything.
 return true;
}};




// *** DIV SCROLLING FUNCTIONS ***


DsPt.scrollTo = function(pos, isStick) { with (this)
{
 if (!isDyn || !loaded) return;

 // Record new top value as scroller object property.
 cTop = pos;

 // If this isn't a sticky scroll, set the target position to the current position.
 // Otherwise whenever you click the arrows, the scroller slides back again...
 if (!isStick) stickTop = cTop;

 // Height of div, plus padding - update here as it may change often.
 divHeight = div.h() + padTop + padBot;
 // Stops 'divide by zero'
 if (divHeight == 0) divHeight = 1;

 // Should we check if we're scrolling out of range? If so, return to top/bottom.
 if (checkBounds)
 {
  if (cTop + cHeight > divHeight) cTop = divHeight - cHeight;
  if (cTop < 0) cTop = 0;
 }

 // Move div up/down... 'scrolling' div.
 div.y(0 - cTop + padTop);


 // Define its height as the percentage of the clipping height vs div height.
 // Best to set it here as divHeight may change as images load etc.
 thmHeight = Math.ceil(barHeight * (cHeight / divHeight));

 // Ensure the thumb is between its min/max heights, and fits within the scrollbar.
 with (Math) thmHeight = min(barHeight, min(maxThmHeight, max(thmHeight, minThmHeight)));

 // Assign the thumb its calculated height if we're not sticky-scrolling.
 thm.h(thmHeight);

 // Now is a good time to fire the 'onscroll' event if it exists.
 if (onscroll) onscroll();

 // Adjust scrollbar thumb position only if we're not dragging / sticky-scrolling.
 if (activeScr || isStick) return;

 // What fraction is the div of its total scrolling range? 0=top, 1=bottom.
 var fracDivDown = (cTop / (divHeight - cHeight));
 // Now, multiply that by the available space to move and assign its top.
 thm.y(bar.y() + fracDivDown * (barHeight - thmHeight));
}};


DsPt.scrollBy = function(amount) { with (this)
{
 // Scroll to the old location plus however much we're scrolling by.
 scrollTo(cTop + amount);
}};


// Accelerates to a specified scrolling speed over a perios of time.
DsPt.setScroll = function(newSpeed, steps) { with (this)
{
 if (!loaded) return;

 // Alter scroller velocity in steps to the new speed, set timer interval.
 stepsLeft = steps;

 // Clear the timer here -- so sticky scrolling or another setScroll() stops.
 if (timer) clearInterval(timer);
 timer = setInterval('with (' + myName + ') { ' +
  'if (stepsLeft > 0) { ySpeed += ' + ((newSpeed-ySpeed)/steps) + '; stepsLeft-- } ' +
  'else if (parseInt(ySpeed)==0) {clearInterval(timer);timer=null} scrollBy(ySpeed) }', 50);
}};



// *** SCROLL THUMB DRAGGING EVENT HANDLERS ***


DsPt.thumbDown = function(evt) { with (this)
{
 // Find the correct event object.
 var evt = evt?evt:window.event;

 // Set the global variable pointing to the active scroller - this scroller object.
 activeScr = this;

 // Offset of mouse cursor within the scrollbar...
 dragOffset = (isNS4 ? evt.pageY : page.scrollY()+evt.clientY) - thm.y();

 // Fire the 'onthumbdown' event if it exists.
 if (onthumbdown) onthumbdown();

 // Clear either the sticky scroll or setScroll() interval, to be reset on mousemove.
 if (timer) clearInterval(timer);
 timer = null;

 return false;
}};


// These are global functions, not part of a particular scroller object.
window.scrThumbMove = function(evt)
{
 var evt = evt?evt:window.event;

 // Either return true if no scroller is being dragged (so selections work), or if
 // it's NS4 just route the event...
 if (!activeScr) return true;
 else with (activeScr)
 {
  // If it's not scrollable, quit.
  if ((cTop + cHeight > divHeight) || (thmHeight == barHeight)) return true;

  // Calculate the new position of the thumb within the scrollbar (0 = at the top).
  var thmTop = (isNS4 ? evt.pageY : page.scrollY() + evt.clientY) - dragOffset - bar.y();

  // Test if the thumb is out of range, if so, bring it back, then assign its position.
  if (thmTop < 0) thmTop = 0;
  if (thmTop + thmHeight > barHeight) thmTop = barHeight - thmHeight;
  thm.y(bar.y() + thmTop);

  // Set the new position as the target top value for the sticky scroll routine.
  stickTop = (divHeight - cHeight) * (thmTop / (barHeight - thmHeight));

  // If sticky scrolling is off, scroll now, otherwise set interval as needed.
  if (stick == 1) scrollTo(stickTop);
  else if (!timer) timer = setInterval(myName + '.stickScroll()', 40);

  return false;
 }
};

window.scrThumbUp = function(evt)
{
 // Fire the 'onthumbup' event if it exists.
 // N.B. Leave the sticky-scroll interval active.
 if (activeScr) with (activeScr) if (onthumbup) onthumbup();

 // Clear the active scroller global variable.
 activeScr = null;
};


DsPt.stickScroll = function() { with (this)
{
 // If we're way off, scroll by the stickiness factor in the correct direction.
 if (Math.abs(cTop - stickTop) > 1)
 {
  cTop += (stickTop - cTop) * stick;
  scrollTo(cTop, true);
 }
 else if (cTop != stickTop)
 {
  // Otherwise if there's only 1px to go, scroll to the exact point, and call it done.
  cTop = stickTop;
  scrollTo(cTop, true);
 }
}};



// *** SCROLLBAR BACKGROUND CLICK EVENT HANDLER ***


DsPt.barClick = function(evt) { with (this)
{
 // Get the correct event object, and retrieve the click position.
 var evt = evt?evt:window.event;

 clickPos = isNS4 ? evt.pageY : page.scrollY()+evt.clientY;

 // Now get the proper relative-to-page thumb position.
 var thmY = page.elmPos(null, thm.ref).y;

 // Page up, or page down?
 if (clickPos < thmY) scrollBy(0 - cHeight);
 if (clickPos > (thmY + thmHeight)) scrollBy(cHeight);

 if (isNS4) return document.routeEvent(evt);
}};



// *** LAYOUT HANDLER FOR WINDOW RESIZE ETC ***


DsPt.layout = function() { with (this)
{
 if (!isDyn || !loaded) return;

 // Bar height and clipping dimensions, accessed often so stored as object properties.
 barHeight = eval(divs[1].h);
 cWidth = eval(divs[0].w);
 cHeight = eval(divs[0].h);

 // Clip the outer content div appropriately to our scroll area size.
 divs[0].lyr.clip(0, 0, cWidth, cHeight);
 // Allow the inner content div to show, and set its width (to help Opera 7 mostly).
 div.vis('inherit');
 div.w(cWidth);

 // Decide whether the content is smaller than the scroller area.
 var isSmall = (div.h() < cHeight);

 // Loop through divs array, positioning/sizing controls.
 for (var i = 0; i < divs.length; i++) with (divs[i].lyr)
 {
  // Position & dimension. Don't let the width and height get below 0.
  x(eval(divs[i].x)); w(Math.max(0,eval(divs[i].w)));
  y(eval(divs[i].y)); h(Math.max(0,eval(divs[i].h)));
  // If needed, set visibility based on the 'v' property of the array (0, 1 or 2).
  if (divs[i].v) vis(divs[i].v==1&&isSmall ? 'hidden' : 'visible');
 }

 // Might as well fire the onlayout event if it exists.
 if (onlayout) onlayout();

 // Now, display it using updated variables...
 scrollBy(0);
}};


// *** ON LOAD: CAPTURE EVENTS & MISC. SETUP ***


DsPt.setup = function() { with (this)
{
 if (!isDyn) return;

 // Get layer objects for all the divs passed to the function somehow...
 // If a parent div reference has been specified, eval() that and store it too.
 for (var i = 0; i < divs.length; i++) with (divs[i])
 {
  par = eval(par);
  lyr = getLyr(id, par);
 }

 // These get accessed so often we might as well get some short references.
 div = getLyr(myName+'Inner', isNS4?divs[0].lyr.ref:null);
 bar = divs[1].lyr;
 thm = divs[2].lyr;

 // Buffer frame for IE/NS6 -- same as scroller name, plus 'Buf'.
 // NS6 has troubles with the frames array and iframes, so use a workaround.
 if (!isNS4) buf = eval('window.' + myName + 'Buf');

 // Set up event capturing for NS4.
 if (isNS4)
 {
  bar.ref.captureEvents(Event.CLICK);
  thm.ref.captureEvents(Event.MOUSEDOWN);
 }

 // Pass these events to this scroller.
 bar.ref.onclick = new Function('evt', 'return ' + myName + '.barClick(evt)');
 thm.ref.onmousedown = new Function('evt', 'return ' + myName + '.thumbDown(evt)');

 // Seems to help IE4 with our manual dragging code.
 thm.ref.ondragstart = new Function('return false');


 var fileName = '';

 // XFrames/Query Load: Obtain initial documents for this scroller from the URI string.
 // Search it for the pattern: frames(id1=file1.html,id2=file2.html,.....)
 if (location.href.match(/frames\(([^)]+)\)/))
 {
  // Split the passed frames string on commas into an array.
  var files = RegExp.$1.split(',');
  // Search through that array looking for scrollername=file.html
  for (var i = 0; i < files.length; i++)
   if (files[i].match(/(\w+)\=(.+)/) && myName==RegExp.$1) fileName = RegExp.$2;
 }

 // Now is a good time to fire the 'onsetup' event...
 if (onsetup) onsetup();

 // Mark it safe for loading functions to go.
 loaded = true;
 // If a filename has been detected, load it.
 if (fileName) load(fileName);
 // Else load default file (if we're passed one) or scroll existing content without loading.
 else if (loadingFile) load(loadingFile);
 else fileLoaded();
}};














// *** PAGE EVENTS ***

// This should combine well with other scripts, as it backs up pre-existing events.
// Note that I'm using a small 'bug check' function to stop Netscape 4 dying onresize.

// window.onevent=function(){....} is essentially the same as <BODY ONEVENT="....">
// Make sure you don't assign events either way later in your page, otherwise these get overridden.


// Back up pre-existing page events, and some window dimensions.
var scrOL=window.onload, scrOR=window.onresize, nsWinW=window.innerWidth, nsWinH=window.innerHeight;
document.scrMM=document.onmousemove;
document.scrMU=document.onmouseup;
document.scrOC=document.onclick;

var DSL = DHTMLScroller.list;

window.onload = function()
{
 // Include this onload to stop loaded files writing out their data twice...
 document.write = new Function();
 if (scrOL) scrOL();
 for (var s in DSL) DSL[s].setup();
};

window.onresize = function()
{
 if (scrOR) scrOR();
 // NS4 cannot handle resizes, so reload -- but use URL query mechanism to keep the loaded file.
 if (isNS4 && (nsWinW!=innerWidth || nsWinH!=innerHeight)) location.reload();
 // Otherwise, call layout function of all scrollers on the page.
 for (var s in DSL) DSL[s].layout();
};


// Make sure we capture and route document events for NS4 as we should.
if (isNS4) document.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP | Event.CLICK);

document.onmousemove = function(evt)
{
 // How my homebrew event chaining works -- I backup the old event, call it, and
 // trust the last function in the chain to call routeEvent() for NS4.
 var ret = scrThumbMove(evt);
 if (document.scrMM) return document.scrMM(evt)&&ret;
 else return ret?isNS4?document.routeEvent(evt):true:false;
};

document.onmouseup = function(evt)
{
 scrThumbUp(evt);
 return document.scrMU?document.scrMU(evt):(isNS4?document.routeEvent(evt):true);
};

document.onclick = function(evt)
{
 // Pick out the right target element for this event.
 evt = evt||window.event;
 var e = evt.target||evt.srcElement, DSL = DHTMLScroller.list, uri = '', ret = 1;
 if (e.nodeType == 3) e = e.parentNode;
 // Now loop up the DOM tree (or just once for NS4) to find if there's an actual
 // link tag that targets a named scroller, or is inside a scroller DIV.
 L: while (e)
 {
  // For each scroller object...
  for (var s in DSL)
  {
   // Only allow actual <A> tags to trigger scroller loads.
   if (e.tagName=='A')
   {
    // Record targetless links that are (presumably) inside a scroller div.
    if (!e.target) uri = e.href;
    // A link anywhere that's targeting this scroller by name? Load it...
    if (e.target == DSL[s].myName) { ret = DSL[s].checkURI(e.href); break L }
   }
   // If we've recorded a previous link and now we meet a scroller div, load it...
   if (uri && e == DSL[s].div.ref) ret = DSL[s].checkURI(uri);
  }
  // Loop upwards. This will be undefined, on purpose, in NS4.
  e=e.parentNode||e.parentElement;
 }


 // Event routing/backup stuff. 'ret' will be false if we're cancelling the event.
 if (!ret) { evt.cancelBubble = true; evt.returnValue = false }
 if (document.scrOC) return document.scrOC(evt)&&ret;
 else return ret?isNS4?document.routeEvent(evt):true:false;
};


// For IE4+/NS6+, disable document selections while an "active Scroller" is being dragged.
// You can manually back up these functions if you want...
// For some reason Opera 7 doesn't seem to respect these, hmm.
document.onselectstart = document.onselect = function()
{
 if (activeScr) return false;
};
