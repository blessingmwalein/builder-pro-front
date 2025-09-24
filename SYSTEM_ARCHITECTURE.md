# Ultimate Project Manager - System Architecture

## Overview
The Ultimate Project Manager uses a modern microservices architecture with Next.js frontend, RESTful APIs, and cloud-native infrastructure.

## Architecture Components

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS
- **Type Safety**: TypeScript
- **Components**: Modular component architecture

### Backend Services
- **API Gateway**: Authentication, rate limiting, routing
- **User Service**: Authentication, user management
- **Project Service**: Project CRUD operations
- **Task Service**: Task management and workflows
- **Budget Service**: Financial management
- **File Service**: Document and media storage
- **Notification Service**: Real-time notifications

### Database Layer
- **Primary Database**: PostgreSQL with multi-tenancy
- **Caching**: Redis for sessions and data caching
- **File Storage**: AWS S3 / Azure Blob Storage
- **Search**: Elasticsearch for advanced search

### Infrastructure
- **Cloud Platform**: AWS or Azure
- **Containerization**: Docker + Kubernetes
- **Load Balancing**: Application Load Balancer
- **CDN**: CloudFront for static assets
- **Monitoring**: CloudWatch + custom metrics

## Data Flow

```
User Request → API Gateway → Load Balancer → Service → Database
                ↓
            Authentication → Rate Limiting → Routing → Response
```

## Security Features
- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- Data encryption at rest and in transit
- Multi-factor authentication (MFA)
- API rate limiting and DDoS protection

## Scalability Features
- Horizontal scaling with auto-scaling groups
- Database read replicas
- Redis clustering
- CDN for global content delivery
- Microservices for independent scaling

## Performance Targets
- API response time: < 200ms (95th percentile)
- Concurrent users: 10,000+
- Uptime: 99.9%
- Database queries: < 100ms

## Deployment Strategy
- **Development**: Docker Compose
- **Staging**: Kubernetes cluster
- **Production**: Multi-region Kubernetes with blue-green deployment
- **CI/CD**: GitHub Actions with automated testing and deployment

## Account Types

- **Individual Account**: Personal workspace. Scope of data and entitlements is tied to `user_id`. May optionally create/join a company later.
- **Company Account**: Organization workspace. Scope of data and entitlements is tied to `company_id`. Users belong to companies with roles and permissions.
- **Multi-tenancy**: All domain entities reference `company_id` when in company context; individual context stores `owner_user_id` and `company_id = null`.

## Subscriptions & Entitlements

### Concepts
- **Plan**: A SKU with pricing and limits (e.g., Free, Pro, Business, Enterprise).
- **Entitlement**: A boolean or numeric limit that unlocks a feature or quota.
- **Feature Flag**: Runtime gate to enable/disable features per plan, company, or user.
- **Subscription**: Active plan assignment to a company or individual account with billing state.

### Enforcement
- API gateway injects `entitlements` into request context after token verification.
- Services check entitlements via a lightweight SDK/middleware.
- Rate limits and quotas enforced at write-time and periodically via jobs.

### Data Model (high-level)
- `plans`: id, code, name, price, interval, currency, metadata
- `plan_features`: plan_id, feature_key, value (boolean|number|string), limit_unit
- `subscriptions`: id, subject_type (company|user), subject_id, plan_id, status, current_period_start, current_period_end, cancel_at_period_end
- `usage_counters`: subject_type, subject_id, feature_key, period, used

### Feature Keys (examples)
- `projects.max_count` (number)
- `tasks.priority_colors` (boolean)
- `reports.enabled` (boolean)
- `inspections.groups` (boolean)
- `daily_logs.settings` (boolean)
- `maps.geofence_polygon` (boolean)
- `guides.helper` (boolean)
- `renovations.enabled` (boolean)

## Feature Flag Service

- Backed by Redis for low-latency reads; persisted in Postgres.
- Evaluation order: overrides (per subject) > plan entitlements > global default.
- SDK method: `hasFeature(subject, key)` and `getLimit(subject, key)`.

## Billing Integration

- **Provider**: Stripe (recommended). Support for manual invoicing for Enterprise.
- **Flows**:
  - Checkout session → Webhook updates `subscriptions`.
  - Customer portal for plan changes and invoices.
  - Proration handled by provider.
- **Webhooks**: `checkout.session.completed`, `customer.subscription.updated`, `invoice.payment_succeeded|failed`.
- **Dunning**: Auto email on failed payments; grace period configurable.

## Requested Feature Mappings (Entitlements)

- Guide System Helper → `guides.helper` (boolean)
- Renovations → `renovations.enabled` (boolean)
- Priority Colors on Tasks → `tasks.priority_colors` (boolean) + palette config per project
- Settings (receipt) → `billing.receipt_settings` (boolean)
- Reports → `reports.enabled` (boolean) with report templates limit
- Inspection Groups → `inspections.groups` (boolean) with groups CRUD
- Daily Logs Settings → `daily_logs.settings` (boolean)
- Project Geofence Polyline (Google Maps) → `maps.geofence_polygon` (boolean)

## Google Maps & Geofence

- Store geofence as GeoJSON Polygon/MultiPolygon linked to `project_id`.
- Render via Google Maps JS API inside the app.
- Validate simple polygon, auto-close first/last point.
- Optional reverse-geocoding for project address validation.

## Quotas & Limits (examples)

- Free: projects.max_count=3, photos.max_storage_mb=200, reports.enabled=false
- Pro: projects.max_count=50, guides.helper=true, reports.enabled=true
- Business: unlimited projects, inspection groups enabled, geofence enabled
- Enterprise: SSO, custom limits, priority support
