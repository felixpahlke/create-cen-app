import fs from "fs-extra";
import path from "path";
import { PKG_ROOT } from "~/consts.js";
import { type Installer } from "~/installers/index.js";

export const envVariablesInstaller: Installer = ({ frontendDir, packages }) => {
  // const usingAuth = packages?.nextAuth.inUse;
  // const usingPrisma = packages?.prisma.inUse;

  // const envContent = getEnvContent(!!usingAuth, !!usingPrisma);
  const envContent = getEnvContent();

  const envFile = "";
  // usingAuth && usingPrisma
  //   ? "with-auth-prisma.mjs"
  //   : usingAuth
  //   ? "with-auth.mjs"
  //   : usingPrisma
  //   ? "with-prisma.mjs"
  //   : "";

  if (envFile !== "") {
    const envSchemaSrc = path.join(PKG_ROOT, "template/extras/src/env", envFile);
    const envSchemaDest = path.join(frontendDir, "src/env.mjs");
    fs.copySync(envSchemaSrc, envSchemaDest);
  }

  const envDest = path.join(frontendDir, ".env");
  const envExampleDest = path.join(frontendDir, ".env.example");

  fs.writeFileSync(envDest, envContent, "utf-8");
  fs.writeFileSync(envExampleDest, exampleEnvContent + envContent, "utf-8");
};

// const getEnvContent = (usingAuth: boolean, usingPrisma: boolean) => {
const getEnvContent = () => {
  let content = `
# When adding additional environment variables, the schema in "/src/env.mjs"
# should be updated accordingly.

# Example:
# SERVERVAR="foo"
# NEXT_PUBLIC_CLIENTVAR="bar" (Client env vars must start with NEXT_PUBLIC_)
# keep in mind that NEXT_PUBLIC_ vars have to be available at build time
# to use runtime env vars pass them to the client via getServerSideProps

# You need this in your .env when using Recoil with next.js
RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED=false

# use this when running the backend locally
API_URL="http://127.0.0.1:4000/api"
`
    .trim()
    .concat("\n");

  //   if (usingPrisma)
  //     content += `
  // # Prisma
  // # https://www.prisma.io/docs/reference/database-reference/connection-urls#env
  // DATABASE_URL="file:./db.sqlite"
  // `;

  //   if (usingAuth)
  //     content += `
  // # Next Auth
  // # You can generate a new secret on the command line with:
  // # openssl rand -base64 32
  // # https://next-auth.js.org/configuration/options#secret
  // # NEXTAUTH_SECRET=""
  // NEXTAUTH_URL="http://localhost:3000"

  // # Next Auth Discord Provider
  // DISCORD_CLIENT_ID=""
  // DISCORD_CLIENT_SECRET=""
  // `;

  return content;
};

const exampleEnvContent = `
# Since the ".env" file is gitignored, you can use the ".env.example" file to
# build a new ".env" file when you clone the repo. Keep this file up-to-date
# when you add new variables to \`.env\`.

# This file will be committed to version control, so make sure not to have any
# secrets in it. If you are cloning this repo, create a copy of this file named
# ".env" and populate it with your secrets.
`
  .trim()
  .concat("\n\n");
