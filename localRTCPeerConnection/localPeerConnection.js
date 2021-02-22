/**
 * Archivo: accessUserMedia.js
 * Descripción: Prototipo simple para probar el uso de RTCPeerConnection de forma local sin usar
 * un servidor de señalización.
 * 
 * Autor: Rubén Delgado González
 * Fecha: 20-2-21
 */

const offerOptions = {
    offerToReceiveVideo: 1,
    offerToReceiveAudio: 1,
};

const callButton = document.querySelector("input#llamar");
const hangButton = document.querySelector("input#colgar");

let localPC;
let remotePC;

 callButton.onclick = onCallButton;
 hangButton.onclick = onHangButton;

 /**
  * Gestiona el botón de llamada para comenzar el proceso de crear la RTCPeerConnection
  */
 function onCallButton() {
    hangButton.disabled = false;
    callButton.disabled = true;
    localPC = new RTCPeerConnection();
    remotePC = new RTCPeerConnection();
    //Gestión de protocolo ICE
    localPC.addEventListener('icecandidate', handleIceCandidate)
    remotePC.addEventListener('icecandidate', handleIceCandidate)

    //Vincula el stream multimedia a la RTCPeerConnection remota
    remotePC.addEventListener('track', gotRemoteStream);
    window.stream.getTracks().forEach(track => localPC.addTrack(track, window.stream));

    //Se inicia el proceso para intercambiar la señalización (offer/answer)
    localPC.createOffer(offerOptions)
        .then(createdOffer)
        .catch(setSDPError)
 }

 /**
  * Termina la llamada 
  */
 function onHangButton() {
    localPC.close();
    remotePC.close();
    localPC = null;
    remotePC = null;
    callButton.disabled = false;
    hangButton.disabled = true;
 }

 /**
  * Función callback cuando se encuentra un candidato ICE para comunicarlo al otro par
  */
 function handleIceCandidate(event) {
    const peerConnection = event.target;
    const iceCandidate = event.candidate;
  
    if (iceCandidate) {
      const newIceCandidate = new RTCIceCandidate(iceCandidate);
      const otherPeer = getOtherPeer(peerConnection);
  
      otherPeer.addIceCandidate(newIceCandidate)
        .then(() => {
          handleConnectionSuccess(peerConnection);
        }).catch((error) => {
          handleConnectionFailure(peerConnection, error);
        });
    }
}


function createdOffer(offerDescription) {
    localPC.setLocalDescription(offerDescription)
        .then(() => {
            setLocalDescriptionSuccess(localPC);
        }).catch(setSDPError);

    remotePC.setRemoteDescription(offerDescription)
        .then(() => {
            setRemoteDescriptionSuccess(remotePC)
        }).catch(setSDPError);

    remotePC.createAnswer(offerOptions)
        .then(createdAnswer)
        .catch(setSDPError);
}


/**
 * Callback para crear la respuesta SDP desde el par remoto
 */
function createdAnswer(answerDescription) {
    //Se guarda 
    remotePC.setLocalDescription(answerDescription)
        .then(() => {
            setLocalDescriptionSuccess(remotePC)
        }).catch(setSDPError);
    
    localPC.setRemoteDescription(answerDescription)
        .then(() => {
            setRemoteDescriptionSuccess(localPC)
        }).catch(setSDPError);
}

//Función callback para 
function gotRemoteStream(event) {
    console.log("gotRemoteStream");
    const remoteStream = event.streams[0]; //Recoge el stream multimedia

    //Dependiendo si es la primera vez que se llama, creará un objeto video o usará el ya creado
    //para enlazar el stream multimedia remoto
    if(document.getElementById("video-remoto")) {
        document.getElementById("video-remoto").srcObject = remoteStream;
    } else {
        const videoHTML = document.createElement('video');
        videoHTML.setAttribute("id", "video-remoto")
        videoHTML.setAttribute("autoplay", '')
        videoHTML.srcObject = remoteStream;
        videoGrid.append(videoHTML)
    }
}

  // Gets the "other" peer connection.
  function getOtherPeer(peerConnection) {
    return (peerConnection === localPC) ?
        remotePC : localPC;
}


/**
 * Métodos locales para realizar logs en consola
 */

 //Devuelve si el par referenciado es el par local o remoto (Para realizar logs en consola)
function getPeerName(peerConnection) {
    return (peerConnection === localPC) ?
        'localPeerConnection' : 'remotePeerConnection';
}

// Muestra en consola que se ha registrado correctamente en consola el par
function setDescriptionSuccess(peerConnection, functionName) {
    const peerName = getPeerName(peerConnection);
    console.log(`${peerName} ${functionName} complete.`);
}
  
// Muestra en consola que ha realizado con éxito la función setLocalDescription
function setLocalDescriptionSuccess(peerConnection) {
    setDescriptionSuccess(peerConnection, 'setLocalDescription');
}
  
// Muestra en consola que ha realizado con éxito la función setRemoteDescription
function setRemoteDescriptionSuccess(peerConnection) {
    setDescriptionSuccess(peerConnection, 'setRemoteDescription');
}

//En caso de que setLocalDescription y setRemoteDescription no hayan podido establecer la información SDP
function setSDPError(err) {
    console.error(`ERROR: ${err.toString()}`)
}

// Muestra en consola que ha añadido con éxito el candidato ICE para la conexión
function handleConnectionSuccess(peerConnection) {
    console.log(`${getPeerName(peerConnection)} addIceCandidate success.`);
};
  
// Muestra en consola que ha añadido no ha sido con exíto el candidato ICE para la conexión
function handleConnectionFailure(peerConnection, error) {
    console.log(`${getPeerName(peerConnection)} failed to add ICE Candidate:\n`+
        `${error.toString()}.`);
}