import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private http: HttpClient) { }

  status: string = "stopped";
  mediaRecorder: MediaRecorder | undefined;
  audioChunks : any[] = [];
  result: string = "";
  stream: MediaStream | undefined;
  blobURL: string = "";

  magic(){
    this.http.get('http://localhost:5000/').subscribe(data => {
      this.result = (<any>data).text;
      console.log(this.result);
    });
  }

  stop(){
    if (this.mediaRecorder == undefined) return;

    this.mediaRecorder?.stop();
    this.status = "stopped";

  }

  upload(){
    const file = new File(this.audioChunks, 'audio.wav');
    this.http.post('http://localhost:5000/record', file).subscribe(data => {
      this.result = (<any>data).text;
      console.log(this.result);
    } );
  }

  test(){
    this.http.post('http://localhost:5000/test', '').subscribe(data => {
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
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        this.stream = stream;
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
}
