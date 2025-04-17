import { type PackageManager } from "~/utils/getUserPkgManager.js";

// Turning this into a const allows the list to be iterated over for programatically creating prompt options
// Should increase extensability in the future

export interface InstallerOptions {
  frontendDir: string;
  pkgManager: PackageManager;
  noInstall: boolean;
  projectName?: string;
}

export type AvailableFlavours =
  | "main"
  | "oauth-proxy"
  | "backend-only"
  | "backend-only-no-db"
  | "main-custom-ui"
  | "oauth-proxy-custom-ui"; // | "go" | "java"

export type FlavourDisplay = {
  value: AvailableFlavours;
  name: string;
  description: string;
};

export const flavourDisplayList: FlavourDisplay[] = [
  {
    value: "main",
    name: "main",
    description: "Carbon UI + built-in auth",
  },
  {
    value: "oauth-proxy",
    name: "oauth-proxy",
    description: "Carbon UI + auth via oauth proxy & AppID",
  },
  // {
  //   value: "go",
  //   name: "Go",
  //   description: "full-stack-cen-template with Go backend",
  // },
  // {
  //   value: "java",
  //   name: "Java",
  //   description: "full-stack-cen-template with Java backend",
  // },
  {
    value: "backend-only",
    name: "backend-only",
    description: "API-only with API key auth",
  },
  {
    value: "backend-only-no-db",
    name: "backend-only-no-db",
    description: "API-only with API key auth, no database",
  },
  {
    value: "main-custom-ui",
    name: "main-custom-ui",
    description: "shadcn UI + built-in auth",
  },
  {
    value: "oauth-proxy-custom-ui",
    name: "oauth-proxy-custom-ui",
    description: "shadcn UI + auth via oauth proxy & AppID",
  },
];
