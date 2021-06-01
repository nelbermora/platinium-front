import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PopupsComponent } from './popups.component';

describe('PopupsComponent', () => {
  let component: PopupsComponent;
  let fixture: ComponentFixture<PopupsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
