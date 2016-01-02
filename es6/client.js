(function() {
    "use strict";

    function fullscreen() {
        var elem = document.getElementById("viewport");
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        }
    }
    document.getElementById("fullscreen-btn").onclick = fullscreen;
})();