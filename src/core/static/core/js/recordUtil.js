function successCallback(stream) {

    var recorder = RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: RecordRTC.StereoAudioRecorder, // force for all browsers
        numberOfAudioChannels: 2
    });

    recorder.startRecording();

    setTimeout(function() {
        recorder.stopRecording(function() {
            var blob = recorder.blob;
        }, 5 * 1000);
    });
}

function errorCallback(error) {

}

var mediaConstraints = { video: false, audio: true };


navigator.mediaDevices
    .getUserMedia(mediaConstraints)
    .then(successCallback)
    .catch(errorCallback);