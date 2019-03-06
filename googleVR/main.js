// window.addEventListener('load', onVrViewLoad);
// var isPlaying = false;

$(document).on('keypress', function(e) {
  alert( "Handler for .keydown() called." );
  function onVrViewLoad() {
    // Selector '#vrview' finds element with id 'vrview'.
    var vrView = new VRView.Player('#vrview', {
      video: 'https://dl.dropboxusercontent.com/s/nxrorfgh8a06q9q/test_vid.mp4',
      is_stereo: true
    });
    vrView.play();
  }
  onVrViewLoad();
});
