import { envVariablesInstaller } from "~/installers/envVars.js";
import { nextAuthInstaller } from "~/installers/nextAuth.js";
import { prismaInstaller } from "~/installers/prisma.js";
import { tailwindInstaller } from "~/installers/tailwind.js";
import { trpcInstaller } from "~/installers/trpc.js";
import { type PackageManager } from "~/utils/getUserPkgManager.js";

// Turning this into a const allows the list to be iterated over for programatically creating prompt options
// Should increase extensability in the future
export const availablePackages = [
  "nextAuth",
  "prisma",
  "tailwind",
  "trpc",
  "envVariables",
] as const;
export type AvailablePackages = (typeof availablePackages)[number];

export const availableBackends = ["default", "trpc", "fastapi", "go"] as const;
export type AvailableBackends = (typeof availableBackends)[number];

export interface InstallerOptions {
  projectDir: string;
  pkgManager: PackageManager;
  noInstall: boolean;
  packages?: PkgInstallerMap;
  projectName?: string;
}

export type Installer = (opts: InstallerOptions) => void;

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
  nextAuth: {
    inUse: packages.includes("nextAuth"),
    installer: nextAuthInstaller,
  },
  prisma: {
    inUse: packages.includes("prisma"),
    installer: prismaInstaller,
  },
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
});

export const backendsDisplayList: BackendDisplay[] = [
  {
    name: "default (Next.js API Routes)",
    value: "default",
    short: "default",
  },
  {
    name: "tRPC (front-to-back typsafe Next.js API Routes)",
    value: "trpc",
    short: "tRPC",
  },
  // {
  //   name: "FastAPI (Python web-framework -> great with data science)",
  //   value: "fastapi",
  //   short: "FastAPI",
  // },
  // {
  //   name: "Go - (high performance)",
  //   value: "go",
  //   short: "Go",
  // },
];
