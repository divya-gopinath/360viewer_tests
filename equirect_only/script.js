$( document ).ready(function() {
  $("#video-box").click(function(e) {
    e.preventDefault();
    var offset = $(this).offset();
    var relativeX = (e.pageX - offset.left);
    var relativeY = (e.pageY - offset.top);
    alert("Sound localized at \n X: " + relativeX + "  Y: " + relativeY);
  });
});

