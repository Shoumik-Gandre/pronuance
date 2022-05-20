var myRecorder = {
    
    objects: {
        context: null,
        stream: null,
        recorder: null
    },

    init: function () {
        if (null === myRecorder.objects.context) {
            myRecorder.objects.context = new window.AudioContext();
        }
    },

    start: function () {
        var options = { audio: true, video: false };
        navigator.mediaDevices.getUserMedia(options).then(function (stream) {
            myRecorder.objects.stream = stream;
            myRecorder.objects.recorder = new Recorder(
                myRecorder.objects.context.createMediaStreamSource(stream),
                { numChannels: 1 }
            );
            myRecorder.objects.recorder.record();

        }).catch(function (err) { console.log(err); });
    },

    stop: function (id, callback) {
        if (null !== myRecorder.objects.stream) {
            myRecorder.objects.stream.getAudioTracks()[0].stop();
        }

        if (null !== myRecorder.objects.recorder) {

            myRecorder.objects.recorder.stop();

            // Export the WAV file

            myRecorder.objects.recorder.exportWAV(function (blob) {
                var url = (window.URL || window.webkitURL).createObjectURL(blob);
                let formData = new FormData()

                formData.append('data', blob)
                formData.append('sentence_id', id)
                formData.append('fname', 'fname')


                const postData = async () => {
                    let response = await fetch('/upload', {
                        method: 'POST',
                        body: formData
                    })
                    let data = await response.json()

                    if (response.status === 200) { callback(data) }
                    else if (response.statusText === "Unauthorized") { console.log("unauthorized") }

                }

                postData()
            })

        }
    }
};

function getMaskCallback(data) { 
    console.log(data.mask);
    $('#errors-' + data.sentence_id).text(data.mask); 
}

$('[data-role="controls"] > button').click(function () {

    // Initialize the recorder
    myRecorder.init();

    // Get the button state 
    var buttonState = !!$(this).attr('data-recording');

    // Toggle
    if (!buttonState) {
        $(this).attr('data-recording', 'true');
        $(this).text('stop recording');
        myRecorder.start();
    } else {
        $(this).attr('data-recording', '');
        $(this).text('start recording');
        myRecorder.stop( $(this).attr('id'), getMaskCallback );
    }
});