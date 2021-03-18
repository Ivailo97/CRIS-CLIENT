import {Injectable} from '@angular/core';
import {Cmd, DaisyRequest, DaisyResponse, Department, Item, ReqCommand, ReqCommandWrapper, WebSrvCmd} from '../../common/models';
import {Observable} from 'rxjs';
import {AppSettings} from '../../common/settings';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DaisyRequestService {

  constructor(private http: HttpClient) {
  }

  public generateReqCommandWrapper(reqName: string, cmdData: {}): ReqCommandWrapper {
    return new ReqCommandWrapper(new ReqCommand(reqName, cmdData));
  }

  public generateDaisyRequest(reqCommands: ReqCommandWrapper[]): DaisyRequest {
    const cmd: Cmd = new Cmd('COM3', reqCommands);
    const webSrvCmd: WebSrvCmd = new WebSrvCmd('CmdCOMPort', cmd);
    return new DaisyRequest(webSrvCmd);
  }

  public sendDaisyRequest(request: DaisyRequest): Observable<DaisyResponse> {
    return this.http.post<DaisyResponse>(AppSettings.ECR_APP_ENDPOINT, request, AppSettings.HTTP_OPTIONS);
  }

  public delete(cmdData: {}): Observable<DaisyResponse> {
    const cmdWrapper = this.generateReqCommandWrapper('FDProgPLU', cmdData);
    const request = this.generateDaisyRequest([cmdWrapper]);
    return this.sendDaisyRequest(request);
  }

  public sendCommandSequence(cmdWrappers: ReqCommandWrapper[]): Observable<DaisyResponse> {
    const request = this.generateDaisyRequest(cmdWrappers);
    return this.sendDaisyRequest(request);
  }

  public programItems(items: Item[]) {
    const reqCommands: ReqCommandWrapper[] = items.map(i => this.itemToCmd(i));
    this.sendDaisyRequest(this.generateDaisyRequest(reqCommands))
      .subscribe(data => console.log(data),
        err => console.log(err));
  }

  public programDepartments(departments: Department[]) {
    const reqCommands: ReqCommandWrapper[] = departments.map(dept => this.deptToCmd(dept));
    this.sendDaisyRequest(this.generateDaisyRequest(reqCommands))
      .subscribe(data => console.log(data),
        err => console.log(err));
  }

  private itemToCmd(item: Item): ReqCommandWrapper {
    const cmdData = {
      Item: 'P',
      TaxGroup: item.taxGroup,
      PLUNum: item.number,
      Price: item.price,
      Name: item.name,
      Barcode: item.barcode,
      Dept: item.department,
      FracQty: 1,
      StockQty: item.quantity
    };
    return this.generateReqCommandWrapper('FDProgPLU', cmdData);
  }

  private deptToCmd(dept: Department): ReqCommandWrapper {
    const cmdData = {
      Item: 'P',
      TaxGroup: dept.taxGroup,
      DeptNum: dept.number,
      Price: 0,
      Name: dept.name,
      MaxDigit: dept.maxDigits,
    };
    return this.generateReqCommandWrapper('FDProgDPT', cmdData);
  }

}
