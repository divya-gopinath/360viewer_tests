/*
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// Marzipano does not have a high-level API for 360° video with multiple levels yet.
// This code manages the currently playing video using the low-level API.

// Use canvas hack for IE10.
var useCanvasHack = Marzipano.dependencies.bowser.msie;
var localizedData = [];

// Create viewer.
var viewerOpts = { stageType: 'webgl' };
var viewer = new Marzipano.Viewer(document.querySelector('#pano'), viewerOpts);
var viewer2 = new Marzipano.Viewer(document.querySelector('#pano2'), viewerOpts);
viewer.controls().enableMethodGroup('arrowKeys');
viewer.controls().enableMethodGroup('wasdKeys');
viewer.controls().enableMethodGroup('qeKeys');

// Create layer.
var asset = new VideoAsset();
var source = new Marzipano.SingleAssetSource(asset);
var geometry = new Marzipano.EquirectGeometry([ { width: 1 } ]);
var limiter = Marzipano.RectilinearView.limit.traditional(2880, 100*Math.PI/180);
var view = new Marzipano.RectilinearView(null, limiter);
var asset2 = new VideoAsset();
var source2 = new Marzipano.SingleAssetSource(asset);
var geometry2 = new Marzipano.EquirectGeometry([ { width: 1 } ]);
var limiter2 = Marzipano.RectilinearView.limit.traditional(2880, 100*Math.PI/180);
var view2 = new Marzipano.RectilinearView(null, limiter);

var scene = viewer.createScene({ source: source, geometry: geometry, view: view, pinFirstLevel: false });
var scene2 = viewer2.createScene({ source: source2, geometry: geometry2, view: view2, pinFirstLevel: false });

var view = scene.view();
var view2 = scene2.view();


view.setYaw(0 * Math.PI/180);
view.setPitch(0 * Math.PI/180);
view.setFov(50 * Math.PI/180);

view2.setYaw(-180 * Math.PI/180);
view2.setPitch(0 * Math.PI/180);
view2.setFov(50* Math.PI/180);

scene.switchTo({ transitionDuration: 0 });
scene2.switchTo({ transitionDuration: 0 });

var emitter = new EventEmitter();
var videoEmitter = new EventEmitterProxy();

var emitter2 = new EventEmitter();
var videoEmitter2 = new EventEmitterProxy();

var resolutions = [
  { width: 720 },
  { width: 1280 },
  { width: 1920 },
  { width: 2880 }
];

var currentState = {
  resolutionIndex: null,
  resolutionChanging: false
};

function setResolutionIndex(index, cb) {
  cb = cb || function() {};

  currentState.resolutionChanging = true;

  videoEmitter.setObject(null);
  videoEmitter2.setObject(null);

  emitter.emit('change');
  emitter.emit('resolutionSet');
  emitter2.emit('change');
  emitter2.emit('resolutionSet');

  var level = resolutions[index];
  var videoSrc = 'https://www.dl.dropboxusercontent.com/s/eirjhecnnnx3tqr/3_19_19_synced_Large.mp4';

  var previousVideo = asset.video() && asset.video().videoElement();
  var previousVideo2 = asset2.video() && asset2.video().videoElement();

  loadVideoInSync(videoSrc, previousVideo, function(err, element) {
    if (err) {
      cb(err);
      return;
    }

    if (previousVideo) {
      previousVideo.pause();
      previousVideo.volume = 0;
      previousVideo.removeAttribute('src');
    }

    var VideoElementWrapper = useCanvasHack ? CanvasHackVideoElementWrapper : NullVideoElementWrapper;
    var wrappedVideo = new VideoElementWrapper(element);
    asset.setVideo(wrappedVideo);
    asset2.setVideo(wrappedVideo);

    currentState.resolutionIndex = index;
    currentState.resolutionChanging = false;

    videoEmitter.setObject(element);

    emitter.emit('change');
    emitter.emit('resolutionChange');
    emitter2.emit('change');
    emitter2.emit('resolutionChange');

    cb();
  });
}

var multiResVideo = {
  layer: function() {
    return scene.layer();
  },
  element: function() {
    return asset.video() && asset.video().videoElement();
  },
  resolutions: function() {
    return resolutions;
  },
  resolutionIndex: function() {
    return currentState.resolutionIndex;
  },
  resolution: function() {
    return currentState.resolutionIndex != null ?
              resolutions[currentState.resolutionIndex] :
              null;
  },
  setResolutionIndex: setResolutionIndex,
  resolutionChanging: function() {
    return currentState.resolutionChanging;
  },
  addEventListener: emitter.addEventListener.bind(emitter),

  // events from proxy to videoElement
  addEventListenerVideo: videoEmitter.addEventListener.bind(videoEmitter)
};

var multiResVideo2 = {
  layer: function() {
    return scene2.layer();
  },
  element: function() {
    return asset2.video() && asset2.video().videoElement();
  },
  resolutions: function() {
    return resolutions;
  },
  resolutionIndex: function() {
    return currentState.resolutionIndex;
  },
  resolution: function() {
    return currentState.resolutionIndex != null ?
              resolutions[currentState.resolutionIndex] :
              null;
  },
  setResolutionIndex: setResolutionIndex,
  resolutionChanging: function() {
    return currentState.resolutionChanging;
  },
  addEventListener: emitter2.addEventListener.bind(emitter2),

  // events from proxy to videoElement
  addEventListenerVideo: videoEmitter.addEventListener.bind(videoEmitter)
};

// Prevent touch and scroll events from reaching the parent element.
function stopTouchAndScrollEventPropagation(element, eventList) {
  var eventList = [ 'touchstart', 'touchmove', 'touchend', 'touchcancel',
                    'wheel', 'mousewheel' ];
  for (var i = 0; i < eventList.length; i++) {
    element.addEventListener(eventList[i], function(event) {
      event.stopPropagation();
    });
  }
}

function createInfoHotspotElement(hotspot) {

  // Create wrapper element to hold icon and tooltip.
  var wrapper = document.createElement('div');
  wrapper.classList.add('hotspot');
  wrapper.classList.add('info-hotspot');

  // Create hotspot/tooltip header.
  var header = document.createElement('div');
  header.classList.add('info-hotspot-header');

  // Create image element.
  var iconWrapper = document.createElement('div');
  iconWrapper.classList.add('info-hotspot-icon-wrapper');
  var icon = document.createElement('img');
  icon.src = 'img/info.png';
  icon.classList.add('info-hotspot-icon');
  iconWrapper.appendChild(icon);

  // Create title element.
  var titleWrapper = document.createElement('div');
  titleWrapper.classList.add('info-hotspot-title-wrapper');
  var title = document.createElement('div');
  title.classList.add('info-hotspot-title');
  title.innerHTML = hotspot.title;
  titleWrapper.appendChild(title);

  // Construct header element.
  header.appendChild(iconWrapper);
  header.appendChild(titleWrapper);

  // Create text element.
  var text = document.createElement('div');
  text.classList.add('info-hotspot-text');
  text.innerHTML = hotspot.text;

  // Place header and text into wrapper element.
  wrapper.appendChild(header);
  wrapper.appendChild(text);

  var toggle = function() {
    wrapper.classList.toggle('visible');
  };

  // Show content when hotspot is clicked.
  wrapper.querySelector('.info-hotspot-header').addEventListener('hover', toggle);

  // Prevent touch and scroll events from reaching the parent element.
  // This prevents the view control logic from interfering with the hotspot.
  stopTouchAndScrollEventPropagation(wrapper);

  return wrapper;
}

document.addEventListener('click', function (e) {
  var clickCoords = view.screenToCoordinates({x: e.clientX, y: e.clientY});
  var datapoint = {};
  datapoint.yaw = clickCoords.yaw;
  datapoint.pitch = clickCoords.pitch;
  datapoint.videoTime = currentTimeUnformatted;
  var text = "Source localized at yaw=" + datapoint.yaw.toString() + " pitch=" + datapoint.pitch.toString() + " at time=" + datapoint.videoTime.toString() + " sec";
  var tagAlertBoxElement = document.getElementById("tagAlertBox");
  tagAlertBoxElement.innerHTML = text;
  localizedData.push(datapoint);
}, false);
