# Momentify

Momentify is my social-application project made with: `React`, `TypeScript`, `Tailwind CSS`, `i18Next`, `Redux-Toolkit`, `Prisma`, `Express.js`, `Node.js`, `JWT`. In applications, users should be able to: Create posts, like & comment posts, follow/unfollow other users.

![about](about.png)

## Available scripts

<details>

### Client-side

1. format - formats all source code with prettier by prettier configuration in the root of the project
2. dev - starts a vite development server
3. build - will generate `dist` folder with current build

### Server-side

1. format - formats all source code with prettier with prettier config. defined at root of the project
2. dev:prepare - installs all dependencies and generates a new `PrismaClient`
3. dev - will start a development instance of the node application.
4. build - transpile all `TypeScript` sources into vanilla `JavaScript`
</details>

## TODO

<details>

### Client-side

1. Add a way to use the app with valid refresh token without the need to re-login every page load
2. Finish locales
3. Create a post modal-box
4. Feed & Explore grid of random-sized pictures (unsplash.com grid for <--x--> and each x col is made out of flex )
5. dark mode

### Server-side

1. Add client-side serving
2. Find a less expensive way of converting images to `.webp`

</details>
