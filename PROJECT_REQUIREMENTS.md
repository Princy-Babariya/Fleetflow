# FleetFlow — Project Requirements

This document captures the functional requirements and acceptance criteria derived from the provided mockups and notes. Use it as the canonical feature spec for planning frontend and backend work.

## Overview
- Purpose: Provide a complete fleet management web app with role-based access (Admin / Dispatcher / Driver / Manager) covering: Dashboard overview, Vehicle registry, Trip dispatching, Maintenance & service, Fuel & expenses, Driver performance, and Operational analytics & financial reports.

## Pages & Primary UI Components

1. Dashboard (Fleet Overview)
   - Top-level KPIs: Active Fleet, Maintenance Due, Pending Jobs (numeric tiles).
   - Quick filters: by depot, vehicle type, status.
   - Live lists: Recent trips, Upcoming maintenance, Alerts.
   - Charts: Fuel efficiency trend, Trips by status, Vehicle utilization.
   - Acceptance: Dashboard data must come from `/api/analytics/overview`.

2. Vehicle Registry
   - Vehicle list table with columns: Reg No, Type, Capacity, Odometer, Status, Location.
   - Add / Edit vehicle modal with fields: Registration, Plate, VIN, Type, Capacity, Odometer, Make, Model, Year, Status, Assigned Driver.
   - Search, sort, and pagination.
   - Acceptance: CRUD via `/api/vehicles` endpoints; validation on required fields.

3. Trip Dispatcher
   - Create trip form: origin, destination, vehicle selection, driver selection, cargo details, schedule (start/end), priority.
   - Trip list: queued, in-progress, completed, canceled; ability to assign/unassign vehicles and drivers.
   - Trip details view with status updates and logs.
   - Acceptance: Backend endpoints `/api/trips` supporting create, update status, assign vehicle/driver.

4. Maintenance & Service Logs
   - Maintenance list with date, vehicle, service type, cost, status, next due.
   - Add maintenance record modal capturing vendor, work done, odometer, cost, next service date.
   - Acceptance: CRUD via `/api/maintenance` with notifications when next service is due.

5. Expenses & Fuel Tracking
   - Fuel/expense entries per vehicle: date, fuel liters, cost, odometer, supplier, receipt attachment optional.
   - Aggregations: fuel cost by period, fuel efficiency (km/l or mpg), cost per vehicle.
   - Acceptance: Backend `/api/fuel` or `/api/expenses` endpoints and dashboard charts.

6. Driver Performance & Safety
   - Driver list with metrics: trips, on-time %, incidents, fuel efficiency.
   - Per-driver detail page with recent trips, incidents, certifications, and compliance expiry dates.
   - Acceptance: UI reads from `/api/drivers` and `/api/analytics/drivers`.

7. Analytics & Financial Reports
   - Time-series charts (fuel trend, trips, revenue), pie charts (cost breakdown), KPI cards (total revenue, operational cost, ROI per vehicle).
   - CSV/Excel export of core datasets (trips, expenses, maintenance).
   - Acceptance: Backend provides aggregated endpoints (e.g., `/api/analytics/overview`, `/api/analytics/financials`) with parameters for date ranges.

## Backend API Mapping (recommended endpoints)
- Auth: `POST /api/auth/register`, `POST /api/auth/login` (existing)
- Vehicles: `GET /api/vehicles`, `POST /api/vehicles`, `GET /api/vehicles/:id`, `PUT /api/vehicles/:id`, `DELETE /api/vehicles/:id`
- Trips: `GET /api/trips`, `POST /api/trips`, `GET /api/trips/:id`, `PUT /api/trips/:id` (status updates), `POST /api/trips/:id/assign` (assign vehicle/driver)
- Maintenance: `GET /api/maintenance`, `POST /api/maintenance`, `PUT /api/maintenance/:id`, `DELETE /api/maintenance/:id`
- Fuel/Expenses: `GET /api/fuel`, `POST /api/fuel`, `GET /api/expenses`, `POST /api/expenses`
- Drivers: `GET /api/drivers`, `POST /api/drivers`, `PUT /api/drivers/:id`, `DELETE /api/drivers/:id`
- Analytics: `GET /api/analytics/overview`, `GET /api/analytics/financials`, `GET /api/analytics/drivers`

## Data Model Notes (high-level)
- Vehicle: registration, plate, vin, type, capacity, odometer, make, model, year, status, assignedDriverId, location.
- Trip: origin, destination, vehicleId, driverId, cargo, startTime, endTime, status, costEstimate, actualCost.
- Maintenance: vehicleId, vendor, serviceType, description, cost, datePerformed, odometer, nextDueDate.
- Fuel/Expense: vehicleId, date, liters, cost, odometer, supplier, category.
- Driver: userId, licenseNumber, certifications, performanceMetrics, incidents.

## Acceptance Criteria / Done Definition
- All pages fetch real data from backend endpoints, not static placeholders.
- Role-based access enforced: only allowed roles see create/edit/delete actions.
- Forms perform client- and server-side validation for required fields.
- Dashboard and analytics must reflect stored records (i.e., persistence verified in DB).
- Exports: CSV export should work for trips and expenses.

## MVP & Priority Roadmap (suggested)
1. Stabilize backend (fix current crashes) and ensure auth + vehicles CRUD work end-to-end.
2. Dashboard overview + analytics endpoint for KPIs.
3. Trip dispatcher: basic create/list/update workflows.
4. Maintenance records and notifications.
5. Fuel/expenses tracking and charts.
6. Driver performance page and exports.

## Developer Notes
- Seed script recommended: generate ~20 vehicles, ~50 trips, ~100 fuel/expense records, and ~20 maintenance records for demo analytics.
- Tests: write API integration tests for auth, vehicles, trips (critical paths).

---
If you want, I can:
- Update `README.md` features section to reference these requirements.
- Start implementing prioritized items (backend stability, auth persistence, vehicles, dashboard) — tell me which to do first.
