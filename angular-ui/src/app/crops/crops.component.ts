// ============================================================
// Crops Component — Crop Management
// ============================================================
import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule }       from '@angular/forms';
import { ApiService }        from '../shared/api.service';

@Component({
  selector:   'app-crops',
  standalone: true,
  imports:    [CommonModule, FormsModule],
  template: `
    <div class="fade-in">
      <div class="page-header flex-between">
        <div>
          <h1>Crop <span style="color:var(--color-success)">Management</span></h1>
          <p style="margin-top:6px">Track Kharif, Rabi & Zaid crops across farmer landholdings</p>
        </div>
        <button class="btn btn-primary" (click)="showForm=true" id="add-crop-btn">+ Add Crop</button>
      </div>

      <div *ngIf="alert" class="alert" [class.alert-success]="alert.type==='success'" [class.alert-error]="alert.type==='error'" style="margin-bottom:20px">
        {{ alert.type === 'success' ? '✅' : '❌' }} {{ alert.message }}
      </div>

      <!-- Season Cards -->
      <div class="season-grid" style="margin-bottom:28px">
        <div class="season-card" *ngFor="let s of seasons" (click)="filterSeason(s.value)" [class.active]="activeFilter===s.value">
          <span>{{ s.icon }}</span>
          <div>
            <div class="s-name">{{ s.label }}</div>
            <div class="s-count">{{ getCropCount(s.value) }} crops</div>
          </div>
        </div>
        <div class="season-card" [class.active]="!activeFilter" (click)="filterSeason('')">
          <span>🌐</span>
          <div>
            <div class="s-name">All Seasons</div>
            <div class="s-count">{{ crops.length }} total</div>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="spinner-wrap"><div class="spinner"></div></div>

      <div *ngIf="!loading && displayed.length" class="table-wrapper fade-in">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Farmer ID</th><th>Crop</th><th>Season</th>
              <th>Area (Acres)</th><th>Sown Date</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of displayed">
              <td><span class="badge badge-blue">{{ c.id }}</span></td>
              <td>Farmer #{{ c.farmer_id }}</td>
              <td><strong>{{ c.crop_name }}</strong></td>
              <td>
                <span class="badge"
                  [class.badge-orange]="c.season==='Kharif'"
                  [class.badge-blue]="c.season==='Rabi'"
                  [class.badge-green]="c.season==='Zaid'">
                  {{ c.season }}
                </span>
              </td>
              <td>{{ c.area_acres }} ac</td>
              <td style="font-size:0.85rem;color:var(--color-text-muted)">{{ c.sown_date | date:'mediumDate' }}</td>
              <td>
                <span class="badge"
                  [class.badge-green]="c.status==='Growing'"
                  [class.badge-blue]="c.status==='Harvested'"
                  [class.badge-red]="c.status==='Failed'">
                  {{ c.status }}
                </span>
              </td>
              <td>
                <div style="display:flex;gap:8px">
                  <button class="btn btn-sm btn-danger" (click)="deleteCrop(c.id)" [id]="'del-crop-'+c.id">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!loading && !displayed.length" class="empty-state card">
        <div class="icon">🌱</div>
        <h3>No crop records found</h3>
        <p>Add crop records to start tracking</p>
      </div>

      <!-- Modal -->
      <div class="modal-overlay" *ngIf="showForm" (click)="showForm=false">
        <div class="modal card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Add Crop Record</h3>
            <button class="close-btn" (click)="showForm=false" id="close-crop-modal">✕</button>
          </div>
          <form (ngSubmit)="saveCrop()" #cropForm="ngForm">
            <div class="form-grid">
              <div class="form-group">
                <label>Farmer ID *</label>
                <input type="number" [(ngModel)]="form.farmer_id" name="farmer_id" required min="1" placeholder="1" id="input-farmer-id" />
              </div>
              <div class="form-group">
                <label>Crop Name *</label>
                <input type="text"   [(ngModel)]="form.crop_name" name="crop_name" required placeholder="Wheat" id="input-crop-name" />
              </div>
              <div class="form-group">
                <label>Season *</label>
                <select [(ngModel)]="form.season" name="season" required id="input-season">
                  <option value="">Select season</option>
                  <option value="Kharif">Kharif (Jun–Nov)</option>
                  <option value="Rabi">Rabi (Nov–Apr)</option>
                  <option value="Zaid">Zaid (Mar–Jun)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Area (Acres)</label>
                <input type="number" [(ngModel)]="form.area_acres" name="area_acres" placeholder="5.0" step="0.1" min="0" id="input-area" />
              </div>
              <div class="form-group">
                <label>Sown Date</label>
                <input type="date"   [(ngModel)]="form.sown_date"  name="sown_date" id="input-sown-date" />
              </div>
              <div class="form-group">
                <label>Status</label>
                <select [(ngModel)]="form.status" name="status" id="input-status">
                  <option value="Growing">Growing</option>
                  <option value="Harvested">Harvested</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-outline" (click)="showForm=false">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="saving||!cropForm.valid" id="save-crop-btn">
                {{ saving ? 'Saving...' : 'Add Crop' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .season-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 12px;
    }
    .season-card {
      background: var(--color-surface);
      border: 1.5px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: all var(--transition);
      font-size: 1.8rem;
    }
    .season-card:hover, .season-card.active {
      border-color: var(--color-primary-light);
      background: rgba(64,145,108,0.1);
    }
    .s-name  { font-weight: 600; font-size: 0.85rem; }
    .s-count { font-size: 0.75rem; color: var(--color-text-muted); }

    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(8px);
      z-index: 200;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .modal {
      width: 100%; max-width: 580px;
      max-height: 90vh; overflow-y: auto;
      animation: slideUp 0.3s ease;
    }
    @keyframes slideUp { from { transform: translateY(20px); opacity:0; } to { transform: translateY(0); opacity:1; } }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .close-btn { background: none; border: none; color: var(--color-text-muted); font-size: 1.2rem; cursor: pointer; padding: 4px 8px; border-radius: 4px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 12px; }
  `]
})
export class CropsComponent implements OnInit {
  crops:        any[]   = [];
  displayed:    any[]   = [];
  loading       = false;
  saving        = false;
  showForm      = false;
  activeFilter  = '';
  alert:        { type: string; message: string } | null = null;

