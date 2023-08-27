import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { API_URL } from "../app.constants"

const UploadStates = {
  UPLOADING: 'uploading',
  UPLOADED: 'uploaded',
  NONE: 'none',
  ERROR: 'error'
} as const;

type UploadState = typeof UploadStates[keyof typeof UploadStates];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private http: HttpClient) { }
}
