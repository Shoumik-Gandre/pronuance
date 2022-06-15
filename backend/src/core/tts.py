import io
import json
from typing import List
from pydub import AudioSegment
from .apps import CoreConfig
from django.core.files.uploadedfile import InMemoryUploadedFile


class TextToSpeech:

    @staticmethod
    def decode(sound_file: InMemoryUploadedFile) -> List[str]:
        audio = AudioSegment.from_file_using_temporary_files(sound_file)
        audio_buffer = io.BytesIO()
        audio.export(audio_buffer, format='wav')
        audio_buffer.seek(0)

        # Use Vosk for speech recognition
        CoreConfig.vosk_asr.AcceptWaveform(audio_buffer.getvalue())
        result = json.loads(CoreConfig.vosk_asr.FinalResult())
        return result['text']
