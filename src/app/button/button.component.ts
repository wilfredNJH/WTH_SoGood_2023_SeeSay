import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';  // <-- Added AfterViewInit
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API_URL } from "../app.constants"

const UploadStates = {
  UPLOADING: 'uploading',
  UPLOADED: 'uploaded',
  NONE: 'none',
  ERROR: 'error'
} as const;

type UploadState = typeof UploadStates[keyof typeof UploadStates];

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements AfterViewInit {  // <-- Implement AfterViewInit
  @ViewChild('videoElement', { static: false }) videoElement?: ElementRef<HTMLVideoElement>;

  recordResult: string = '';
  uploadState : UploadState = UploadStates.NONE;

  imageCaptured: boolean = false;
  imageBlob: Blob | null = null;
  imageSrc: string | null = null;
  showVideo: boolean = false;
  audioStream: MediaStream | null = null;
  shouldPlayVideo: boolean = false;  // <-- Flag to check if video should play

  
  status: string = "stopped";
  mediaRecorder: MediaRecorder | undefined;
  audioChunks : any[] = [];
  captureResult: string = "";
  videoStream: MediaStream | undefined;
  blobURL: string = "";
  resultHistory : string[] = [];

  showHistory: boolean = false;

  toggleHistory() {
    this.showHistory = !this.showHistory;
  }

  stop(){
    if (this.mediaRecorder == undefined) return;

    this.mediaRecorder?.stop();
    this.status = "stopped";

  }
 

  upload() {
    this.recordResult = "Uploading.."; //hack
    const file = new File(this.audioChunks, 'audio.wav');
    this.http.post(API_URL + 'record', file).subscribe(data => {
      this.recordResult = "Transcript: " + (<any>data).text;
      console.log(this.recordResult);
  
      if (this.resultHistory.length === 0 || this.resultHistory[this.resultHistory.length - 1] !== this.recordResult) {
        this.resultHistory.push(this.recordResult);
      }
    });
  }
  

  test(){
    this.http.post(API_URL + 'test', '').subscribe(data => {
      console.log(data);
    });
  }

  play(){
      const audioBlob = new Blob(this.audioChunks);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
  }

  record(){
    this.audioChunks = [];
    this.recordResult = "";
    this.audioChunks = [];

    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        this.audioStream = stream;
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.status = "recording";

        this.mediaRecorder.addEventListener("dataavailable", event => {
          this.audioChunks.push(event.data);
        });
      })
      .catch((err) => {
        console.error(`you got an error: ${err}`);
      });
  }

  constructor(private cdRef: ChangeDetectorRef, private http : HttpClient) { }

  ngAfterViewInit() {
    this.playVideoIfNeeded();
  }

  toggleCamera() {
    if (this.showVideo) {
      this.closeCamera();
    } else {
      this.openCamera();
    }
  }

  playVideoIfNeeded() {
    if (this.shouldPlayVideo && this.videoStream) {
      const videoElem = this.videoElement?.nativeElement;
      if (videoElem) {
        videoElem.srcObject = this.videoStream;
        videoElem.play();
      }
    }
  }





  openCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Camera API is not supported in your browser');
      return;
    }

    //hack
    this.imageSrc = null;
    this.imageCaptured = false;

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.showVideo = true;
        this.videoStream = stream;
        this.cdRef.detectChanges(); // Force an update to render the video element.
        this.shouldPlayVideo = true;
        this.playVideoIfNeeded();
      })
      .catch(error => {
        console.error('Error accessing the camera', error);
      });
  }


  captureImage() {
    if (!this.videoStream) {
      console.error('No video stream available');
      return;
    }

    const video = this.videoElement?.nativeElement;
    const canvas = document.createElement('canvas');
    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx!.drawImage(video, 0, 0);
      canvas.toBlob(blob => {this.imageBlob = blob;});
      this.imageSrc = canvas.toDataURL('image/png');
      this.imageCaptured = true; // Set it to true
    }
    // Close the video feed after capturing the image
    this.closeCamera();
  }

  downloadImage() {
    if (!this.imageSrc) {
      console.error('No image available to download.');
      return;
    }
    const downloadLink = document.createElement('a');
    downloadLink.href = this.imageSrc;
    downloadLink.download = 'captured_image.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  uploadImage() {
    if (!this.imageSrc) {
      console.error('No image available to upload.');
      return;
    }

    // Upload code goes here
    this.uploadState = UploadStates.UPLOADING;
    this.http.post(API_URL + 'capture', this.imageBlob).subscribe((data : any) => {
      console.log(data);
      if (data){
        this.captureResult = data.text;
        this.uploadState = UploadStates.UPLOADED;
        

        let select : any = document.getElementById('language-select')
        
        //get tts
        this.http.post(API_URL + 'texttospeech', select.value).subscribe(data => {
          this.http.get(API_URL + 'speak', { responseType: 'blob' }).subscribe(audioBlob  => {
            const audio = new Audio(URL.createObjectURL(audioBlob));
            audio.play();
          }
          );
          console.log(data);
        });
      }
    });
  }

  closeCamera() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = undefined;
      this.showVideo = false;
    }
  }
}
