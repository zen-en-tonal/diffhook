import { Service } from "./core/service";
import { CronDriver } from "./drivers/cron";
import { DirectoryFetcher } from "./fetchers/directory";
import { JsonDiff } from "./generics/jsondiff";
import { ConsoleHook } from "./hooks/consoleHook";
import { FileMemo } from "./memos/file";

const serve = () => {
  const services = {
    dir: new Service(
      new DirectoryFetcher("."),
      new FileMemo("dir"),
      new JsonDiff(),
      new ConsoleHook()
    ),
  };
  const driver = new CronDriver("* * * * *", services);
  driver.run();
};

serve();
