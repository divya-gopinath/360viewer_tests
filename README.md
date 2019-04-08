# 360viewer_tests

Current options
* __Marzipano by google__* Video seems to start sideways and the panning directions might be flipped (?), but I added keypresses so it uses arrow keys as well as drag + drop. Good support. Most polished of the four.   
* __Front back two panel__ has the two panel view (converted from equirectangular), but the location tagging is incorrect right now-- I can try to fix it but it'll be a little more difficult.
* __Equirect only__ has the equirectangular format.
* __Side by side__ can be ignored; it was just me testing out a few things.
* ~~__Panolens.js__ Based on `three.js` which is another JS library for viewing panoramas. Arrow key movement a bit choppy and documentation very sparse.~~   
* ~~__Panellum__ Most lightweight of all four. Similar to Panolens.~~
* ~~__GoogleVR Web Viewer__ Weird point mass/black hole artifact when rendering (all have this, but Google VR is definitely worse) Issues playing on some browsers. Also has issues with Chrome autoplaying videos so the user has to press space (or trigger some event in the DOM) before the videos are played which is annoying.~~
