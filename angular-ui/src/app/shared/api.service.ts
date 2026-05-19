// ============================================================
// API Service — Central HTTP client for all microservices
// ============================================================
import { Injectable }    from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError }  from 'rxjs';
import { catchError }    from 'rxjs/operators';
import { environment }   from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private readonly base = environment.apiGateway; // http://localhost:8080

  constructor(private http: HttpClient) {}

  // ── Farmers ────────────────────────────────────────────────
  getFarmers(filters?: { district?: string; tehsil?: string }): Observable<any> {
    const params: any = {};
    if (filters?.district) params['district'] = filters.district;
    if (filters?.tehsil)   params['tehsil']   = filters.tehsil;
    return this.http.get(`${this.base}/api/farmers`, { params }).pipe(catchError(this.handle));
  }
  getFarmer(id: number): Observable<any> {
    return this.http.get(`${this.base}/api/farmers/${id}`).pipe(catchError(this.handle));
  }
  createFarmer(data: any): Observable<any> {
    return this.http.post(`${this.base}/api/farmers`, data).pipe(catchError(this.handle));
  }
  updateFarmer(id: number, data: any): Observable<any> {
    return this.http.put(`${this.base}/api/farmers/${id}`, data).pipe(catchError(this.handle));
  }
  deleteFarmer(id: number): Observable<any> {
    return this.http.delete(`${this.base}/api/farmers/${id}`).pipe(catchError(this.handle));
  }

  // ── Crops ──────────────────────────────────────────────────
  getCrops(filters?: { farmer_id?: number; season?: string; status?: string }): Observable<any> {
    const params: any = {};
    if (filters?.farmer_id) params['farmer_id'] = String(filters.farmer_id);
    if (filters?.season)    params['season']     = filters.season;
    if (filters?.status)    params['status']     = filters.status;
    return this.http.get(`${this.base}/api/crops`, { params }).pipe(catchError(this.handle));
  }
  createCrop(data: any): Observable<any> {
    return this.http.post(`${this.base}/api/crops`, data).pipe(catchError(this.handle));
  }
  updateCrop(id: number, data: any): Observable<any> {
    return this.http.put(`${this.base}/api/crops/${id}`, data).pipe(catchError(this.handle));
  }
  deleteCrop(id: number): Observable<any> {
    return this.http.delete(`${this.base}/api/crops/${id}`).pipe(catchError(this.handle));
  }

  // ── Schemes ────────────────────────────────────────────────
  getSchemes(): Observable<any> {
    return this.http.get(`${this.base}/api/schemes`).pipe(catchError(this.handle));
  }
  checkEligibility(land_acres: number, crop_name?: string): Observable<any> {
    return this.http.post(`${this.base}/api/schemes/check-eligibility`, { land_acres, crop_name })
      .pipe(catchError(this.handle));
  }
  applyScheme(farmer_id: number, scheme_id: number): Observable<any> {
    return this.http.post(`${this.base}/api/schemes/apply`, { farmer_id, scheme_id })
      .pipe(catchError(this.handle));
  }

  private handle(err: HttpErrorResponse) {
    const msg = err.error?.message || err.message || 'Unknown error';
    return throwError(() => new Error(msg));
  }
}
