declare module 'node-cron' {
  interface ScheduledTask {
    start: () => void;
    stop: () => void;
    destroy: () => void;
    getStatus: () => 'scheduled' | 'running' | 'stopped';
  }

  interface ScheduleOptions {
    scheduled?: boolean;
    timezone?: string;
  }

  function schedule(
    cronExpression: string,
    func: () => void | Promise<void>,
    options?: ScheduleOptions
  ): ScheduledTask;

  export { schedule };
}
