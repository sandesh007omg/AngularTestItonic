import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsavedDataDialogComponent } from './unsaved-data-dialog.component';

describe('UnsavedDataDialogComponent', () => {
  let component: UnsavedDataDialogComponent;
  let fixture: ComponentFixture<UnsavedDataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsavedDataDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnsavedDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
