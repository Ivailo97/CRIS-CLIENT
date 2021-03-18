import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse, DaisyResponse, Device, ItemPage, ReqCommandWrapper, Search} from '../../common/models';
import {AppSettings} from '../../common/settings';
import {DaisyRequestService} from './daisy-request.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {


  constructor(private http: HttpClient, private reqService: DaisyRequestService) {
  }

  list(search: Search): Observable<ItemPage> {
    const itemsURL = AppSettings.API_BASE + '/items?page=' + search.pageNumber + '&size=' + search.pageSize + '&filter='
      + search.filter + '&sort=' + search.sort + '&dir=' + search.direction;
    return this.http.get<ItemPage>(itemsURL, AppSettings.HTTP_OPTIONS);
  }

  // FDStartFiscRcp, FDSaleByPLU,FDSubTotal, FDTotalSum, FDEndFiscRcp
  sellFD(num: number, price: number, quantity: number, device: Device): Observable<DaisyResponse> {

    const numberOfSale = '0000001';

    const startFiscRcpData = {
      Operator: 1,
      Password: 1,
      UnicSaleNum: device.deviceName + '-OP01-' + numberOfSale,
      Invoice: '',
      Refund: ''
    };

    const saleByPLUData = {
      Sign: '+',
      PLU: num,
      Qty: quantity,
      Percent: 0,
      Netto: 0,
      Price: price
    };

    const amountIn = quantity * price;
    const payment = 'P';
    const totalSumData = {
      Text1: '',
      Text2: '',
      Payment: payment,
      AmountIn: amountIn
    };

    const subTotalData = {
      Print: 1,
      Display: 1,
      Percent: 0,
      Netto: 0
    };
    const endFiscRcpData = {};

    const commands: ReqCommandWrapper[] = [
      this.reqService.generateReqCommandWrapper('FDStartFiscRcp', startFiscRcpData),
      this.reqService.generateReqCommandWrapper('FDSaleByPLU', saleByPLUData),
      this.reqService.generateReqCommandWrapper('FDSubTotal', subTotalData),
      this.reqService.generateReqCommandWrapper('FDTotalSum', totalSumData),
      this.reqService.generateReqCommandWrapper('FDEndFiscRcp', endFiscRcpData),
    ];

    return this.reqService.sendCommandSequence(commands);
  }

  sellDB(num: number, quantity: number): Observable<ApiResponse> {
    const apiSellUrl = AppSettings.API_BASE + '/items/sell/' + num + '/' + quantity;
    return this.http.post<ApiResponse>(apiSellUrl, null, AppSettings.HTTP_OPTIONS);
  }

  zReportByItems(): Observable<DaisyResponse> {
    const cmdData = {
      RepType: 'Z'
    };
    const cmdWrapper = this.reqService.generateReqCommandWrapper('FDRptByPLU', cmdData);
    const request = this.reqService.generateDaisyRequest([cmdWrapper]);
    return this.reqService.sendDaisyRequest(request);
  }

  zDailyReport(): Observable<DaisyResponse> {
    const cmdData = {
      Item: 0,
      Option: ''
    };
    const cmdWrapper = this.reqService.generateReqCommandWrapper('FDDailyRpt', cmdData);
    const request = this.reqService.generateDaisyRequest([cmdWrapper]);
    return this.reqService.sendDaisyRequest(request);
  }

  deleteAllFD(): Observable<DaisyResponse> {
    const cmdData = {
      Item: 'D',
      PLUNum: 0,
      PLU1: 0,
      PLU2: 0,
      DeleteOption: '0'
    };
    return this.reqService.delete(cmdData);
  }

  deleteAllDB(): Observable<ApiResponse> {
    const apiDeleteUrl = AppSettings.API_BASE + '/items/delete';
    return this.http.post<ApiResponse>(apiDeleteUrl, null, AppSettings.HTTP_OPTIONS);
  }

  deleteOneFD(): Observable<DaisyResponse> {
    const cmdData = {
      Item: 'D',
      PLUNum: 0,
      PLU1: 0,
      PLU2: 0,
      DeleteOption: '1'
    };
    return this.reqService.delete(cmdData);
  }

  deleteRangeFD(start: number, end: number): Observable<DaisyResponse> {
    const cmdData = {
      Item: 'D',
      PLUNum: 0,
      PLU1: start,
      PLU2: end,
      DeleteOption: '2'
    };
    return this.reqService.delete(cmdData);
  }

}
