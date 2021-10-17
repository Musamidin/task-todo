import {AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BackendService} from './services/backend.service';
import {Subscription} from 'rxjs';
import {ITask} from './interfaces/ITask';
import {IResponse} from './interfaces/IResponse';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  form!: FormGroup;
  cSub!: Subscription;
  @Input() taskList: any;
  @Input() response!: IResponse;
  constructor(private fb: FormBuilder, private service: BackendService, public transalte: TranslateService){
    transalte.addLangs(['ru', 'en']);
    transalte.setDefaultLang('ru');
    const browserLang = transalte.getBrowserLang();
    transalte.use(browserLang.match(/ru|en/) ? browserLang : 'ru');
  }
  title = 'task-todo';
  updateBtn = true;

  ngOnInit(): void {
    this.response = {status: 0, message: '' };
    this.form = this.fb.group({
      id: [0],
      version: [0],
      title: [],
      priority: [0],
      done: [0]
    });
  }

  ngOnDestroy(): void {
    if (this.cSub) {
    this.cSub.unsubscribe();
  }
}

  getTask(): void {
    this.cSub = this.service.getTask().subscribe(res => {
        this.taskList = res;
    });
  }

  saveTask(): void {
    this.form.value['done'] = this.form.value['done'] ? 1 : 0;
    if (this.form.value['id'] > 0)
    {
      this.cSub = this.service.updateTask(this.form.value).subscribe(res => {
        this.response = res;
        if (this.response.status === 200){
          this.reset();
          this.getTask();
          this.updateBtn = true;
        } else if (this.response.status === 700) {
          this.updateBtn = false;
        }
      });
    }else{
      this.cSub = this.service.addTask(this.form.value).subscribe(res => {
        this.response = res;
        if (this.response.status === 200){
          this.reset();
          this.getTask();
          this.updateBtn = true;
        } else if (this.response.status === 700) {
          this.updateBtn = false;
        }
      });
    }

  }

  Delete(item: ITask): void {
    this.cSub = this.service.deleteTask(item.id).subscribe(res => {
      this.response = res;
      if (this.response.status === 200) {
        this.getTask();
        this.reset();
      }
    });
  }

  Edit(item: ITask): void {
    this.form.patchValue(item);
  }

  reset(): void {
    this.form.reset();
    this.form.get('id')!.setValue(0);
    this.form.get('version')!.setValue(0);
  }

  ngAfterViewInit(): void{
    this.getTask();
  }

  changeStatus($event: any, item: ITask): any {
    item.done = ($event.target.checked) ? 1 : 0;
    this.cSub = this.service.checkTask(item).subscribe(res => {
      this.response = res;
      switch (this.response.status) {
        case 200: { this.getTask(); this.updateBtn = true; } break;
        case 600: {} break;
        case 700: { item.done = ($event.target.checked) ? 0 : 1; this.updateBtn = false; } break;
        default: {} break;
      }
    });
  }

  updateAgain(): any {
      this.getTask();
      this.updateBtn = true;
  }

}
