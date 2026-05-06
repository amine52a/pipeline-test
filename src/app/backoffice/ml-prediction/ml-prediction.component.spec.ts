import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MlPredictionComponent } from './ml-prediction.component';

describe('MlPredictionComponent', () => {
  let component: MlPredictionComponent;
  let fixture: ComponentFixture<MlPredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MlPredictionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MlPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
