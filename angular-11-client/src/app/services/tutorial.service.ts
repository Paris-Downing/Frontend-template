import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tutorial } from '../models/tutorial.model';

const baseUrl = 'http://localhost:8080/api/lessons';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {
  chapter?: any = 1; 
  lesson?: any = 1;
  /* 
    http is something that helps us connect the frontend to the backend
    the service is specifically for that, so it needs the http tool to do that
    to have access to the http, we have to inject it into the service, so we use @Injectable to create a global instance
    by using it in the constructor, we can access it locally too
    Anytime we want to use functions from this service, we can inject it into components (see tutorials-list component)
  */
  constructor(private http: HttpClient) { }

  getAll(): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(baseUrl);
  }

  get(): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(`${baseUrl}/${this.chapter}/${this.lesson}`);
  }

  getChapter() : number {
    return this.chapter;
  }

  setChapter(chapter: any) : void {
    this.chapter = chapter; 
  }

  setLesson(lesson: any) : void {
    this.lesson = lesson; 
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByTitle(title: any): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(`${baseUrl}?title=${title}`);
  }
}
