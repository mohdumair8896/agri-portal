// ============================================================
// Dashboard Component
// ============================================================
import { Component, OnInit }  from '@angular/core';
import { CommonModule }       from '@angular/common';
import { RouterLink }         from '@angular/router';
import { ApiService }         from '../shared/api.service';
import { forkJoin, of }       from 'rxjs';
import { catchError }         from 'rxjs/operators';

@Component({
  selector:   'app-dashboard',
  standalone: true,
  imports:    [CommonModule, RouterLink],
  template: `
    <div class="fade-in">
      <!-- Hero Banner -->
      <div class="hero-banner">
        <div class="hero-content">
          <h1>Welcome to <span class="accent">AgriPortal</span></h1>
          <p>Agriculture Department Management System — Empowering farmers across districts and tehsils</p>
        </div>
        <div class="hero-art">🌾</div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid fade-in fade-in-delay-1">
        <div class="stat-card">
          <div class="stat-icon green">👨‍🌾</div>
          <div>
            <div class="stat-value">{{ stats.farmers }}</div>
            <div class="stat-label">Registered Farmers</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">🌱</div>
          <div>
            <div class="stat-value">{{ stats.crops }}</div>
            <div class="stat-label">Active Crop Records</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue">📋</div>
          <div>
            <div class="stat-value">{{ stats.schemes }}</div>
            <div class="stat-label">Govt. Schemes Available</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon red">🏘️</div>
          <div>
            <div class="stat-value">{{ stats.districts }}</div>
            <div class="stat-label">Districts Covered</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="section-title fade-in fade-in-delay-2">
        <h2>Quick Actions</h2>
      </div>
      <div class="actions-grid fade-in fade-in-delay-2">
        <a routerLink="/farmers" class="action-card">
          <div class="action-icon">👨‍🌾</div>
          <div class="action-info">
            <h3>Register Farmer</h3>
            <p>Add new farmer to the system with complete profile</p>
          </div>
          <span class="action-arrow">→</span>
        </a>
        <a routerLink="/crops" class="action-card">
          <div class="action-icon">🌾</div>
          <div class="action-info">
            <h3>Manage Crops</h3>
            <p>Track Kharif, Rabi & Zaid crop records per farmer</p>
          </div>
          <span class="action-arrow">→</span>
        </a>
        <a routerLink="/schemes" class="action-card">
          <div class="action-icon">📋</div>
          <div class="action-info">
            <h3>Check Eligibility</h3>
            <p>Verify scheme eligibility based on land & crop</p>
          </div>
          <span class="action-arrow">→</span>
        </a>
      </div>

      <!-- Services Status -->
      <div class="section-title fade-in fade-in-delay-3">
        <h2>Microservices Status</h2>
      </div>
      <div class="services-grid fade-in fade-in-delay-3">
        <div class="service-card" *ngFor="let svc of services">
          <div class="svc-dot" [class.online]="svc.online" [class.offline]="!svc.online"></div>
          <div class="svc-info">
            <div class="svc-name">{{ svc.name }}</div>
            <div class="svc-url">{{ svc.url }}</div>
          </div>
          <span class="badge" [class.badge-green]="svc.online" [class.badge-red]="!svc.online">
            {{ svc.online ? 'Online' : 'Offline' }}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-banner {
      background: linear-gradient(135deg, var(--color-surface-2), var(--color-surface));
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      padding: 48px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 32px;
      position: relative;
      overflow: hidden;
    }
    .hero-banner::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(64,145,108,0.15), transparent 70%);
      pointer-events: none;
    }
    .hero-content h1 { margin-bottom: 12px; }
    .hero-content p  { font-size: 1rem; max-width: 500px; }
    .accent { color: var(--color-accent); }
    .hero-art { font-size: 6rem; filter: drop-shadow(0 0 30px rgba(82,183,136,0.5)); }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .section-title { margin-bottom: 20px; }
    .section-title h2 { font-size: 1.3rem; }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
      margin-bottom: 40px;
    }
    .action-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      text-decoration: none;
      color: var(--color-text);
      transition: all var(--transition);
    }
    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--glow-green);
      border-color: var(--color-primary-light);
    }
    .action-icon { font-size: 2.4rem; flex-shrink: 0; }
    .action-info { flex: 1; }
    .action-info h3 { font-size: 1rem; margin-bottom: 4px; }
    .action-info p  { font-size: 0.82rem; }
    .action-arrow { font-size: 1.4rem; color: var(--color-primary-light); opacity: 0.6; transition: all var(--transition); }
    .action-card:hover .action-arrow { opacity: 1; transform: translateX(4px); }

    .services-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .service-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .svc-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .svc-dot.online  { background: var(--color-success); box-shadow: 0 0 8px rgba(82,183,136,0.8); }
    .svc-dot.offline { background: var(--color-error);   box-shadow: 0 0 8px rgba(230,57,70,0.5); }
    .svc-info { flex: 1; }
    .svc-name { font-weight: 600; font-size: 0.9rem; }
    .svc-url  { font-size: 0.8rem; color: var(--color-text-muted); font-family: monospace; }

    @media (max-width: 768px) {
      .hero-banner { flex-direction: column; text-align: center; padding: 32px 20px; }
      .hero-art { font-size: 4rem; margin-top: 16px; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats = { farmers: 0, crops: 0, schemes: 0, districts: 0 };

  services = [
    { name: 'farmer-service',  url: 'http://localhost:8081', online: false },
    { name: 'crop-service',    url: 'http://localhost:8082', online: false },
    { name: 'scheme-service',  url: 'http://localhost:8083', online: false },
    { name: 'api-gateway',     url: 'http://localhost:8080', online: false },
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    forkJoin({
      farmers: this.api.getFarmers().pipe(catchError(() => of({ data: [] }))),
      crops:   this.api.getCrops().pipe(catchError(() => of({ data: [] }))),
      schemes: this.api.getSchemes().pipe(catchError(() => of({ data: [] }))),
    }).subscribe(({ farmers, crops, schemes }) => {
      this.stats.farmers  = farmers.count  || 0;
      this.stats.crops    = crops.count    || 0;
      this.stats.schemes  = schemes.count  || 0;
      const districts = new Set((farmers.data || []).map((f: any) => f.district));
      this.stats.districts = districts.size;

      // Mark gateway online since we got data
      this.services[3].online = true;
      this.services[0].online = farmers.count >= 0;
      this.services[1].online = crops.count   >= 0;
      this.services[2].online = schemes.count >= 0;
    });
  }
}
