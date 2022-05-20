import re
from typing import List
import nltk


def compare_sentence(original_text: str, asr_text: str) -> List[bool]:

    original_words = re.split(r'\W+', original_text.lower().replace('.', ''))
    asr_words = re.split(r'\W+', asr_text.lower())
    mask: List[bool] = [False for _ in range(len(original_words))]

    n: int = min(len(original_words), len(asr_words))

    for i in range(n):
        if original_words[i] == asr_words[i]:
            mask[i] = True

    original_words.reverse()
    asr_words.reverse()

    for i in range(n):
        if original_words[i] == asr_words[i]:
            mask[len(original_words) - i - 1] = True

    return mask


def compare_sentences2(true_text: str, decoded_text: str) -> List[bool]:

    true_words: List[str] = nltk.word_tokenize(true_text.lower())
    decoded_words: List[str] = nltk.word_tokenize(decoded_text.lower())
    mask: List[bool] = [False] * len(true_words)

    n: int = min(len(true_words), len(decoded_words))

    for i in range(n):
        if true_words[i] == decoded_words[i]:
            mask[i] = True

    # for i, (word_true, word_decode) in enumerate(zip(true_words, decoded_words)):
    #     mask[i] = (word_true == word_decode)

    true_words.reverse()
    decoded_words.reverse()

    # for i, (word_true, word_decode) in enumerate(zip(true_words, decoded_words)):
    #     mask[len(true_words) - i - 1] = (word_true == word_decode)

    for i in range(n):
        if true_words[i] == decoded_words[i]:
            mask[len(true_words) - i - 1] = True

    return mask