// User types
export interface User {
  id: number;
  name: string;
  email: string;
  account_type?: 'company' | 'individual';
  avatar_url?: string | null;
  phone?: string;
  position?: string;
  role: 'admin' | 'project_manager' | 'site_supervisor' | 'viewer' | 'client';
  created_at: string;
  updated_at: string;
}

// Company types
export interface Company {
  id: number;
  name: string;
  slug: string;
  phone: string;
  country: string;
  timezone: string;
  currency: string;
  plan_code?: string;
  created_at: string;
  updated_at: string;
}

// Project types
export interface Project {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  company_id: number;
  created_at: string;
  updated_at: string;
}

// Task types
export interface TaskList {
  id: number;
  name: string;
  description: string;
  project_id: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  task_list_id: number;
  assignee_id?: number;
  assignee?: User;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// Budget types
export interface BudgetCategory {
  id: number;
  name: string;
  description: string;
  project_id: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetItem {
  id: number;
  category_id: number;
  category?: BudgetCategory;
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  unit: string;
  total_price: number;
  created_at: string;
  updated_at: string;
}

// Expense types
export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  receipt_url?: string;
  project_id: number;
  user_id: number;
  user?: User;
  created_at: string;
  updated_at: string;
}

// Inspection types
export interface Inspection {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'overdue';
  scheduled_date: string;
  council_officer: string;
  contact_email: string;
  project_id: number;
  created_at: string;
  updated_at: string;
}

// Daily Log types
export interface DailyLog {
  id: number;
  date: string;
  weather: string;
  summary: string;
  notes: string;
  manpower_count: number;
  materials_used: string[];
  issues: string[];
  photos: string[];
  project_id: number;
  user_id: number;
  user?: User;
  created_at: string;
  updated_at: string;
}

// Notification types
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read_at?: string;
  created_at: string;
}

// Chat types
export interface ChatMessage {
  id: number;
  message: string;
  attachment_url?: string;
  user_id: number;
  user?: User;
  project_id: number;
  created_at: string;
}

// Media types
export interface ProjectPhoto {
  id: number;
  url: string;
  caption: string;
  taken_at: string;
  project_id: number;
  user_id: number;
  user?: User;
  created_at: string;
}

// Stats types
export interface ProjectStats {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  in_progress_tasks: number;
  total_budget: number;
  spent_budget: number;
  team_members: number;
}

export interface CompanyStats {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_users: number;
  total_budget: number;
  spent_budget: number;
}

// AI Insights types
export interface AIInsight {
  id: string;
  type: 'cost_saving' | 'efficiency' | 'risk' | 'recommendation';
  title: string;
  description: string;
  confidence_score: number;
  potential_savings?: number;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Form types
export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginForm {
  email: string;
  password: string;
  device_name: string;
}

export interface CompleteProfileForm {
  phone: string;
  position: string;
  name?: string;
  account_type?: 'company' | 'individual';
  avatar_url?: string;
}

export interface CreateCompanyForm {
  name: string;
  slug: string;
  phone: string;
  country: string;
  timezone: string;
  currency: string;
}

export interface Plan {
  id: number;
  code: string;
  name: string;
  price_cents: number;
  currency: string;
  interval: 'month' | 'year' | string;
  max_projects: number;
  max_users: number;
  features: string[];
  created_at: string;
  updated_at: string;
}

export interface ActivePlan {
  id: number;
  user_id: number;
  plan_id: number;
  status: string;
  starts_at: string | null;
  ends_at: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  canceled_at: string | null;
  meta: unknown | null;
  created_at: string;
  updated_at: string;
  plan: Plan;
}

export interface CreateProjectForm {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
}

export interface CreateTaskForm {
  title: string;
  description: string;
  task_list_id: number;
  assignee_id?: number;
  priority: string;
  due_date?: string;
}

export interface CreateExpenseForm {
  description: string;
  amount: number;
  date: string;
  category: string;
}

export interface InviteUserForm {
  email: string;
  name: string;
  role: string;
}

