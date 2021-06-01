import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DragulaComponent } from './dragula.component';

describe('DragulaComponent', () => {
  let component: DragulaComponent;
  let fixture: ComponentFixture<DragulaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DragulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
