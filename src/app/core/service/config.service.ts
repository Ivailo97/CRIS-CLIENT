import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppSettings} from '../../common/settings';
import {
  ApiResponse,
  Configuration, Device
} from '../../common/models';
import {DaisyRequestService} from './daisy-request.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient,
              private reqService: DaisyRequestService) {
  }

  sendConfiguration(config: Configuration): Observable<ApiResponse> {
    const configDeviceUrl = AppSettings.API_BASE + '/config/device';
    this.reqService.programItems(config.items);
    this.reqService.programDepartments(config.departments);
    return this.http.post<ApiResponse>(configDeviceUrl, config, AppSettings.HTTP_OPTIONS);
  }

  getConfiguration(): Observable<Device> {
    const configDeviceUrl = AppSettings.API_BASE + '/config/device';
    return this.http.get<Device>(configDeviceUrl);
  }

}
