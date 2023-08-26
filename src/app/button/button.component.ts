import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';  // <-- Added AfterViewInit
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements AfterViewInit {  // <-- Implement AfterViewInit
  @ViewChild('videoElement', { static: false }) videoElement?: ElementRef<HTMLVideoElement>;

  imageCaptured: boolean = false;
  imageBlob: Blob | null = null;
  imageSrc: string | null = null;
  showVideo: boolean = false;
  stream: MediaStream | null = null;
  shouldPlayVideo: boolean = false;  // <-- Flag to check if video should play

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
    if (this.shouldPlayVideo && this.stream) {
      const videoElem = this.videoElement?.nativeElement;
      if (videoElem) {
        videoElem.srcObject = this.stream;
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
        this.stream = stream;
        this.cdRef.detectChanges(); // Force an update to render the video element.
        this.shouldPlayVideo = true;
        this.playVideoIfNeeded();
      })
      .catch(error => {
        console.error('Error accessing the camera', error);
      });
  }


  captureImage() {
    if (!this.stream) {
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
    this.http.post('http://localhost:5000/capture', this.imageBlob).subscribe((data : any) => {
      console.log(data);
    });
  }

  closeCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
      this.showVideo = false;
    }
  }
}
