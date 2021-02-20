/**
 * Archivo: accessUserMedia.js
 * Descripción: Prototipo simple para obtener stream multimedia local (vídeo y audio) utilizando 
 * getUserMedia API de WebRTC
 * 
 * Autor: Rubén Delgado González
 * Fecha: 19-2-21
 */

 //Referencia a los elementos del documento HTML (index.html)
const videoElement = document.querySelector("video");
const videoButton = document.querySelector("input#webcam");
const audioButton = document.querySelector("input#audio");

getStream();

/**
 * Permite manejar un stream de vídeo através de la variable videoElement
 * que contiene las propiedades de la etiqueta de vídeo.
 */
function getStream() {
  
  const constraints = { audio: true, video: true } //Tipos de recursos a solicitar

  navigator.mediaDevices.getUserMedia(constraints)
                        .then(gotStream)
                        .catch(handleGetUserMediaError);
}

/**
 * Función callback para getUserMedia cuando se recoge el stream multimedia
 * @param {MediaStream} stream - Stream del contenido multimedia
 */
function gotStream(stream) {
  window.stream = stream; // make variable available to browser console
  videoElement.srcObject = stream; //Enlaza el stream de vídeo al tag HTML de video
}

/**
 * Función en caso de que el promise de getUserMedia sea rechazado
 * @param {Error} error - Error retornado de getUserMedia (NotfoundError o PermissionDeniedError)
 */
function handleGetUserMediaError(error) {
  console.error("Error: ", error);
}

/**
 * Evento para el botón para activar y desactivar el stream multimedia de la cámara.
 */
videoButton.onclick = () => {
    console.log("on hide video button click");
    window.stream.getVideoTracks()[0].enabled = !(window.stream.getVideoTracks()[0].enabled);
    var cameraStatus = window.stream.getVideoTracks()[0].enabled ? "Desactivar cámara" : "Activar cámara";
    videoButton.setAttribute("value", cameraStatus)
}

/**
 * Evento para el botón para activar y desactivar el stream multimedia de audio.
 */
audioButton.onclick = () => {
    console.log("on mute audio button click");
    window.stream.getAudioTracks()[0].enabled = !(window.stream.getAudioTracks()[0].enabled);
    var audioStatus = window.stream.getAudioTracks()[0].enabled ? "Desactivar micrófono" : "Activar micrófono";
    audioButton.setAttribute("value", audioStatus)
}