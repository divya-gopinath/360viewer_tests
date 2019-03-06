# 360viewer_tests

Current options
* __GoogleVR Web Viewer__ Weird point mass/black hole artifact when rendering (all have this, but Google VR is definitely worse) Issues playing on some browsers. Also has issues with Chrome autoplaying videos so the user has to press space (or trigger some event in the DOM) before the videos are played which is annoying.  
* __Marzipano by google__* Video seems to start sideways and the panning directions might be flipped (?), but I added keypresses so it uses arrow keys as well as drag + drop. Good support. Most polished of the four.   
* __Panolens.js__ Based on `three.js` which is another JS library for viewing panoramas. Arrow key movement a bit choppy and documentation very sparse.       
* __Panellum__ Most lightweight of all four. Similar to Panolens.
