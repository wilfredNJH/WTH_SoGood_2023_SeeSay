import sounddevice as sd
from scipy.io.wavfile import write
from pydub import AudioSegment

import os

import wavio as wv
 
# Sampling frequency
freq = 44100
 
# Recording duration
duration = 10
 
# Start recorder with the given values
# of duration and sample frequency
recording = sd.rec(int(duration * freq),
                   samplerate=freq, channels=2)
print("Starting: Speak now!")
# Record audio for the given number of seconds
sd.wait()
print("finished")
# This will convert the NumPy array to an audio
# file with the given sampling frequency
write("recording0.wav", freq, recording)

# convert into mp3 format 
# sound = AudioSegment.from_wav('recording0.wav')

# sound.export('recording0.mp3',format='mp3')
 
# Convert the NumPy array to audio file


'''

fs = 44100  # this is the frequency sampling; also: 4999, 64000
seconds = 5  # Duration of recording

myrecording = sd.rec(int(seconds * fs), samplerate=fs, channels=2)
print("Starting: Speak now!")
sd.wait()  # Wait until recording is finished
print("finished")
write('output.wav', fs, myrecording)  # Save as WAV file
os.startfile("output.wav")
'''