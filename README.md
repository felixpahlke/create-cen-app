<div align="center">
<img src="https://raw.githubusercontent.com/felixpahlke/create-cen-app/main/resources/bee.png">
</div>

<h1 align="center">
  create-cen-app
</h1>

<p align="center">
  an interactive CLI to create a Client-Engineering-Style application with Next.js, Carbon Design System, Tailwind CSS, and tRPC or FastAPI.
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

<h2 id="about">The Client Engineering Stack</h2>

The stack is focused on **simplicity**, **modularity**, and **speed**. It consists of:

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

### What is `create-cen-app`?

`create-cen-app` is a CLI built by CEN Stack devs to streamline the setup of a modular CEN Stack app. This means each piece is optional, and the "template" is generated based on your specific needs.

After countless projects, working with many different customers and teams, we've found that this stack is the best for Client Engineering. It provides flexibility when working with data scientists and makes implementing new features a breeze (which is crucial in CLient Engineering).

This is **NOT** an all-inclusive template. We **expect** you to bring your own libraries that solve the needs of **YOUR** application.

<h2 id="getting-started">Getting Started</h2>

To scaffold an app using `create-cen-app`, run any of the following three commands and answer the command prompt questions:

### npm

```bash
npm create cen-app@latest
```

### yarn

```bash
yarn create cen-app
```

### pnpm

```bash
pnpm create cen-app@latest
```
