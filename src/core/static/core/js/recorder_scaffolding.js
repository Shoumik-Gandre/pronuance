var myRecorder_scaffolding = {
    objects: {
        context: null,
        stream: null,
        recorder: null
    },
    init: function () {
        if (null === myRecorder2.objects.context) {
            myRecorder2.objects.context = new (
                window.AudioContext || window.webkitAudioContext
            );
        }
    },
    start: function () {
        var options = { audio: true, video: false };
        navigator.mediaDevices.getUserMedia(options).then(function (stream) {
            myRecorder2.objects.stream = stream;
            myRecorder2.objects.recorder = new Recorder(
                myRecorder2.objects.context.createMediaStreamSource(stream),
                { numChannels: 1 }
            );
            myRecorder2.objects.recorder.record();
        }).catch(function (err) { });
    },
    stop: function (listObject, id) {
        if (null !== myRecorder2.objects.stream) {
            myRecorder2.objects.stream.getAudioTracks()[0].stop();
        }
        if (null !== myRecorder2.objects.recorder) {
            myRecorder2.objects.recorder.stop();

            // Validate object
            if (null !== listObject
                && 'object' === typeof listObject
                && listObject.length > 0) {
                // Export the WAV file
                myRecorder2.objects.recorder.exportWAV(function (blob) {
                    var url = (window.URL || window.webkitURL)
                        .createObjectURL(blob);

                    var fd = new FormData();
                    fd.append('fname', 'test.wav');
                    fd.append('data', blob);
                    fd.append('word', word);
                    $.ajax({
                        type: 'POST',
                        url: '/upload2',
                        data: fd,
                        processData: false,
                        contentType: false
                    }).done(function (data) {
                        jsonData = JSON.parse(data);

                        // $('#errors-' + jsonData.sentence_id).text(jsonData.mask);

                        console.log(jsonData.mask);
                        // list of incorrect div
                    });
                });
            }
        }
    }
};