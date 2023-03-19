# Momentify - server

This is server-side of my social application called "momentify". Momentify is **MERN** stack application similar to instagram. This part of the application is written with help of: `Express, Prisma, TypeScript, JWT` and more in `package.json`

## File structure

<details>
<summary>View more</summary>

### Config

This folder includes all necessary config files.

### Middlwares

As the name imply, its folder for various middlewares.

### Utils

various utility functions. (Cluster, Jwt...)

### Modules

Each module represents a feature of my server. Each module has `Controller`, `DTO` and `Service` as core files.

1. `Controller` - Assigns proper service to each endpoint
2. `Service` - handles each request (e.g. getUser -> service, that will fetch user)
3. `DTO` - A abstract class, used for validation.
</details>

## Available Scripts

<details>
<summary>View more</summary>

1. `dev:prepare` - This script will install `node_modules` and generates a prisma client

2. `start:dev` - This script will start the application within development config

3. `start:prod` - This script will start compiled vanilla `JavaScript` application

4. `buid` - compiles current `TypeScript` source code into vanilla `ES6 JavaScript` and formats it.

5. `format` - will format everything besides exceptions defines in `.prettierignore` file

</details>
