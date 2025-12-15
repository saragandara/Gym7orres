import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHistoryFormComponent } from './table-history-form.component';

describe('TableHistoryFormComponent', () => {
  let component: TableHistoryFormComponent;
  let fixture: ComponentFixture<TableHistoryFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableHistoryFormComponent]
    });
    fixture = TestBed.createComponent(TableHistoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
