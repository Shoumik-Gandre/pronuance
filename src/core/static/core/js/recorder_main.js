var myRecorder = {
    objects: {
        context: null,
        stream: null,
        recorder: null
    },
    init: function () {
        if (null === myRecorder.objects.context) {
            myRecorder.objects.context = new (
                window.AudioContext || window.webkitAudioContext
            );
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
        }).catch(function (err) { });
    },
    stop: function (listObject, id) {
        if (null !== myRecorder.objects.stream) {
            myRecorder.objects.stream.getAudioTracks()[0].stop();
        }
        if (null !== myRecorder.objects.recorder) {
            myRecorder.objects.recorder.stop();

            // Validate object
            if (null !== listObject
                && 'object' === typeof listObject
                && listObject.length > 0) {
                // Export the WAV file
                myRecorder.objects.recorder.exportWAV(function (blob) {
                    var url = (window.URL || window.webkitURL)
                        .createObjectURL(blob);

                    var fd = new FormData();
                    fd.append('fname', 'test.wav');
                    fd.append('data', blob);
                    console.log("id: " + id);
                    fd.append('sentence_id', id)
                    $.ajax({
                        type: 'POST',
                        url: '/upload',
                        data: fd,
                        processData: false,
                        contentType: false
                    }).done(function (data) {
                        jsonData = JSON.parse(data);

                        $('#errors-' + jsonData.sentence_id).text(jsonData.mask);
                        words = $('#sentence-' + jsonData.sentence_id).text().match(/\b(\w+)\b/g);
                        incorrect_words = [];
                        for (var i = 0; i < words.length; ++i) {
                            if (jsonData.mask[i] === false) {
                                incorrect_words.push(words[i]);
                            }
                        }
                        console.log(incorrect_words);
                        var ul = $('<ul/>');
                        $('#scaffold1-' + jsonData.sentence_id).append(ul);
                        
                        incorrect_words.map(word => {
                            ul.append(createElementScaffold1Row(word));
                        })
                        
                        // list of incorrect div
                    });
                });
            }
        }
    }
};