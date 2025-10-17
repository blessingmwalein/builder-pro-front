# Ultimate Project Manager - Backend API Documentation

## Overview
This document outlines the complete backend API structure for the Ultimate Project Manager application, a comprehensive construction project management solution.

## Base URL
```
https://api.ultimate-project-manager.com/v1
```

## Authentication
All API endpoints (except authentication endpoints) require a Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

## Response Format
All API responses follow this standard format:
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "errors": null
}
```

Error responses:
```json
{
  "success": false,
  "data": null,
  "message": "Error message",
  "errors": {
    "field": ["Error description"]
  }
}
```

## 1. Authentication Endpoints

### 1.1 User Registration
**POST** `/auth/register-user`

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "password_confirmation": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": null,
      "position": null,
      "role": "admin",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token_here",
    "onboarding_step": "complete_profile"
  }
}
```

### 1.2 User Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "device_name": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "position": "Project Manager",
      "role": "admin",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token_here",
    "onboarding_step": "completed"
  }
}
```

### 1.3 Complete Profile
**POST** `/auth/complete-profile`

**Request Body:**
```json
{
  "phone": "string",
  "position": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "position": "Project Manager",
      "role": "admin",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  },
  "message": "Profile completed successfully"
}
```

### 1.4 Logout
**POST** `/auth/logout`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## 2. Company Management

### 2.1 Create Company
**POST** `/companies`

**Request Body:**
```json
{
  "name": "string",
  "slug": "string",
  "phone": "string",
  "country": "string",
  "timezone": "string",
  "currency": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "company": {
      "id": 1,
      "name": "Demo Construction Co.",
      "slug": "demo-construction",
      "phone": "+1-555-0123",
      "country": "US",
      "timezone": "America/New_York",
      "currency": "USD",
      "plan_code": null,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 2.2 Get Company Details
**GET** `/companies/{id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "company": {
      "id": 1,
      "name": "Demo Construction Co.",
      "slug": "demo-construction",
      "phone": "+1-555-0123",
      "country": "US",
      "timezone": "America/New_York",
      "currency": "USD",
      "plan_code": "pro",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 2.3 Update Company
**PUT** `/companies/{id}`

**Request Body:**
```json
{
  "name": "string",
  "phone": "string",
  "country": "string",
  "timezone": "string",
  "currency": "string"
}
```

### 2.4 Invite User to Company
**POST** `/companies/{id}/invite`

**Request Body:**
```json
{
  "email": "string",
  "name": "string",
  "role": "admin|project_manager|site_supervisor|viewer|client"
}
```

## 3. Project Management

### 3.1 Create Project
**POST** `/companies/{company_id}/projects`

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "status": "active|completed|on_hold|cancelled"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "project": {
      "id": 1,
      "name": "Downtown Office Complex",
      "description": "Modern office building construction",
      "start_date": "2024-01-01",
      "end_date": "2024-12-31",
      "status": "active",
      "company_id": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 3.2 Get Company Projects
**GET** `/companies/{company_id}/projects`

**Query Parameters:**
- `status`: Filter by status
- `page`: Page number for pagination
- `per_page`: Items per page (default: 15)

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "name": "Downtown Office Complex",
        "description": "Modern office building construction",
        "start_date": "2024-01-01",
        "end_date": "2024-12-31",
        "status": "active",
        "company_id": 1,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 1
  }
}
```

### 3.3 Get Project Details
**GET** `/projects/{id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "project": {
      "id": 1,
      "name": "Downtown Office Complex",
      "description": "Modern office building construction",
      "start_date": "2024-01-01",
      "end_date": "2024-12-31",
      "status": "active",
      "company_id": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "stats": {
        "total_tasks": 45,
        "completed_tasks": 23,
        "pending_tasks": 15,
        "in_progress_tasks": 7,
        "total_budget": 2500000,
        "spent_budget": 875000,
        "team_members": 12
      }
    }
  }
}
```

### 3.4 Update Project
**PUT** `/projects/{id}`

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "status": "active|completed|on_hold|cancelled"
}
```

### 3.5 Delete Project
**DELETE** `/projects/{id}`

## 4. Task Management

### 4.1 Create Task List
**POST** `/projects/{project_id}/task-lists`

**Request Body:**
```json
{
  "name": "string",
  "description": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "task_list": {
      "id": 1,
      "name": "Foundation",
      "description": "Foundation work tasks",
      "project_id": 1,
      "order_index": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 4.2 Get Project Task Lists
**GET** `/projects/{project_id}/task-lists`

**Response:**
```json
{
  "success": true,
  "data": {
    "task_lists": [
      {
        "id": 1,
        "name": "Foundation",
        "description": "Foundation work tasks",
        "project_id": 1,
        "order_index": 1,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 4.3 Create Task
**POST** `/task-lists/{task_list_id}/tasks`

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "assignee_id": 1,
  "priority": "low|medium|high",
  "due_date": "2024-01-15"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": 1,
      "title": "Excavate foundation",
      "description": "Excavate the foundation area",
      "task_list_id": 1,
      "assignee_id": 2,
      "assignee": {
        "id": 2,
        "name": "Mike Johnson",
        "email": "mike@example.com",
        "role": "site_supervisor"
      },
      "priority": "high",
      "status": "pending",
      "due_date": "2024-01-15",
      "order_index": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 4.4 Get Tasks by List
**GET** `/task-lists/{task_list_id}/tasks`

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": 1,
        "title": "Excavate foundation",
        "description": "Excavate the foundation area",
        "task_list_id": 1,
        "assignee_id": 2,
        "assignee": {
          "id": 2,
          "name": "Mike Johnson",
          "email": "mike@example.com",
          "role": "site_supervisor"
        },
        "priority": "high",
        "status": "pending",
        "due_date": "2024-01-15",
        "order_index": 1,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 4.5 Update Task Status
**PATCH** `/tasks/{id}/status`

**Request Body:**
```json
{
  "status": "pending|in_progress|completed|cancelled"
}
```

### 4.6 Reorder Tasks
**POST** `/task-lists/{task_list_id}/reorder-tasks`

**Request Body:**
```json
{
  "task_orders": [
    { "task_id": 1, "order_index": 1 },
    { "task_id": 2, "order_index": 2 }
  ]
}
```

## 5. Budget Management

### 5.1 Create Budget Category
**POST** `/projects/{project_id}/budget-categories`

**Request Body:**
```json
{
  "name": "string",
  "description": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      "id": 1,
      "name": "Materials",
      "description": "Construction materials",
      "project_id": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 5.2 Get Project Budget Categories
**GET** `/projects/{project_id}/budget-categories`

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Materials",
        "description": "Construction materials",
        "project_id": 1,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 5.3 Create Budget Item
**POST** `/budget-categories/{category_id}/items`

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "quantity": 100,
  "unit_price": 25.50,
  "unit": "sqft"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "item": {
      "id": 1,
      "category_id": 1,
      "category": {
        "id": 1,
        "name": "Materials",
        "description": "Construction materials"
      },
      "name": "Concrete",
      "description": "High-strength concrete",
      "quantity": 100,
      "unit_price": 25.50,
      "unit": "sqft",
      "total_price": 2550.00,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 5.4 Get Budget Items by Category
**GET** `/budget-categories/{category_id}/items`

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "category_id": 1,
        "category": {
          "id": 1,
          "name": "Materials",
          "description": "Construction materials"
        },
        "name": "Concrete",
        "description": "High-strength concrete",
        "quantity": 100,
        "unit_price": 25.50,
        "unit": "sqft",
        "total_price": 2550.00,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

## 6. Expense Management

### 6.1 Create Expense
**POST** `/projects/{project_id}/expenses`

**Request Body:**
```json
{
  "description": "string",
  "amount": 1500.00,
  "date": "2024-01-15",
  "category": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "expense": {
      "id": 1,
      "description": "Concrete delivery",
      "amount": 1500.00,
      "date": "2024-01-15",
      "category": "Materials",
      "receipt_url": null,
      "project_id": 1,
      "user_id": 1,
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 6.2 Get Project Expenses
**GET** `/projects/{project_id}/expenses`

**Query Parameters:**
- `category`: Filter by category
- `date_from`: Filter from date
- `date_to`: Filter to date
- `page`: Page number
- `per_page`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "description": "Concrete delivery",
        "amount": 1500.00,
        "date": "2024-01-15",
        "category": "Materials",
        "receipt_url": null,
        "project_id": 1,
        "user_id": 1,
        "user": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com"
        },
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 1
  }
}
```

## 7. Inspection Management

### 7.1 Create Inspection
**POST** `/projects/{project_id}/inspections`

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "scheduled_date": "2024-01-20",
  "council_officer": "string",
  "contact_email": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "inspection": {
      "id": 1,
      "title": "Foundation inspection",
      "description": "Inspect foundation work",
      "status": "pending",
      "scheduled_date": "2024-01-20",
      "council_officer": "Inspector Smith",
      "contact_email": "inspector@city.gov",
      "project_id": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 7.2 Get Project Inspections
**GET** `/projects/{project_id}/inspections`

**Response:**
```json
{
  "success": true,
  "data": {
    "inspections": [
      {
        "id": 1,
        "title": "Foundation inspection",
        "description": "Inspect foundation work",
        "status": "pending",
        "scheduled_date": "2024-01-20",
        "council_officer": "Inspector Smith",
        "contact_email": "inspector@city.gov",
        "project_id": 1,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 7.3 Update Inspection Status
**PATCH** `/inspections/{id}/status`

**Request Body:**
```json
{
  "status": "pending|completed|overdue"
}
```

## 8. Daily Logs

### 8.1 Create Daily Log
**POST** `/projects/{project_id}/daily-logs`

**Request Body:**
```json
{
  "date": "2024-01-15",
  "weather": "string",
  "summary": "string",
  "notes": "string",
  "manpower_count": 8,
  "materials_used": ["concrete", "steel"],
  "issues": ["rain delay"],
  "photos": ["url1", "url2"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "daily_log": {
      "id": 1,
      "date": "2024-01-15",
      "weather": "Partly cloudy",
      "summary": "Foundation work completed",
      "notes": "All foundation tasks completed on schedule",
      "manpower_count": 8,
      "materials_used": ["concrete", "steel"],
      "issues": ["rain delay"],
      "photos": ["url1", "url2"],
      "project_id": 1,
      "user_id": 1,
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 8.2 Get Project Daily Logs
**GET** `/projects/{project_id}/daily-logs`

**Query Parameters:**
- `date_from`: Filter from date
- `date_to`: Filter to date
- `page`: Page number
- `per_page`: Items per page

## 9. Chat System

### 9.1 Send Message
**POST** `/projects/{project_id}/chat/messages`

**Request Body:**
```json
{
  "message": "string",
  "attachment_url": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": {
      "id": 1,
      "message": "Foundation work is complete",
      "attachment_url": null,
      "user_id": 1,
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "project_id": 1,
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 9.2 Get Project Chat Messages
**GET** `/projects/{project_id}/chat/messages`

**Query Parameters:**
- `page`: Page number
- `per_page`: Items per page (default: 50)

## 10. Media Management

### 10.1 Upload Project Photo
**POST** `/projects/{project_id}/photos`

**Request Body (multipart/form-data):**
```
photo: file
caption: string
taken_at: 2024-01-15
```

**Response:**
```json
{
  "success": true,
  "data": {
    "photo": {
      "id": 1,
      "url": "https://storage.example.com/photos/photo1.jpg",
      "caption": "Foundation completed",
      "taken_at": "2024-01-15",
      "project_id": 1,
      "user_id": 1,
      "user": {
        "id": 1,
        "name": "John Doe"
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 10.2 Get Project Photos
**GET** `/projects/{project_id}/photos`

**Query Parameters:**
- `date_from`: Filter from date
- `date_to`: Filter to date
- `page`: Page number
- `per_page`: Items per page

## 11. Notifications

### 11.1 Get User Notifications
**GET** `/notifications`

**Query Parameters:**
- `unread_only`: Filter unread notifications
- `page`: Page number
- `per_page`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "title": "Task Assigned",
        "message": "You have been assigned a new task",
        "type": "info",
        "read_at": null,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 1
  }
}
```

### 11.2 Mark Notification as Read
**PATCH** `/notifications/{id}/read`

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

## 12. Analytics & Reports

### 12.1 Get Company Statistics
**GET** `/companies/{id}/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_projects": 5,
      "active_projects": 3,
      "completed_projects": 2,
      "total_users": 12,
      "total_budget": 5000000,
      "spent_budget": 1875000
    }
  }
}
```

### 12.2 Get Project Statistics
**GET** `/projects/{id}/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_tasks": 45,
      "completed_tasks": 23,
      "pending_tasks": 15,
      "in_progress_tasks": 7,
      "total_budget": 2500000,
      "spent_budget": 875000,
      "team_members": 12
    }
  }
}
```

### 12.3 Get AI Insights
**GET** `/projects/{id}/ai-insights`

**Response:**
```json
{
  "success": true,
  "data": {
    "insights": [
      {
        "id": "insight_1",
        "type": "cost_saving",
        "title": "Potential cost savings in materials",
        "description": "Based on current usage patterns, you could save 15% on materials by bulk ordering",
        "confidence_score": 0.85,
        "potential_savings": 37500,
        "priority": "medium",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

## 13. Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 422 | Validation Error - Invalid data format |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## 14. Rate Limiting

- Authentication endpoints: 5 requests per minute
- General endpoints: 100 requests per minute
- File uploads: 10 requests per minute

## 15. WebSocket Events

For real-time features like chat and notifications:

**Connection:**
```
wss://api.ultimate-project-manager.com/ws
```

**Events:**
- `chat.message`: New chat message
- `task.updated`: Task status changed
- `notification.new`: New notification
- `project.updated`: Project details updated

## 16. File Upload Guidelines

- **Supported formats**: JPG, PNG, PDF, DOC, DOCX
- **Max file size**: 10MB for images, 25MB for documents
- **Storage**: Files are stored in cloud storage (AWS S3 compatible)
- **Security**: Files are scanned for malware and validated

## 17. Pagination

All list endpoints support pagination with these parameters:
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 15, max: 100)

Response includes pagination metadata:
```json
{
  "current_page": 1,
  "last_page": 5,
  "per_page": 15,
  "total": 75
}
```

## 18. Filtering & Sorting

Most endpoints support filtering and sorting:

**Filtering:**
- `status`: Filter by status
- `date_from`/`date_to`: Date range filtering
- `category`: Category-based filtering
- `user_id`: User-specific filtering

**Sorting:**
- `sort_by`: Field to sort by
- `sort_order`: `asc` or `desc` (default: `desc`)

Example:
```
GET /projects?status=active&sort_by=created_at&sort_order=desc
```

## 19. Account Types

### 19.1 Create Individual Account
POST `/accounts/individual`

Body:
```json
{ "name": "string", "email": "string", "password": "string" }
```

### 19.2 Convert Individual to Company
POST `/accounts/convert-to-company`

Body:
```json
{ "company": { "name": "string", "slug": "string", "phone": "string", "country": "string", "timezone": "string", "currency": "string" } }
```

## 20. Plans & Subscriptions

### 20.1 List Plans
GET `/billing/plans`

Response:
```json
{ "success": true, "data": { "plans": [ { "id": 1, "code": "pro", "name": "Pro", "price": 49, "interval": "month", "currency": "USD" } ] } }
```

### 20.2 Get Plan Features
GET `/billing/plans/{code}/features`

Response:
```json
{ "success": true, "data": { "features": [ { "feature_key": "reports.enabled", "value": true } ] } }
```

### 20.3 Create Checkout Session
POST `/billing/checkout`

Body:
```json
{ "plan_code": "pro", "subject_type": "company|user", "subject_id": 1, "success_url": "https://app/success", "cancel_url": "https://app/cancel" }
```

### 20.4 Manage Customer Portal
POST `/billing/portal`

Body:
```json
{ "subject_type": "company|user", "subject_id": 1, "return_url": "https://app/billing" }
```

### 20.5 Get Current Subscription
GET `/billing/subscriptions?subject_type=company&subject_id=1`

### 20.6 Webhooks
POST `/billing/webhooks/stripe`

## 21. Entitlements & Feature Flags

### 21.1 Get Effective Entitlements
GET `/entitlements?subject_type=company&subject_id=1`

Response:
```json
{ "success": true, "data": { "entitlements": { "projects.max_count": 50, "reports.enabled": true, "maps.geofence_polygon": true } } }
```

### 21.2 Override Feature for Subject
POST `/feature-flags/overrides`

Body:
```json
{ "subject_type": "company|user", "subject_id": 1, "feature_key": "reports.enabled", "value": false }
```

### 21.3 Remove Override
DELETE `/feature-flags/overrides/{id}`

## 22. Requested Features Endpoints

### 22.1 Guide System Helper
- GET `/guides/helper` → fetch contextual guide steps
- POST `/guides/helper/complete` → mark step complete

### 22.2 Renovations
- CRUD endpoints under `/projects/{project_id}/renovations`
  - Entities: scopes, phases, materials, approvals

### 22.3 Priority Colors on Tasks
PATCH `/tasks/{id}/priority-color`

Body:
```json
{ "color": "#RRGGBB" }
```

### 22.4 Settings (Receipt)
GET `/billing/receipt-settings`
POST `/billing/receipt-settings`

Body:
```json
{ "company_name": "string", "address": "string", "tax_id": "string", "logo_url": "string" }
```

### 22.5 Reports
- GET `/reports/templates`
- POST `/reports/run` with filters
- GET `/reports/{id}/download`

### 22.6 Inspection Groups
- CRUD under `/projects/{project_id}/inspection-groups`
- Assign inspections to groups: POST `/inspection-groups/{group_id}/inspections/{inspection_id}`

### 22.7 Daily Logs Settings
- GET `/projects/{project_id}/daily-logs/settings`
- PUT `/projects/{project_id}/daily-logs/settings`

Body:
```json
{ "required_fields": ["weather","manpower_count"], "photo_required": false, "templates": ["general","concrete"] }
```

### 22.8 Project Location Geofence (Google Maps)
- GET `/projects/{project_id}/geofence`
- PUT `/projects/{project_id}/geofence`

Body (GeoJSON):
```json
{ "type": "Polygon", "coordinates": [[[lng, lat], [lng, lat], [lng, lat], [lng, lat]]] }
```

Validation: closed polygon, max vertices (e.g., 200), CRS WGS84.
