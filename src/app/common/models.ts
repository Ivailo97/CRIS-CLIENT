import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {ItemService} from '../core/service/item.service';
import {ItemListComponent} from '../component/item-list/item-list.component';
import {catchError, finalize} from 'rxjs/operators';

export interface Configuration {
  deviceName: string;
  deviceLocation: string;
  dirToListen: string;
  astoreUrl: string;
  astoreUsername: string;
  astorePassword: string;
  departments: Department[];
  items: Item[];
}

export interface Department {
  number: number;
  name: string;
  taxGroup: string;
  maxDigits: number;
}

export interface Item {
  number: number;
  name: string;
  price: number;
  quantity: number;
  department: number;
  taxGroup: string;
  barcode: string;
}

export interface ItemPage {
  content: Item[];
  totalElements: number;
}

export interface Search {
  pageNumber: number;
  pageSize: number;
  sort: string;
  filter: string;
  direction: string;
}

export interface ApiResponse {
  message: string;
}

// daisy models start
// request
export class DaisyRequest {
  public WebSrvCmd: WebSrvCmd;

  public constructor(webSrvCmd: WebSrvCmd) {
    this.WebSrvCmd = webSrvCmd;
  }
}

export class WebSrvCmd {
  public CmdType: string;
  public Cmd: Cmd;

  public constructor(CmdType: string, cmd: Cmd) {
    this.CmdType = CmdType;
    this.Cmd = cmd;
  }
}

export class Cmd {
  public ComPortName: string;
  public COMPortMsgList: ReqCommandWrapper[];

  public constructor(ComPortName: string, COMPortMsgList: ReqCommandWrapper[]) {
    this.ComPortName = ComPortName;
    this.COMPortMsgList = COMPortMsgList;
  }
}

export class ReqCommandWrapper {
  public ReqCommand: ReqCommand;

  public constructor(reqCommand: ReqCommand) {
    this.ReqCommand = reqCommand;
  }
}

export class ReqCommand {
  public Cmd: string;
  public CmdData: {};

  public constructor(cmd: string, CmdData: {}) {
    this.Cmd = cmd;
    this.CmdData = CmdData;
  }
}

// response
export interface DaisyResponse {
  WebSrvCmd: WebSrvCmdRes;
}

export interface WebSrvCmdRes {
  Res: string;
  HasErr: boolean;
  CmdType: string;
  CmdPWD: string;
  Cmd: CmdRes;
}

export interface CmdRes {
  Res: string;
  HasErr: boolean;
  ComPortName: string;
  COMPortMsgList: COMPortMsgRes[];
}

export interface COMPortMsgRes {
  Res: string;
  HasErr: boolean;
  ReqCommand: ReqCommandRes;
  ResCommand: ResCommand;
}

export interface ReqCommandRes {
  Cmd: string;
  CmdData: {};
  SeqNo: number;
}

export interface ResCommand {
  Cmd: string;
  CmdData: {};
  IsValid: boolean;
  IsPackedMsg: boolean;
  ErrorCode: number;
  FDState: FDState;
  SeqNo: number;
}

export interface FDState {
  NoExtDisplay: number;
  PrintAllowed: number;
  TaxRatesActive: number;
  SerialActive: number;
}

export interface Device {
  deviceName: string;
  deviceLocation: string;
  dirToListen: string;
  astoreUrl: string;
}

// daisy models end

export class ItemDataSource implements DataSource<Item> {

  private itemSubject = new BehaviorSubject<Item[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private itemService: ItemService) {
  }

  connect(collectionViewer: CollectionViewer): Observable<Item[]> {
    return this.itemSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.itemSubject.complete();
    this.loadingSubject.complete();
  }

  loadItems(search: Search, itemListComponent: ItemListComponent) {
    this.loadingSubject.next(true);
    this.itemService.list(search)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((result: ItemPage) => {
          itemListComponent.totalCount = result.totalElements;
          this.itemSubject.next(result.content);
        }
      );
  }
}
