import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ItemService} from '../../core/service/item.service';
import {fromEvent, merge} from 'rxjs';
import {Device, ItemDataSource, Search} from '../../common/models';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {ConfigService} from '../../core/service/config.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})

export class ItemListComponent implements OnInit, AfterViewInit {

  totalCount: number;
  itemDatasource: ItemDataSource;
  displayedColumns: string[] = ['number', 'name', 'price', 'quantity', 'department', 'taxGroup', 'barcode', 'action'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild('input') input: ElementRef;

  device: Device;

  constructor(private itemService: ItemService, private configService: ConfigService) {
  }

  ngOnInit(): void {
    this.configService.getConfiguration()
      .subscribe(data => this.device = data,
        error => console.log(error));

    this.itemDatasource = new ItemDataSource(this.itemService);
    const search: Search = {
      pageNumber: 0,
      pageSize: 5,
      filter: '',
      sort: 'number',
      direction: 'asc'
    };
    this.itemDatasource.loadItems(search, this);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadItemsPage();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadItemsPage()))
      .subscribe();

    this.paginator.page
      .pipe(tap(() => this.loadItemsPage()))
      .subscribe();
  }

  report() {
    this.itemService.zReportByItems()
      .subscribe(data => console.log(data),
        error => console.log(error));
  }

  dailyReport() {
    this.itemService.zDailyReport()
      .subscribe(data => console.log(data),
        error => console.log(error));
  }

  delete() {
    this.itemService.deleteAllFD()
      .subscribe(
        data => {
          console.log(data);
          if (!data.WebSrvCmd.HasErr) {
            this.itemService.deleteAllDB()
              .subscribe(res => {
                  console.log(res);
                  this.loadItemsPage();
                },
                err => console.log(err));
          }
        },
        error => console.log(error));
  }

  private loadItemsPage() {
    const search: Search = {
      pageNumber: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      filter: this.input.nativeElement.value,
      sort: this.sort.active,
      direction: this.sort.direction
    };
    this.itemDatasource.loadItems(search, this);
  }

  sell(row) {
    const quantity = 3;

    this.itemService.sellFD(row.number, row.price, quantity, this.device)
      .subscribe(data => {
          console.log(data);
          if (!data.WebSrvCmd.HasErr) {
            this.itemService.sellDB(row.number, quantity)
              .subscribe(res => {
                  console.log(res);
                  this.loadItemsPage();
                },
                error => console.log(error));
          }
        },
        error => console.log(error));
  }
}
