import cron from "node-cron";

export const schedule = (expression: string, task: () => Promise<void>) => {
  let running = false;
  cron.schedule(expression, () => {
    if (running) return;
    running = true;
    task()
      .catch(console.error)
      .finally(() => (running = false));
  });
};
