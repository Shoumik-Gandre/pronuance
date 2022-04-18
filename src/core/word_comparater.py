import re
from typing import List


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
