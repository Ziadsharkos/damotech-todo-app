import { Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';

export interface TaskStats {
  total: number;
  active: number;
  completed: number;
  userId: string;
  timestamp: string;
}

export interface HealthCheckResponse {
  status: string;
  message: string;
  timestamp: string;
  functions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CloudFunctionsService {
  constructor(private functions: Functions) {}

  /**
   * Get task statistics for the current user
   * Calls the getTaskStats Cloud Function
   */
  async getTaskStats(): Promise<TaskStats> {
    console.log('Calling getTaskStats Cloud Function...');
    
    try {
      const getTaskStatsFn = httpsCallable<void, TaskStats>(
        this.functions,
        'getTaskStats'
      );
      
      const result = await getTaskStatsFn();
      console.log('Task stats received:', result.data);
      
      return result.data;
    } catch (error) {
      console.error('Error calling getTaskStats:', error);
      throw error;
    }
  }

  /**
   * Health check to verify functions are deployed
   */
  async checkHealth(): Promise<HealthCheckResponse> {
    console.log('Checking Cloud Functions health...');
    
    try {
      const healthCheckFn = httpsCallable<void, HealthCheckResponse>(
        this.functions,
        'healthCheck'
      );
      
      const result = await healthCheckFn();
      console.log('Health check passed:', result.data);
      
      return result.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}