/**
 * Archivo: accessUserMedia.js
 * Descripción: Prototipo simple para obtener stream multimedia local (vídeo y audio) utilizando 
 * getUserMedia API de WebRTC
 * 
 * Autor: Rubén Delgado González
 * Fecha: 19-2-21
 */

 //Referencia a los elementos del documento HTML (index.html)
const videoGrid = document.getElementById("video-grid");

getStream();

/**
 * Permite manejar un stream de vídeo através de la variable videoElement
 * que contiene las propiedades de la etiqueta de vídeo.
 */
function getStream() {
  
  const constraints = { audio: false, video: true } //Tipos de recursos a solicitar

  navigator.mediaDevices.getUserMedia(constraints)
                        .then(gotStream)
                        .catch(handleGetUserMediaError);
}

/**
 * Función callback para getUserMedia cuando se recoge el stream multimedia
 * @param {MediaStream} stream - Stream del contenido multimedia
 */
function gotStream(stream) {
  console.log("gotStream")
  window.stream = stream; // make variable available to browser console

  //Crea un tag video dentro del video-grid y enlaza el stream multimedia
  const videoElement = document.createElement("video");
  videoElement.srcObject = stream;
  videoElement.setAttribute("autoplay", '')
  videoGrid.appendChild(videoElement);
}

/**
 * Función en caso de que el promise de getUserMedia sea rechazado
 * @param {Error} error - Error retornado de getUserMedia (NotfoundError o PermissionDeniedError)
 */
function handleGetUserMediaError(error) {
  console.error("Error: ", error);
}