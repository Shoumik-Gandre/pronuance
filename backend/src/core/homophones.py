import re
from typing import Protocol

class IHomophoneHandler(Protocol):

    def get_phonemes(self, word: str) -> list[list[str]]:
        raise NotImplementedError()
    
    def are_homophones(self, word1: str, word2: str) -> bool:
        raise NotImplementedError()


class HomophoneHandler:
    """Words such as 'whole' and 'hole' are not considered equal but they have the same pronunciation. 
    Homophone handler allows us to match these words"""

    def __init__(self, phoneme_dictionary: dict[str, list[str]]) -> None:
        self._phoneme_dict = phoneme_dictionary
    
    def get_phonemes(self, word: str) -> list[list[str]]:
        return self._phoneme_dict.get(word, None)
    
    def are_homophones(self, word1: str, word2: str) -> bool:

        word1 = re.sub(r'[^a-zA-Z]', '', word1).lower()
        word2 = re.sub(r'[^a-zA-Z]', '', word2).lower()

        phone1_ll: list[list[str]] = self.get_phonemes(word1)
        phone2_ll: list[list[str]] = self.get_phonemes(word2)

        if phone1_ll is None:
            raise TypeError(f"{word1} not in dictionary")
        if phone2_ll is None:
            raise TypeError(f"{word2} not in dictionary")

        phone1: set[str] = set(str(phone) for phone in phone1_ll)
        phone2: set[str] = set(str(phone) for phone in phone2_ll)

        return not phone1.isdisjoint(phone2)



def main() -> None:

    from nltk.corpus import cmudict

    homophone_pairs: list[tuple[str, str]] = [
        ('air', 'heir'),
        ('aisle', 'isle'),
        ('ante-', 'anti-'),
        ('eye', 'I'),
        ('bare', 'bear'),
        ('be', 'bee'),
        ('brake', 'break'),
        ('buy', 'by'),
        ('cell', 'sell'),
        ('cent', 'scent'),
        ('cereal', 'serial'),
        ('coarse', 'course'),
        ('complement', 'compliment'),
        ('dam', 'damn'),
        ('dear', 'deer'),
        ('die', 'dye'),
        ('fair', 'fare'),
        ('fir', 'fur'),
        ('flour', 'flower'),
        ('for', 'four'),
        ('hair', 'hare'),
        ('heal', 'heel'),
        ('hear', 'here'),
        ('him', 'hymn'),
        ('hole', 'whole'),
        ('hour', 'our'),
        ('idle', 'idol'),
        ('in', 'inn'),
        ('knight', 'night'),
        ('knot', 'not'),
        ('know', 'no'),
        ('made', 'maid'),
        ('mail', 'male'),
        ('meat', 'meet'),
        ('morning', 'mourning'),
        ('none', 'nun'),
        ('oar', 'or'),
        ('one', 'won'),
        ('pair', 'pear'),
        ('peace', 'piece'),
        ('plain', 'plane'),
        ('poor', 'pour'),
        ('pray', 'prey'),
        ('principal', 'principle'),
        ('profit', 'prophet'),
        ('real', 'reel'),
        ('right', 'write'),
        ('root', 'route'),
        ('sail', 'sale'),
        ('sea', 'see'),
        ('seam', 'seem'),
        ('sight', 'site'),
        ('sew', 'so'),
        ('shore', 'sure'),
        ('sole', 'soul'),
        ('some', 'sum'),
        ('son', 'sun'),
        ('stair', 'stare'),
        ('stationary', 'stationery'),
        ('steal', 'steel'),
        ('suite', 'sweet'),
        ('tail', 'tale'),
        ('their', 'there'),
        ('to', 'too'),
        ('toe', 'tow'),
        ('waist', 'waste'),
        ('wait', 'weight'),
        ('way', 'weigh'),
        ('weak', 'week'),
        ('wear', 'where'),
    ]
    

    homophone_handler = HomophoneHandler(cmudict.dict())

    word1, word2 = "honey", "money"

    print(f"{word1}  {word2}  status={homophone_handler.are_homophones(word1, word2)}")
    for word1, word2 in homophone_pairs:
        try:
            print(f"{word1}  {word2}  status={homophone_handler.are_homophones(word1, word2)}")
        except TypeError as e:
            print(e)

if __name__ == '__main__':
    main()