from django.apps import AppConfig
import vosk
from django.conf import settings


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'
    verbose_name = 'recorder'
    vosk_model = vosk.Model(settings.VOSK_MODEL_PATH) if settings.LOAD_MODELS else ''
    vosk_asr = vosk.KaldiRecognizer(vosk_model, 44100) if settings.LOAD_MODELS else '' # access through vosk model
