export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

export interface Dashboard {
  id: string;
  user_id: string;
  data: {
    layout?: any[];
    widgets?: any[];
    settings?: Record<string, any>;
  };
  created_at: Date;
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  config: {
    credentials?: Record<string, any>;
    settings?: Record<string, any>;
    status?: string;
  };
  user_id: string;
  created_at: Date;
} 