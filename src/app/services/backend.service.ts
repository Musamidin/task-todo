import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ITask} from '../interfaces/ITask';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  getTask(): Observable<ITask[]> {
    return this.http.get<ITask[]>(`http://yii2todo/todo/view`)
      .pipe(map((response: ITask[]) => {
        return response;
      }));
  }

  addTask(data: ITask): Observable<any> {
    return this.http.post(`http://yii2todo/todo/create`, data)
      .pipe(
      catchError(this.handleError.bind(this))
    );
  }

  updateTask(data: ITask): Observable<any> {
    return this.http.put(`http://yii2todo/todo/update`, data)
      .pipe(
      catchError(this.handleError.bind(this))
    );
  }

  checkTask(data: ITask): Observable<any> {
    return this.http.put(`http://yii2todo/todo/check`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`http://yii2todo/todo/delete/${id}`)
      .pipe(
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: any): any {
    return throwError(error);
  }

}
