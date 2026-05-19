// ============================================================
// App Root Component
// ============================================================
import { Component }                 from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule }              from '@angular/common';

@Component({
  selector:    'app-root',
  standalone:  true,
  imports:     [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app-shell">
      <!-- ── Sidebar ─────────────────────────────────────── -->
      <aside class="sidebar" [class.open]="sidebarOpen">
        <div class="sidebar-brand">
          <span class="brand-icon">🌾</span>
          <div class="brand-text">
            <span class="brand-name">AgriPortal</span>
            <span class="brand-sub">Agriculture Dept.</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/"        routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="nav-item" (click)="sidebarOpen=false">
            <span class="nav-icon">📊</span> <span>Dashboard</span>
          </a>
          <a routerLink="/farmers" routerLinkActive="active" class="nav-item" (click)="sidebarOpen=false">
            <span class="nav-icon">👨‍🌾</span> <span>Farmers</span>
          </a>
          <a routerLink="/crops"   routerLinkActive="active" class="nav-item" (click)="sidebarOpen=false">
            <span class="nav-icon">🌱</span> <span>Crops</span>
          </a>
          <a routerLink="/schemes" routerLinkActive="active" class="nav-item" (click)="sidebarOpen=false">
            <span class="nav-icon">📋</span> <span>Schemes</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="service-status">
            <div class="status-dot green"></div>
            <span>All Services Online</span>
          </div>
        </div>
      </aside>

      <!-- ── Overlay ────────────────────────────────────── -->
      <div class="sidebar-overlay" *ngIf="sidebarOpen" (click)="sidebarOpen=false"></div>

      <!-- ── Main Content ───────────────────────────────── -->
      <div class="main-content">
        <header class="topbar">
          <button class="menu-btn" (click)="sidebarOpen=!sidebarOpen" id="menu-toggle-btn">☰</button>
          <div class="topbar-title">Agriculture Department Management System</div>
          <div class="topbar-actions">
            <span class="topbar-badge">v1.0</span>
          </div>
        </header>

        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      min-height: 100vh;
      background: var(--color-bg);
    }

    /* ── Sidebar ──────────────────────────── */
    .sidebar {
      width: 260px;
      min-height: 100vh;
      background: var(--color-surface);
      border-right: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0; top: 0; bottom: 0;
      z-index: 100;
      transition: transform 0.3s ease;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 28px 20px 24px;
      border-bottom: 1px solid var(--color-border);
    }
    .brand-icon {
      font-size: 2.2rem;
      filter: drop-shadow(0 0 12px rgba(82,183,136,0.6));
    }
    .brand-name {
      display: block;
      font-family: var(--font-heading);
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--color-text);
      background: linear-gradient(135deg, #52b788, #f4a261);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .brand-sub {
      display: block;
      font-size: 0.7rem;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-top: 2px;
    }

    .sidebar-nav {
      padding: 20px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: var(--radius-sm);
      color: var(--color-text-muted);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.95rem;
      transition: all var(--transition);
    }
    .nav-item:hover {
      background: rgba(64,145,108,0.1);
      color: var(--color-text);
    }
    .nav-item.active {
      background: linear-gradient(135deg, rgba(45,106,79,0.5), rgba(64,145,108,0.3));
      color: var(--color-success);
      border: 1px solid rgba(64,145,108,0.3);
    }
    .nav-icon { font-size: 1.2rem; width: 24px; text-align: center; }

    .sidebar-footer {
      padding: 16px 20px;
      border-top: 1px solid var(--color-border);
    }
    .service-status {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.8rem;
      color: var(--color-text-muted);
    }
    .status-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .status-dot.green {
      background: var(--color-success);
      box-shadow: 0 0 8px rgba(82,183,136,0.8);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    /* ── Main Content ─────────────────────── */
    .main-content {
      flex: 1;
      margin-left: 260px;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .topbar {
      height: 64px;
      background: rgba(19,42,30,0.8);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 0 24px;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .menu-btn {
      background: none;
      border: none;
      color: var(--color-text-muted);
      font-size: 1.4rem;
      cursor: pointer;
      display: none;
      padding: 4px 8px;
    }
    .topbar-title {
      flex: 1;
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--color-text-muted);
    }
    .topbar-badge {
      background: rgba(64,145,108,0.2);
      color: var(--color-success);
      border: 1px solid rgba(64,145,108,0.4);
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .page-content {
      flex: 1;
      padding: 32px 24px;
    }

    /* ── Overlay ─────────────────────────── */
    .sidebar-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 90;
    }

    /* ── Responsive ──────────────────────── */
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }
      .sidebar.open {
        transform: translateX(0);
      }
      .sidebar-overlay {
        display: block;
      }
      .main-content {
        margin-left: 0;
      }
      .menu-btn {
        display: block;
      }
    }
  `]
})
export class AppComponent {
  sidebarOpen = false;
}
