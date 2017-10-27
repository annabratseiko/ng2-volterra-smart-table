import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { Grid } from '../../../lib/grid';
import { DataSource } from '../../../lib/data-source/data-source';

@Component({
  selector: '[ng2-st-checkbox-select-all]',
  template: `
    <input type="checkbox" [ngModel]="isAllSelected" id="account_name">
    <label for="account_name" (click)="preventClick($event)"></label>
  `,
  styles: [`
    [type="checkbox"]:not(:checked),
    [type="checkbox"]:checked {
      position: absolute;
      left: -9999px;
    }

    [type="checkbox"]:not(:checked) + label:after {
      opacity: 0;
      transform: scale(0);
    }

    [type="checkbox"] + label {
      width: 24px;
      height: 24px;
      cursor: pointer;
      position: absolute;
      top: 3px;
      left: 0;
      background: #fff;
      border: 1px solid #d2d8dd;
      border-radius: 5px;
      display: inline-block;
      position: relative;
      box-sizing: content-box;
    }

    [type="checkbox"]:checked + label {
      background: #34daa6;
      border: 1px solid #34daa6;
      border-radius: 4px;
    }
    [type="checkbox"]:checked + label:after {
      content: '';
      width: 12px;
      height: 8px;
      position: absolute;
      top: 5px;
      left: 5px;
      border: 2px solid #fff;
      border-top: none;
      border-right: none;
      background: transparent;
      opacity: 0;
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
      opacity: 1;
    }
  `]
})
export class CheckboxSelectAllComponent {

  private checked: boolean = false;

  @Input() grid: Grid;
  @Input() source: DataSource;
  @Input() isAllSelected: boolean;

  @Output() selectAllRows = new EventEmitter<any>();

  preventClick(event) {
    event.preventDefault();
    this.isAllSelected = !this.isAllSelected;
    this.selectAllRows.emit(this.isAllSelected);
  }
}
