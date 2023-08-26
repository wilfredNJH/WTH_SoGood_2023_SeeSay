import os
import openai
import constants

openai.api_key = constants.OPENAI_API_KEY
f = open(os.path.dirname(__file__) + "\\recording0.wav", "rb")
transcript = openai.Audio.transcribe("whisper-1", f, language="en")
print(transcript)
