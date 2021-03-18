import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Validators, FormArray} from '@angular/forms';
import {ConfigService} from '../../core/service/config.service';
import {Configuration, Device} from '../../common/models';

@Component({
  selector: 'app-daisy-config',
  templateUrl: './daisy-config.component.html',
  styleUrls: ['./daisy-config.component.css']
})
export class DaisyConfigComponent implements OnInit {

  // for department 0 the item is not for sale
  departments = Array.from(Array(51).keys());
  depTaxGroups = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З'];

  taxGroups = ['А', 'Б', 'В', 'Г'];
  // barcodes = ['EAN8', 'EAN13', 'UPC‐A', 'UPC‐B', 'тегловен'];

  submitted;
  configForm = this.fb.group({
    deviceName: ['', Validators.required],
    deviceLocation: ['', Validators.required],
    dirToListen: ['', Validators.required],
    astoreUrl: ['', Validators.required],
    astoreUsername: ['', Validators.required],
    astorePassword: ['', Validators.required],
    numberOfDepartments: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
    departments: new FormArray([]),
    numberOfItems: ['', [Validators.required, Validators.min(0), Validators.max(30000)]],
    items: new FormArray([])
  });

  device: Device;

  constructor(private fb: FormBuilder,
              private configService: ConfigService) {
  }

  ngOnInit(): void {
    this.configService.getConfiguration()
      .subscribe(data => this.device = data,
        error => console.log(error));
  }

  get f() {
    return this.configForm.controls;
  }

  get items() {
    return this.f.items as FormArray;
  }

  get deps() {
    return this.f.departments as FormArray;
  }

  onChangeItems(e) {
    const numberOfItems = e.target.value || 0;
    if (this.items.length < numberOfItems) {
      for (let i = this.items.length; i < numberOfItems; i++) {
        this.items.push(this.fb.group({
          number: ['', [Validators.required, Validators.min(1), Validators.max(30000)]],
          name: ['', [Validators.required, Validators.maxLength(20)]],
          price: ['', Validators.required],
          quantity: ['', [Validators.required, Validators.maxLength(999999)]],
          department: ['', Validators.required],
          taxGroup: ['', Validators.required],
          barcode: ['']
        }));
      }
    } else {
      for (let i = this.items.length; i >= numberOfItems; i--) {
        this.items.removeAt(i);
      }
    }
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.configForm.invalid) {
      return;
    }

    const config: Configuration = this.configForm.value;

    this.configService.sendConfiguration(config)
      .subscribe((data) => {
        console.log(data.message);
        localStorage.setItem('device', data.message.split(': ')[1]);
      }, (error) => {
        console.log(error);
      });

    this.onReset();
    this.onClear();

  }

  onReset() {
    // reset whole form back to initial state
    this.submitted = false;
    this.configForm.reset();
    this.items.clear();
    this.deps.clear();
  }

  onClear() {
    // clear errors and reset ticket fields
    this.submitted = false;
    this.items.reset();
    this.deps.reset();
  }

  // cant change dep name or tax group if there is a sell in that dep without z report first
  onChangeDepartments(e) {
    const numberOfDepartments = e.target.value || 0;
    if (this.deps.length < numberOfDepartments) {
      for (let i = this.deps.length; i < numberOfDepartments; i++) {
        this.deps.push(this.fb.group({
          number: ['', [Validators.required, Validators.min(1), Validators.max(50)]],
          name: ['', [Validators.required, Validators.maxLength(20)]],
          taxGroup: ['', Validators.required],
          maxDigits: ['', [Validators.required, Validators.min(0), Validators.max(9)]]
        }));
      }
    } else {
      for (let i = this.deps.length; i >= numberOfDepartments; i--) {
        this.deps.removeAt(i);
      }
    }
  }
}
