const tts = (word: string) => {
    let speech = new SpeechSynthesisUtterance()
    speech.lang = "en-UK"
    speech.text = word

    window.speechSynthesis.speak(speech)
}

export default tts 