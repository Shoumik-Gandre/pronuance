from django.core.management.base import BaseCommand, CommandError
from core.models import Story, Sentence
import os, json

class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def add_arguments(self, parser):
        parser.add_argument('path', type=str)

    def handle(self, *args, **options):
        PATH = options.get('path', r"D:\College\be-project\be\db_content\sentences_list.json")
        with open(f"{PATH}", 'r') as f:
            sentences = json.load(f)
        for sentence in sentences:
            Sentence.objects.create(text=sentence, story=None)
        
        
        
