import { CronJob } from "cron";
import { ServiceContainer } from "../core/serviceContainer";
import { CronJobParameters } from "cron";
import { Driver } from "../core/driver";

type Options = Omit<CronJobParameters, "cronTime" | "onTick" | "start">;

export class CronDriver extends Driver {
  constructor(
    private readonly cronTime: string,
    service: ServiceContainer,
    private readonly options: Partial<Options> = {}
  ) {
    super(service);
  }

  run() {
    const job = new CronJob(
      this.cronTime,
      async () => await this.runServices(),
      this.options.onComplete,
      false,
      this.options.timeZone,
      this.options.context,
      this.options.runOnInit,
      this.options.utcOffset,
      this.options.unrefTimeout
    );
    job.start();
  }
}
