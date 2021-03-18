import {HttpHeaders} from '@angular/common/http';

export class AppSettings {
  public static API_BASE = 'http://localhost:8080';
  public static ECR_APP_ENDPOINT = 'http://localhost:7000/api';
  public static HTTP_OPTIONS = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
}


