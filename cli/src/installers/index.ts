import { carbonInstaller } from "./carbon.js";
import { recoilInstaller } from "./recoil.js";
import { envVariablesInstaller } from "~/installers/envVars.js";
// import { nextAuthInstaller } from "~/installers/nextAuth.js";
// import { prismaInstaller } from "~/installers/prisma.js";
import { tailwindInstaller } from "~/installers/tailwind.js";
import { trpcInstaller } from "~/installers/trpc.js";
import { type PackageManager } from "~/utils/getUserPkgManager.js";

// Turning this into a const allows the list to be iterated over for programatically creating prompt options
// Should increase extensability in the future
export const availablePackages = [
  // "nextAuth",
  // "prisma",
  "tailwind",
  "trpc",
  "envVariables",
  "recoil",
  "carbon",
] as const;
export type AvailablePackages = (typeof availablePackages)[number];

export const availableBackends = ["default", "trpc", "fastapi", "go"] as const;
export type AvailableBackends = (typeof availableBackends)[number];

// export const availableEnvVars = ["IBM_API_KEY", "WATSONX_PROJECT_ID"];
// export type AvailableEnvVars = (typeof availableEnvVars)[number];

export interface InstallerOptions {
  frontendDir: string;
  pkgManager: PackageManager;
  noInstall: boolean;
  packages?: PkgInstallerMap;
  projectName?: string;
}

export type Installer = (opts: InstallerOptions) => void;

// export interface BackendInstallerOptions {
//   backendDir: string;
//   noInstall: boolean;
// }

export type PkgInstallerMap = {
  [pkg in AvailablePackages]: {
    inUse: boolean;
    installer: Installer;
  };
};

export type BackendDisplay = {
  name: string;
  value: AvailableBackends;
  short: string;
};

export const buildPkgInstallerMap = (packages: AvailablePackages[]): PkgInstallerMap => ({
  // nextAuth: {
  //   inUse: packages.includes("nextAuth"),
  //   installer: nextAuthInstaller,
  // },
  // prisma: {
  //   inUse: packages.includes("prisma"),
  //   installer: prismaInstaller,
  // },
  tailwind: {
    inUse: packages.includes("tailwind"),
    installer: tailwindInstaller,
  },
  trpc: {
    inUse: packages.includes("trpc"),
    installer: trpcInstaller,
  },
  envVariables: {
    inUse: true,
    installer: envVariablesInstaller,
  },
  recoil: {
    inUse: packages.includes("recoil"),
    installer: recoilInstaller,
  },
  carbon: {
    inUse: packages.includes("carbon"),
    installer: carbonInstaller,
  },
});

export const backendsDisplayList: BackendDisplay[] = [
  {
    name: '"no Backend" (default Next.js API Routes)',
    value: "default",
    short: "default",
  },
  {
    name: "tRPC (front-to-back typsafe Next.js API Routes)",
    value: "trpc",
    short: "tRPC",
  },
  {
    name: "FastAPI",
    value: "fastapi",
    short: "FastAPI",
  },
];

export type AvailableTemplates = "full-stack-cen-template" | "create-cen-app";

export type TemplateDisplay = {
  value: AvailableTemplates;
  name: string;
  description: string;
};

export const templateDisplayList: TemplateDisplay[] = [
  {
    value: "full-stack-cen-template",
    name: "full-stack-cen-template",
    description: "Feature-rich React/Vite + FastAPI template with auth, database and Docker",
  },
  {
    value: "create-cen-app",
    name: "original create-cen-app (deprecated)",
    description:
      "Lightweight Next.js template with a choice of FastAPI, tRPC or default Next.js API Routes",
  },
];

export type AvailableFlavours =
  | "main"
  | "oauth-proxy"
  | "backend-only"
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
