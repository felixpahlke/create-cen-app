import { TemplateDeps } from "./index.js";
import type { AvailableBackends, PkgInstallerMap } from "~/installers/index.js";

interface BuildUsedDependenciesProps {
  packages: PkgInstallerMap;
  backend: AvailableBackends;
}

export const buildUsedDependencies = ({ packages, backend }: BuildUsedDependenciesProps) => {
  const usedDependencies: TemplateDeps[] = [];

  if (backend === "trpc") {
    usedDependencies.push("trpc");
  }
  if (backend === "fastapi" || backend === "watsonx") {
    usedDependencies.push("extBackend");
  }
  if (backend === "watsonx") {
    usedDependencies.push("watsonx");
  }
  if (packages.tailwind.inUse) {
    usedDependencies.push("tailwind");
  }
  if (packages.recoil.inUse) {
    usedDependencies.push("recoil");
  }
  if (packages.carbon.inUse) {
    usedDependencies.push("carbon");
  }

  return usedDependencies as TemplateDeps[];
};