  seasons = [
    { value: 'Kharif', label: 'Kharif', icon: '🌧️' },
    { value: 'Rabi',   label: 'Rabi',   icon: '❄️'  },
    { value: 'Zaid',   label: 'Zaid',   icon: '☀️'  },
  ];

  form = { farmer_id: null as number | null, crop_name: '', season: '', area_acres: 0, sown_date: '', status: 'Growing' };

  constructor(private api: ApiService) {}
  ngOnInit() { this.loadCrops(); }

  loadCrops() {
    this.loading = true;
    this.api.getCrops().subscribe({
      next:  (res) => { this.crops = res.data || []; this.filterSeason(this.activeFilter); this.loading = false; },
      error: (e)   => { this.showAlert('error', e.message); this.loading = false; }
    });
  }

  filterSeason(val: string) {
    this.activeFilter = val;
    this.displayed = val ? this.crops.filter(c => c.season === val) : [...this.crops];
  }

  getCropCount(season: string) { return this.crops.filter(c => c.season === season).length; }

  saveCrop() {
    this.saving = true;
    this.api.createCrop(this.form).subscribe({
      next:  () => { this.saving = false; this.showForm = false; this.loadCrops(); this.showAlert('success', 'Crop record added!'); },
      error: (e) => { this.saving = false; this.showAlert('error', e.message); }
    });
  }

  deleteCrop(id: number) {
    if (!confirm('Delete this crop record?')) return;
    this.api.deleteCrop(id).subscribe({
      next:  () => { this.loadCrops(); this.showAlert('success', 'Crop deleted.'); },
      error: (e) => this.showAlert('error', e.message)
    });
  }

  showAlert(type: string, message: string) {
    this.alert = { type, message };
    setTimeout(() => this.alert = null, 4000);
  }
}
