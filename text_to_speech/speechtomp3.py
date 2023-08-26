import sounddevice as sd
from scipy.io.wavfile import write
import os

import wavio as wv
 
# Sampling frequency
freq = 44100
 
# Recording duration
duration = 5
 
# Start recorder with the given values
# of duration and sample frequency
recording = sd.rec(int(duration * freq),
                   samplerate=freq, channels=2)
 
# Record audio for the given number of seconds
sd.wait()
 
# This will convert the NumPy array to an audio
# file with the given sampling frequency
write("recording0.wav", freq, recording)
 
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