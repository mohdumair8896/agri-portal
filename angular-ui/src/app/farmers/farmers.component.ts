// ============================================================
// Farmers Component — Registration & Management
// ============================================================
import { Component, OnInit }      from '@angular/core';
import { CommonModule }           from '@angular/common';
import { FormsModule }            from '@angular/forms';
import { ApiService }             from '../shared/api.service';

@Component({
  selector:   'app-farmers',
  standalone: true,
  imports:    [CommonModule, FormsModule],
  template: `
    <div class="fade-in">
      <div class="page-header flex-between">
        <div>
          <h1>Farmer <span style="color:var(--color-accent)">Registration</span></h1>
          <p style="margin-top:6px">Manage farmer profiles across all districts and tehsils</p>
        </div>
        <button class="btn btn-primary" (click)="openForm()" id="add-farmer-btn">
          + Add Farmer
        </button>
      </div>

      <!-- Alert -->
      <div *ngIf="alert" class="alert" [class.alert-success]="alert.type==='success'" [class.alert-error]="alert.type==='error'" style="margin-bottom:20px">
        {{ alert.type === 'success' ? '✅' : '❌' }} {{ alert.message }}
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar card-glass" style="margin-bottom:20px">
        <div class="filter-row">
          <div class="form-group">
            <label>District Filter</label>
            <input type="text" [(ngModel)]="filter.district" placeholder="e.g. Amritsar" id="filter-district" />
          </div>
          <div class="form-group">
            <label>Tehsil Filter</label>
            <input type="text" [(ngModel)]="filter.tehsil" placeholder="e.g. Ajnala" id="filter-tehsil" />
          </div>
          <div class="filter-actions">
            <button class="btn btn-outline" (click)="loadFarmers()" id="filter-btn">🔍 Filter</button>
            <button class="btn btn-outline" (click)="resetFilter()" id="reset-filter-btn">↺ Reset</button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="spinner-wrap"><div class="spinner"></div></div>

      <!-- Table -->
      <div *ngIf="!loading && farmers.length" class="table-wrapper fade-in">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>District / Tehsil</th>
              <th>Land (Acres)</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let f of farmers">
              <td><span class="badge badge-blue">{{ f.id }}</span></td>
              <td><strong>{{ f.name }}</strong><br><small style="color:var(--color-text-muted)">{{ f.email }}</small></td>
              <td style="font-family:monospace">{{ f.phone }}</td>
              <td>{{ f.district }} <span style="color:var(--color-text-muted)">/</span> {{ f.tehsil }}</td>
              <td><span class="badge badge-green">{{ f.land_acres }} ac</span></td>
              <td style="color:var(--color-text-muted);font-size:0.8rem">{{ f.created_at | date:'mediumDate' }}</td>
              <td>
                <div style="display:flex;gap:8px">
                  <button class="btn btn-sm btn-outline" (click)="editFarmer(f)" [id]="'edit-farmer-'+f.id">✏️</button>
                  <button class="btn btn-sm btn-danger"  (click)="deleteFarmer(f.id)" [id]="'del-farmer-'+f.id">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && !farmers.length" class="empty-state card">
        <div class="icon">👨‍🌾</div>
        <h3>No farmers registered yet</h3>
        <p>Click "Add Farmer" to register the first farmer</p>
      </div>

      <!-- Modal -->
      <div class="modal-overlay" *ngIf="showForm" (click)="closeForm()">
        <div class="modal card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editMode ? 'Edit Farmer' : 'Register New Farmer' }}</h3>
            <button class="close-btn" (click)="closeForm()" id="close-modal-btn">✕</button>
          </div>
          <form (ngSubmit)="saveFarmer()" #farmerForm="ngForm">
            <div class="form-grid">
              <div class="form-group">
                <label>Full Name *</label>
                <input type="text"   [(ngModel)]="form.name"       name="name"       required placeholder="Ravi Kumar" id="input-name" />
              </div>
              <div class="form-group">
                <label>Phone Number *</label>
                <input type="text"   [(ngModel)]="form.phone"      name="phone"      required placeholder="9876543210" [disabled]="editMode" id="input-phone" />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email"  [(ngModel)]="form.email"      name="email"      placeholder="farmer@example.com" id="input-email" />
              </div>
              <div class="form-group">
                <label>Land (Acres)</label>
                <input type="number" [(ngModel)]="form.land_acres" name="land_acres" placeholder="12.5" step="0.1" min="0" id="input-land" />
              </div>
              <div class="form-group">
                <label>District *</label>
                <input type="text"   [(ngModel)]="form.district"   name="district"   required placeholder="Amritsar" id="input-district" />
              </div>
              <div class="form-group">
                <label>Tehsil *</label>
                <input type="text"   [(ngModel)]="form.tehsil"     name="tehsil"     required placeholder="Ajnala" id="input-tehsil" />
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-outline" (click)="closeForm()">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="saving || !farmerForm.valid" id="save-farmer-btn">
                {{ saving ? 'Saving...' : (editMode ? 'Update Farmer' : 'Register Farmer') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-bar { padding: 20px; }
    .filter-row {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 16px;
      align-items: end;
    }
    .filter-actions { display: flex; gap: 8px; }

    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(8px);
      z-index: 200;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .modal {
      width: 100%;
      max-width: 640px;
      max-height: 90vh;
      overflow-y: auto;
      animation: slideUp 0.3s ease;
    }
    @keyframes slideUp { from { transform: translateY(20px); opacity:0; } to { transform: translateY(0); opacity:1; } }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .close-btn {
      background: none; border: none; color: var(--color-text-muted);
      font-size: 1.2rem; cursor: pointer; padding: 4px 8px;
      border-radius: 4px; transition: all var(--transition);
    }
    .close-btn:hover { background: rgba(230,57,70,0.15); color: var(--color-error); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 12px; }

    @media (max-width: 600px) {
      .filter-row { grid-template-columns: 1fr; }
      .form-grid  { grid-template-columns: 1fr; }
    }
  `]
})
export class FarmersComponent implements OnInit {
  farmers:  any[]   = [];
  loading   = false;
  saving    = false;
  showForm  = false;
  editMode  = false;
  editId:   number | null = null;
  alert:    { type: string; message: string } | null = null;

