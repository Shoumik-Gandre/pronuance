from django.core.management.base import BaseCommand, CommandParser
from core.models import Story, Sentence
import os, json

class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument("folder_path", type=str)

    def handle(self, *args, **options):
        PATH = options.get('folder_path', r"D:\College\be-project\be\db_content\json_stories")
        for filename in os.listdir(PATH):
            with open(f"{PATH}\{filename}", 'r') as f:
                sentences_clean = json.load(f)
            story = Story.objects.create(name=filename.split('.')[0])
            for sentence in sentences_clean:
                Sentence.objects.create(text=sentence, story=story)
            print(f"[DONE] {filename}")
        
        
        
