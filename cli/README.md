<div align="center">
<img src="./resources/bee.png">
</div>

<h1 align="center">
  create-cen-app
</h1>

<p align="center">
  Interactive CLI to start a full-stack, Next.js app, optionally using tRPC or a FastAPI as a backend.
</p>

<p align="center">
  
</p>

<br/>

<p align="center">Get Started by running <code>npm create cen-app@latest</code></p>

<div align="center">

</div>
<br/>

<p align="center">This project is inspired by and forked from <a rel="noopener noreferrer" target="_blank" href="https://init.tips">T3 Stack</a>. If you want to learn more about the T3 Stack, <a href="http://www.youtube.com/watch?v=PbjHxIuHduU" target="_blank">
  watch Theo's overview on Youtube here
</a></p>

<h2 id="about">The CEN Stack</h2>

The stack is focused on **simplicity**, **modularity**, and **efficiency**. It consists of:

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [carbon design system](https://www.carbondesignsystem.com)
- [TypeScript](https://typescriptlang.org)
- [tRPC](https://trpc.io) or [FastAPI](https://fastapi.tiangolo.com)

<!-- - [Prisma](https://prisma.io) -->
<!-- - [NextAuth.js](https://next-auth.js.org) -->

### Why this stack?

- **Next.js** is a great produciton ready React framework. It's got a great community, great docs, and is very easy to use.
- **Tailwind CSS** is a utility-first CSS framework that is easy to learn and use. It's also very customizable and has a great community.
- **FastAPI** is a great Backend-choice when working with Data Scientists, as their code be easily pasted into the backend. It's easy to use, has great docs, and the automatic implementation of the **Swagger UI** makes it great to work with.
- **tRPC** when Data Science is not a major requirement, tRPC is a great choice for a Backend-solution (technically Next.js is the backend). It provides type-safety from back- to frontend and has an overall great developer experience.

### So... what is `create-cen-app`? A template?

Kind of? `create-cen-app` is a CLI built by seasoned CEN Stack devs to streamline the setup of a modular CEN Stack app. This means each piece is optional, and the "template" is generated based on your specific needs.

After countless projects and many years on this tech, we have lots of opinions and insights. We’ve done our best to encode them into this CLI.

This is **NOT** an all-inclusive template. We **expect** you to bring your own libraries that solve the needs of **YOUR** application.

<h2 id="getting-started">Getting Started</h2>

To scaffold an app using `create-cen-app`, run any of the following three commands and answer the command prompt questions:

### npm

```bash
npm create t3-app@latest
```

### yarn

```bash
yarn create t3-app
```

### pnpm

```bash
pnpm create t3-app@latest
```
