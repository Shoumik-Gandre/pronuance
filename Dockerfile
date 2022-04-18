FROM python:3.9.12-buster

ENV PYTHONUNBUFFERED 1

WORKDIR /django

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

COPY . .

# COPY D:\College\be-project\be\db_content\ratings_list.csv ratings_list.csv

# COPY D:\College\be-project\be\db_content\sentences_list.json sentences_list.json

# RUN python3 src/manage.py fill_ratings ratings_list.csv

# RUN python3 src/manage.py fill_sentences sentences_list.json

CMD [ "python3", "src/manage.py", "runserver", "0.0.0.0:8000" ]
