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

 function onHangButton() {
    localPC.close();
    remotePC.close();
    localPC = null;
    remotePC = null;
    callButton.disabled = false;
    hangButton.disabled = true;
 }

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

function createdAnswer(answerDescription) {
    remotePC.setLocalDescription(answerDescription)
        .then(() => {
            setLocalDescriptionSuccess(remotePC)
        }).catch(setSDPError);
    
    localPC.setRemoteDescription(answerDescription)
        .then(() => {
            setRemoteDescriptionSuccess(localPC)
        }).catch(setSDPError);
}

function setSDPError(err) {
    console.error(`ERROR: ${err.toString()}`)
}

function gotRemoteStream(event) {
    console.log("gotRemoteStream");
    console.log(event.streams);
    const remoteStream = event.streams[0];
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


/**
 * Métodos locales para logging
 */

function getPeerName(peerConnection) {
    return (peerConnection === localPC) ?
        'localPeerConnection' : 'remotePeerConnection';
}

  // Gets the "other" peer connection.
function getOtherPeer(peerConnection) {
    return (peerConnection === localPC) ?
        remotePC : localPC;
}

// Logs success when setting session description.
function setDescriptionSuccess(peerConnection, functionName) {
    const peerName = getPeerName(peerConnection);
    console.log(`${peerName} ${functionName} complete.`);
}
  
// Logs success when localDescription is set.
function setLocalDescriptionSuccess(peerConnection) {
    setDescriptionSuccess(peerConnection, 'setLocalDescription');
}
  
// Logs success when remoteDescription is set.
function setRemoteDescriptionSuccess(peerConnection) {
    setDescriptionSuccess(peerConnection, 'setRemoteDescription');
}

// Logs that the connection succeeded.
function handleConnectionSuccess(peerConnection) {
    console.log(`${getPeerName(peerConnection)} addIceCandidate success.`);
};
  
// Logs that the connection failed.
function handleConnectionFailure(peerConnection, error) {
    console.log(`${getPeerName(peerConnection)} failed to add ICE Candidate:\n`+
        `${error.toString()}.`);
}