<div align="center">
<img src="https://raw.githubusercontent.com/felixpahlke/create-cen-app/main/resources/bee.png">
</div>

<h1 align="center">
  create-cen-app
</h1>

<p align="center">
  An interactive CLI to create a Client-Engineering-Style application with FastAPI, React, and modern full-stack features.
</p>

<br/>

<p align="center">Get Started by running <code>npm create cen-app@latest</code></p>

<h2 id="about">The Client Engineering Stack</h2>

The stack is focused on **simplicity**, **modularity**, and **enterprise-ready features**. The CLI helps you set up a modern full-stack application with:

### Backend

- [FastAPI](https://fastapi.tiangolo.com) - Modern Python web framework
- [SQLModel](https://sqlmodel.tiangolo.com) - SQL ORM for Python
- [PostgreSQL](https://www.postgresql.org) - Robust SQL database
- [Pydantic](https://docs.pydantic.dev) - Data validation and settings management

### Frontend

- [React](https://react.dev) with TypeScript
- [Carbon Design System](https://carbondesignsystem.com/) & [Carboncn UI](https://www.carboncn.dev/) (optional)
- [Tailwind CSS](https://tailwindcss.com)
- Dark mode support
- Auto-generated API client

### DevOps & Security

- [Docker Compose](https://www.docker.com) & [colima](https://github.com/abiosoft/colima/) for development
- JWT authentication
- Secure password hashing
- OpenShift deployment support

### CLI Features

- Fast dependency installation (with uv and npm)
- Automated git setup (sets base template as upstream for future updates)
- Multiple template flavors to choose from:
  - `main` - Default with built-in user management
  - `oauth-proxy` - External Identity Provider integration
  - `backend-only` - FastAPI backend only
  - `main-custom-ui` - Custom UI with shadcn/ui
  - `oauth-proxy-custom-ui` - OAuth with custom UI

### What is `create-cen-app`?

`create-cen-app` is a CLI built by Client Engineering developers to streamline the setup of enterprise-ready full-stack applications. It provides a modular approach where you can choose the template flavor that best suits your project's needs.

After countless projects with various customers and teams, we've found that this stack provides the perfect balance of flexibility, scalability, and developer experience. The combination of FastAPI and React allows seamless integration with data science workflows while maintaining enterprise-grade security and features.

This is **NOT** just another template. We've carefully curated this stack based on real-world enterprise requirements and client engineering best practices. While we provide a robust foundation, we **expect** you to customize and extend it based on **YOUR** specific application needs.

<h2 id="getting-started">Getting Started</h2>

To scaffold an app using `create-cen-app`, run any of the following commands and follow the interactive prompts:

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
