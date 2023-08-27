import os
import openai
import constants

openai.api_key = constants.OPENAI_API_KEY

# Function definition
def save_transcript_to_file(transcript, filename):
    with open(filename, 'w') as file:
        file.write(transcript)


file_path = os.path.join(os.path.dirname(__file__), "recording0.wav")
f = open(file_path, "rb")
transcript = openai.Audio.transcribe("whisper-1", f, language="en")
print(transcript)
# Save the transcript to a .txt file
save_transcript_to_file(transcript['text'], os.path.join(os.path.dirname(__file__), "transcript0.txt"))
