// export const BASE_URL = "http://127.0.0.1:8000/app/api"

export const MAIN_URL = "http://192.168.137.1:8000"
export const BASE_URL = `${MAIN_URL}/app/api`
export const AUTH_URL = `${MAIN_URL}/auth/api`

export const GET_MISPRONUNCIATION_WORDMASK_SCAFFOLD = `${BASE_URL}/get-mispronunciation-wordmask-scaffold/`
export const GET_MISPRONUNCIATION_WORDMASK_PRACTICE = `${BASE_URL}/get-mispronunciation-wordmask-practice/`
export const GET_MISPRONUNCIATION_SENTENCEMASK_PRACTICE = `${BASE_URL}/get-mispronunciation-sentencemask-practice/`
export const GET_MISPRONUNCIATION_SENTENCEMASK_CHALLENGES = `${BASE_URL}/get-mispronunciation-sentencemask-challenge/`
export const GET_SENTENCES = `${BASE_URL}/sentences/`
export const GET_PRACTICE_WORDS = `${BASE_URL}/practice-words/`
export const GET_PRACTICE_SENTENCES = `${BASE_URL}/practice-sentences/`
export const APPEAL_WORD_TEXT = `${BASE_URL}/appeal-word-text/`

// AUTH
export const AUTHENTICATION_TOKEN = `${AUTH_URL}/token/`
export const REFRESH_AUTHENTICATION_TOKEN = `${AUTHENTICATION_TOKEN}refresh/`