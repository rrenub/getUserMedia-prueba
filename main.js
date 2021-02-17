//Prueba de getUserMedia - WebRTC
const videoElement = document.querySelector("video");
const audioSelect = document.querySelector("select#audioSource");
const videoSelect = document.querySelector("select#videoSource");
const videoButton = document.querySelector("input#webcam");
const audioButton = document.querySelector("input#audio");

getStream();

function getStream() {
  
  const constraints = { audio: true, video: true }

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(gotStream)
    .catch(handleError);
}

function gotStream(stream) {
  window.stream = stream; // guarda el stream para que se puede manipular posteriormente
  videoElement.srcObject = stream;
}

function handleError(error) {
  console.error("Error: ", error);
}

//Evento para activar y desactivar uso de la cámara
videoButton.onclick = () => {
    console.log("on hide video button click");
    window.stream.getVideoTracks()[0].enabled = !(window.stream.getVideoTracks()[0].enabled);
    var cameraStatus = window.stream.getVideoTracks()[0].enabled ? "Desactivar cámara" : "Activar cámara";
    console.log(cameraStatus)
    videoButton.setAttribute("value", cameraStatus)
}

//Evento para activar y desactivar uso del micrófono
audioButton.onclick = () => {
    console.log("on mute audio button click");
    window.stream.getAudioTracks()[0].enabled = !(window.stream.getAudioTracks()[0].enabled);
    var audioStatus = window.stream.getAudioTracks()[0].enabled ? "Desactivar micrófono" : "Activar micrófono";
    audioButton.setAttribute("value", audioStatus)
}