import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MorrisComponent } from './morris.component';

describe('MorrisComponent', () => {
  let component: MorrisComponent;
  let fixture: ComponentFixture<MorrisComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MorrisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MorrisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
