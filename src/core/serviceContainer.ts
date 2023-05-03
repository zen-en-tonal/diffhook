import { Service } from "./service";

export type ServiceContainer = {
  [key in string]: Service<any>;
};
