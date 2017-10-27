import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { DataSource } from '../../lib/data-source/data-source';

@Component({
  selector: 'ng2-smart-table-pager',
  styleUrls: ['./pager.component.scss'],
  template: `
    <nav *ngIf="shouldShow()" class="ng2-smart-pagination-nav">
      <div class="ng2-items-perpage">
        <ul>
          <li (click)="setItemsPerpage(10)" [ngClass]="{'active' : perPage === 10}">
            <span>10</span>
          </li>
          <li (click)="setItemsPerpage(50)" [ngClass]="{'active' : perPage === 50}">
            <span>50</span>
          </li>
          <li (click)="setItemsPerpage(100)" [ngClass]="{'active' : perPage === 100}">
            <span>100</span>
          </li>
          <li>
            <div class="ng2-pager-caption">items per page</div>
          </li>
        </ul>
      </div>
      <ul class="ng2-smart-pagination pagination">
        <li class="ng2-smart-page-item page-item">{{startPos}}-{{endPos}} of {{count}}</li>
        <!--<li class="ng2-smart-page-item page-item"
        [ngClass]="{active: getPage() == page}" *ngFor="let page of getPages()">
          <span class="ng2-smart-page-link page-link"
          *ngIf="getPage() == page">{{ page }} <span class="sr-only">(current)</span></span>
          <a class="ng2-smart-page-link page-link" href="#"
          (click)="paginate(page)" *ngIf="getPage() != page">{{ page }}</a>
        </li>-->
        <li class="ng2-smart-page-item page-item ng2-pager-btn ng2-prev" [ngClass]="{disabled: getPage() == 1}">
          <a class="ng2-smart-page-link page-link" href="#"
          (click)="prevPage()" aria-label="First">
          </a>
        </li>
        <li class="ng2-smart-page-item page-item ng2-pager-btn ng2-next"
        [ngClass]="{disabled: getPage() == getLast()}">
          <a class="ng2-smart-page-link page-link" href="#"
          (click)="nextPage()" aria-label="Last">
          </a>
        </li>
      </ul>
    </nav>
  `,
})
export class PagerComponent implements OnChanges {

  @Input() source: DataSource;

  @Output() changePage = new EventEmitter<any>();


  protected pages: Array<any>;
  protected page: number;
  protected count: number = 0;
  protected perPage: number;
  protected startPos: number;
  protected endPos: number;
  protected currentPage: number = 1;

  protected dataChangedSub: Subscription;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.source) {
      if (!changes.source.firstChange) {
        this.dataChangedSub.unsubscribe();
      }
      this.dataChangedSub = this.source.onChanged().subscribe((dataChanges) => {
        this.page = this.source.getPaging().page;
        this.perPage = this.source.getPaging().perPage;
        this.count = this.source.count();
        if (this.isPageOutOfBounce()) {
          this.source.setPage(--this.page);
        }
        this.processPageChange(dataChanges);
        this.initPages();
        /*Set start and end position*/
        this.startPos = this.perPage >= this.count ? 1 : ((this.page - 1) * this.perPage) + 1;
        this.endPos = this.currentPage * this.perPage;
        if(this.endPos > this.count){
          this.endPos = this.count;
        }
      });
    }
  }

  /**
   * We change the page here depending on the action performed against data source
   * if a new element was added to the end of the table - then change the page to the last
   * if a new element was added to the beginning of the table - then to the first page
   * @param changes
   */
  processPageChange(changes: any) {
    if (changes['action'] === 'prepend') {
      this.source.setPage(1);
    }
    if (changes['action'] === 'append') {
      this.source.setPage(this.getLast());
    }
  }

  shouldShow(): boolean {
    return true;
  }

  paginate(page: number): boolean {
    this.source.setPage(page);
    this.page = page;
    this.changePage.emit({ page });
    return false;
  }

  getPage(): number {
    return this.page;
  }

  getPages(): Array<any> {
    return this.pages;
  }

  getLast(): number {
    return Math.ceil(this.count / this.perPage);
  }

  /*Add nextPage function*/
  nextPage(): void {
    if(this.currentPage <= this.getLast()) {
      if(this.count >= this.perPage) {
        ++this.currentPage;
        this.paginate(this.currentPage);
      }
    }
  }

  /*Add prevPage function*/
  prevPage(): void {
    if(this.currentPage > 1) {
      --this.currentPage;
      this.paginate(this.currentPage);
    }
  }

  /*Set per page counter*/
  setItemsPerpage(number: number): void {
    this.source.setPaging(1, number, true);
  }

  isPageOutOfBounce(): boolean {
    return (this.page * this.perPage) >= (this.count + this.perPage) && this.page > 1;
  }

  initPages() {
    const pagesCount = this.getLast();
    let showPagesCount = 4;
    showPagesCount = pagesCount < showPagesCount ? pagesCount : showPagesCount;
    this.pages = [];

    if (this.shouldShow()) {

      let middleOne = Math.ceil(showPagesCount / 2);
      middleOne = this.page >= middleOne ? this.page : middleOne;

      let lastOne = middleOne + Math.floor(showPagesCount / 2);
      lastOne = lastOne >= pagesCount ? pagesCount : lastOne;

      const firstOne = lastOne - showPagesCount + 1;
      for (let i = firstOne; i <= lastOne; i++) {
        this.pages.push(i);
      }
    }
  }
}
