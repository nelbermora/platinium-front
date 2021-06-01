import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdvancedElementsComponent } from './advanced-elements.component';

describe('AdvancedElementsComponent', () => {
  let component: AdvancedElementsComponent;
  let fixture: ComponentFixture<AdvancedElementsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedElementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
