from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from core.models import Word
from core.models import Rating
import pandas as pd

class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def add_arguments(self, parser):
        parser.add_argument('path', type=str)

    def handle(self, *args, **options):
        PATH = options.get('path', r"D:\College\be-project\be\db_content\ratings_list.csv")
        data = pd.read_csv(PATH, index_col=0)
        print(data)
        for index, row in data.iterrows():
            try:
                u = User.objects.get(username=row.students)
            except:
                u = User.objects.create_user(username=row.students, password="pass@123")
            try:
                w = Word.objects.get(text=row.words)
            except:
                w = Word.objects.create(text=row.words)

            Rating.objects.create(user=u, word=w, score=row.ratings)
        
        
        
