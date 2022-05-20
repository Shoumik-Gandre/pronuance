import { useContext } from 'react';
import AuthContext from '../context/AuthContext'
const MicRecorder = require('mic-recorder-to-mp3');
// import MicRecorder from 'mic-recorder-to-mp3';

const RecorderTestPage = () => {

  function onStopAudioRecording(blobUrl: string, blob: Blob): void {
    var url = URL.createObjectURL(blob);
    var li = document.createElement('li');
    var au = document.createElement('audio');
    var hf = document.createElement('a');

    au.controls = true;
    au.src = url;
    hf.href = url;
    hf.download = new Date().toISOString() + '.wav';
    hf.innerHTML = hf.download;
    li.appendChild(au);
    li.appendChild(hf);
    var recordingslist = document.getElementById('recordingslist')
    recordingslist!.appendChild(li);


    let formData = new FormData()
    formData.append('sound_file', blob)
    formData.append('sentence_id', String(1))


    const postData = async () => {
      let response = await fetch('http://127.0.0.1:8000/app/api/getmask/', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + String(authTokens.access) },
        body: formData
      })
      let data = await response.json()

      if (response.status === 200) { console.log(data.mask) }
      else if (response.statusText === "Unauthorized") { console.log("unauthorized") }

    }

    postData()
  }

  const recorder = new MicRecorder({
    bitRate: 128,
    // encoder: 'wav', // default is mp3, can be wav as well
    // sampleRate: 44100, // default is 44100, it can also be set to 16000 and 8000.
  });

  function startRecording() {
    recorder.start().then(() => {
      // something else
    }).catch((e: any) => {
      console.error(e);
    });
  }

  function stopRecording() {
    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]: any) => {
        // do what ever you want with buffer and blob
        // Example: Create a mp3 file and play
        const file = new File(buffer, 'me-at-thevoice.mp3', {
          type: blob.type,
          lastModified: Date.now()
        });

        let formData = new FormData()
        formData.append('sound_file', file)
        formData.append('sentence_id', String(1))

        // const obj_url = URL.createObjectURL(file)
        // const player = new Audio(obj_url);
        // console.log(obj_url)

        const postData = async () => {
          let response = await fetch('http://127.0.0.1:8000/app/api/getmask/', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + String(authTokens.access) },
            body: formData
          })
          let data = await response.json()

          if (response.status === 200) { console.log(data.mask) }
          else if (response.statusText === "Unauthorized") { console.log("unauthorized") }

        }
        postData()


      }).catch((e: any) => {
        alert('We could not retrieve your message');
        console.log(e);
      });
  }

  let { authTokens } = useContext(AuthContext)


  return (
    <div>
      <p>RecorderTest</p>
      <h1>Recorder.js simple WAV export example</h1>

      <p>Make sure you are using a recent version of Google Chrome.</p>
      <p>Also before you enable microphone input either plug in headphones or turn the volume down if you want to avoid ear splitting feedback!</p>

      <p></p>

      <button id="start" onClick={startRecording}>record</button>
      <button id="stop" onClick={stopRecording}>stop</button>

      <h2>Recordings</h2>
      <ul id="recordingslist"></ul>

      <h2>Log</h2>
      <pre id="log"></pre>
    </div>
  )
}

export default RecorderTestPage

/*

const startRecording = () => {
    myRecorder.init()
    myRecorder.start()
  }

  const stopRecording = () => {
    myRecorder.stop()
  }

  const getMask = async (blob: Blob) => {

    console.log(blob)

    let formData = new FormData()

    formData.append('sound_file', blob)
    formData.append('sentence_id', String(1))

    let response = await fetch('http://127.0.0.1:8000/app/api/getmask/', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + String(authTokens.access) },
      body: formData
    })
    let data = await response.json()

    if (response.status === 200) { console.log(data.mask) }
    else if (response.statusText === "Unauthorized") {
      console.log("Unauthorized");
    }

  }


      <div id="controls">
        <button id="record" onClick={startRecording}>Record</button>
        <button id="stop" onClick={stopRecording}>Stop</button>
        <ul id="recordingslist"></ul>
      </div> 
*/