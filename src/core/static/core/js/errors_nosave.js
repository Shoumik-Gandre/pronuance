jQuery(document).ready(function () {
    var $ = jQuery;
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
                            url: '/upload2',
                            data: fd,
                            processData: false,
                            contentType: false
                        }).done(function (data) {
                            jsonData = JSON.parse(data);

                            $('#errors2-' + jsonData.sentence_id).text(jsonData.mask);
                            
                            // list of incorrect div
                        });
                    });
                }
            }
        }
    };

    // Prepare the recordings list
    var listObject = $('[data-role="recordings"]');

    // Prepare the record button
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
            myRecorder.stop(listObject, $(this).attr('id'));
        }
    });

    function createElementMask(maskId, mask) {
        $(maskId).text(mask);
    }
    
    function createElementScaffold1Row(word) {
        return ($('<li/>').html(`
            <div data-role="controls">
                <button class="btn btn-primary float-right" data-word="${word}">
                    start recording
                </button>
            </div>
            ${word}`
        ));
    }


});