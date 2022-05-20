import React from 'react'

interface PronounceTextProps {
    text: string
}

const PronounceText = ({ text }: PronounceTextProps) => {

    let listOfWords: string[] = text.split(" ")
    let newText = text
    let sentence_html = ""

    for (let wordHolder in listOfWords) {
        <span>{newText.search(wordHolder)}</span>
        newText = newText.replace(wordHolder, '')
    }

    return (
        <div>PronounceText</div>
    )
}

export default PronounceText