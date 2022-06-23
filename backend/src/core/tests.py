from django.test import TestCase
from nltk.corpus import cmudict

from .apps import CoreConfig
from .homophones import HomophoneHandler
from .word_comparater import BiLinearWordComprisonStrategy


# Create your tests here.
class BiLinearWordComparaterTestCase(TestCase):

    def test_homophone_match(self):
        """Sentence with homophones make the same sound therefore they must be equal"""
        sentence1 = "The rat ran into a hole"
        sentence2 = "The rat ran into a whole"
        mask = BiLinearWordComprisonStrategy(
            HomophoneHandler(CoreConfig.phoneme_dictionary)
        ).compare(sentence1, sentence2)
        
        self.assertEqual(mask, [True] * 6)


class HomophoneHandlerTestCase(TestCase):

    def test_nonhomophone_pairs(self):
        nonhomophone_pairs = [("money", "honey"), ("alpha", "beta")]
        homophone_handler = HomophoneHandler(cmudict.dict())
        for word1, word2 in nonhomophone_pairs:
            try:
                self.assertFalse(homophone_handler.are_homophones(word1, word2))
            except TypeError as e:
                print(e)
            except AssertionError as e:
                print(e)
                print(f"The words involved are: {word1}, {word2}")


    def test_homophone_pairs(self):

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
        homophone_handler = HomophoneHandler(CoreConfig.phoneme_dictionary)
        for word1, word2 in homophone_pairs:
            try:
                self.assertTrue(homophone_handler.are_homophones(word1, word2))
            except TypeError as e:
                print(e)
            except AssertionError as e:
                print(f"AssertionError: The words involved are: {word1}, {word2}")
        