var localizedSources = [];

$( document ).ready(function() {
  $("#video-box").click(function(e) {
    e.preventDefault();
    var offset = $(this).offset();
    var width = $(this).width();
    var height = $(this).height();
    var relativeX = (e.pageX - offset.left)/width;
    var relativeY = (e.pageY - offset.top)/height;
    var  time = $(this)[0].currentTime;
    var datapoint = {
      "time" : time,
      "x" : relativeX,
      "y" : relativeY,
      "theta" : 2 * Math.PI * relativeX,
      "phi" : Math.PI * relativeY
    };
    alert("Sound localized at \n X: " + relativeX + "  Y: " + relativeY);
    localizedSources.push(datapoint);
  });
});

