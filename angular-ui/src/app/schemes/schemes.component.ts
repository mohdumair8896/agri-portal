// ============================================================
// Schemes Component — Eligibility & Applications
// ============================================================
import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule }       from '@angular/forms';
import { ApiService }        from '../shared/api.service';

@Component({
  selector:   'app-schemes',
  standalone: true,
  imports:    [CommonModule, FormsModule],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <h1>Government <span style="color:var(--color-info)">Schemes</span></h1>
        <p style="margin-top:6px">Check eligibility and apply for agricultural government schemes</p>
      </div>

      <div *ngIf="alert" class="alert" [class.alert-success]="alert.type==='success'" [class.alert-error]="alert.type==='error'" [class.alert-info]="alert.type==='info'" style="margin-bottom:20px">
        {{ alert.message }}
      </div>

      <!-- Eligibility Checker -->
      <div class="checker-card card-glass" style="margin-bottom:32px">
        <h3 style="margin-bottom:16px">🔍 Check Scheme Eligibility</h3>
        <div class="checker-row">
          <div class="form-group">
            <label>Farmer ID</label>
            <input type="number" [(ngModel)]="checker.farmer_id" placeholder="1" id="check-farmer-id" />
          </div>
          <div class="form-group">
            <label>Land Holding (Acres) *</label>
            <input type="number" [(ngModel)]="checker.land_acres" placeholder="8.5" step="0.1" min="0" id="check-land" />
          </div>
          <div class="form-group">
            <label>Crop (Optional)</label>
            <input type="text" [(ngModel)]="checker.crop_name" placeholder="Wheat" id="check-crop" />
          </div>
          <button class="btn btn-accent" (click)="checkEligibility()" [disabled]="checking || !checker.land_acres" id="check-eligibility-btn">
            {{ checking ? 'Checking...' : '✓ Check' }}
          </button>
        </div>

        <!-- Eligible Results -->
        <div *ngIf="eligible.length" class="eligible-results">
          <div class="result-header">
            <span class="badge badge-green">✅ {{ eligible.length }} Schemes Eligible</span>
            <span style="font-size:0.85rem;color:var(--color-text-muted)">for {{ checker.land_acres }} acres</span>
          </div>
          <div class="eligible-grid">
            <div class="eligible-card" *ngFor="let s of eligible">
              <div class="eligible-header">
                <strong>{{ s.scheme_name }}</strong>
                <span class="benefit">₹{{ s.benefit_amount | number }}</span>
              </div>
              <p style="font-size:0.82rem;margin:8px 0">{{ s.description }}</p>
              <div style="display:flex;justify-content:space-between;align-items:center">
                <small style="color:var(--color-text-muted)">{{ s.eligible_crops }}</small>
                <button *ngIf="checker.farmer_id" class="btn btn-sm btn-primary"
                  (click)="apply(checker.farmer_id!, s.id)" [id]="'apply-'+s.id">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
        <div *ngIf="checkedOnce && !eligible.length" class="alert alert-info" style="margin-top:16px">
          ℹ️ No schemes found matching the given land acres and crop.
        </div>
      </div>

      <!-- All Schemes -->
      <div class="section-title flex-between" style="margin-bottom:16px">
        <h2>All Available Schemes</h2>
        <span class="badge badge-green">{{ schemes.length }} Schemes</span>
      </div>

      <div *ngIf="loading" class="spinner-wrap"><div class="spinner"></div></div>

      <div *ngIf="!loading" class="grid-2">
        <div class="scheme-card card" *ngFor="let s of schemes">
          <div class="scheme-header">
            <div class="scheme-icon">📋</div>
            <div>
              <h3>{{ s.scheme_name }}</h3>
              <div class="benefit-badge">₹{{ s.benefit_amount | number }} benefit</div>
            </div>
          </div>
          <p style="margin:12px 0;font-size:0.88rem">{{ s.description }}</p>
          <div class="scheme-meta">
            <div class="meta-item">
              <span class="meta-label">Land Range</span>
              <span class="meta-value">{{ s.min_land_acres }} – {{ s.max_land_acres }} acres</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Eligible Crops</span>
              <span class="meta-value">{{ s.eligible_crops }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checker-card { padding: 28px; }
    .checker-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr auto;
      gap: 16px;
      align-items: end;
    }

    .eligible-results { margin-top: 24px; border-top: 1px solid var(--color-border); padding-top: 20px; }
    .result-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .eligible-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
    .eligible-card {
      background: rgba(82,183,136,0.08);
      border: 1px solid rgba(82,183,136,0.3);
      border-radius: var(--radius-md);
      padding: 16px;
    }
    .eligible-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
    .benefit { color: var(--color-success); font-weight: 700; font-family: var(--font-heading); white-space: nowrap; }

    .scheme-card { display: flex; flex-direction: column; }
    .scheme-header { display: flex; align-items: flex-start; gap: 16px; }
    .scheme-icon {
      font-size: 2rem;
      width: 48px; height: 48px;
      background: rgba(69,123,157,0.15);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .benefit-badge {
      margin-top: 4px;
      font-weight: 700;
      color: var(--color-accent);
      font-family: var(--font-heading);
      font-size: 1.1rem;
    }
    .scheme-meta { display: flex; flex-direction: column; gap: 8px; margin-top: auto; padding-top: 12px; border-top: 1px solid var(--color-border); }
    .meta-item { display: flex; justify-content: space-between; font-size: 0.82rem; }
    .meta-label { color: var(--color-text-muted); }
    .meta-value { font-weight: 600; }

    @media (max-width: 768px) {
      .checker-row { grid-template-columns: 1fr; }
    }
  `]
})
export class SchemesComponent implements OnInit {
  schemes:     any[]   = [];
  eligible:    any[]   = [];
  loading      = false;
  checking     = false;
  checkedOnce  = false;
  alert:       { type: string; message: string } | null = null;

  checker = { farmer_id: null as number | null, land_acres: null as number | null, crop_name: '' };

  constructor(private api: ApiService) {}
  ngOnInit() { this.loadSchemes(); }

  loadSchemes() {
    this.loading = true;
    this.api.getSchemes().subscribe({
      next:  (res) => { this.schemes = res.data || []; this.loading = false; },
      error: (e)   => { this.showAlert('error', e.message); this.loading = false; }
    });
  }

  checkEligibility() {
    if (!this.checker.land_acres) return;
    this.checking = true;
    this.checkedOnce = false;
    this.api.checkEligibility(this.checker.land_acres, this.checker.crop_name || undefined).subscribe({
      next:  (res) => { this.eligible = res.schemes || []; this.checking = false; this.checkedOnce = true; },
      error: (e)   => { this.showAlert('error', e.message); this.checking = false; }
    });
  }

  apply(farmerId: number, schemeId: number) {
    this.api.applyScheme(farmerId, schemeId).subscribe({
      next:  () => this.showAlert('success', '✅ Application submitted successfully!'),
      error: (e) => this.showAlert('error', e.message)
    });
  }

  showAlert(type: string, message: string) {
    this.alert = { type, message };
    setTimeout(() => this.alert = null, 5000);
  }
}