  filter = { district: '', tehsil: '' };
  form   = { name: '', phone: '', email: '', district: '', tehsil: '', land_acres: 0 };

  constructor(private api: ApiService) {}

  ngOnInit() { this.loadFarmers(); }

  loadFarmers() {
    this.loading = true;
    this.api.getFarmers(this.filter).subscribe({
      next:  (res) => { this.farmers = res.data || []; this.loading = false; },
      error: (err) => { this.showAlert('error', err.message); this.loading = false; }
    });
  }

  openForm() {
    this.resetForm();
    this.editMode = false;
    this.showForm = true;
  }

  editFarmer(f: any) {
    this.form     = { name: f.name, phone: f.phone, email: f.email || '', district: f.district, tehsil: f.tehsil, land_acres: f.land_acres };
    this.editId   = f.id;
    this.editMode = true;
    this.showForm = true;
  }

  closeForm()  { this.showForm = false; this.resetForm(); }
  resetForm()  { this.form = { name: '', phone: '', email: '', district: '', tehsil: '', land_acres: 0 }; this.editId = null; }
  resetFilter(){ this.filter = { district: '', tehsil: '' }; this.loadFarmers(); }

  saveFarmer() {
    this.saving = true;
    const req = this.editMode && this.editId
      ? this.api.updateFarmer(this.editId, this.form)
      : this.api.createFarmer(this.form);

    req.subscribe({
      next:  ()  => { this.saving = false; this.closeForm(); this.loadFarmers(); this.showAlert('success', this.editMode ? 'Farmer updated!' : 'Farmer registered!'); },
      error: (e) => { this.saving = false; this.showAlert('error', e.message); }
    });
  }

  deleteFarmer(id: number) {
    if (!confirm('Delete this farmer record?')) return;
    this.api.deleteFarmer(id).subscribe({
      next:  () => { this.loadFarmers(); this.showAlert('success', 'Farmer deleted.'); },
      error: (e) => this.showAlert('error', e.message)
    });
  }

  showAlert(type: string, message: string) {
    this.alert = { type, message };
    setTimeout(() => this.alert = null, 4000);
  }
}
