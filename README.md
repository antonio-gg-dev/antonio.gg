# Welcome to [antonio.gg](https://antonio.gg/)!

<p align="center">
  <img src="public/images/profile-small.png" alt="Antonio's profile image">
</p>

This repository showcases my journey in software development and 3D printing. This project is not just a display of my
work; it's a platform where I enjoy teaching and sharing the knowledge and creations I've accumulated over time.

It's developed using technologies like Vitepress, TypeScript, TailwindCSS, SCSS, Storybook and Chromatic.

**Your contributions are welcome!** This is a personal repository, but I'm open to contributions that fix errors or
grammatical corrections. Let's collaborate to make this project even better.

## Contributing

To contribute to the project, follow these steps to set it up locally:

- **Install NVM**: Follow the instructions on [NVM GitHub](https://github.com/nvm-sh/nvm) to manage multiple Node.js
  versions.
- **Use the Recommended Node Version**: In the root directory, you'll find a `.nvmrc` file with the recommended Node
  version. Run `nvm install` and `nvm use` to set it up.
- **Install Dependencies**: Run `npm ci` to install project dependencies.
- **Install Git Hooks**: Execute `npm run pre-commit:install` and `npm run pre-push:install` to set up pre-commit and
  pre-push hooks.
- **Development Environment**: To start the local environment, run `npm run dev`.

Check the `package.json` for other interesting scripts prepared for use.

### VitePress page data

Previously visited routes remain mounted in the page through `RouteHistory`. VitePress' global `$frontmatter` property
always points to the current route, so using it in a page could make an older route display the title, description, or
image of a newer one.

Do not access frontmatter through the global property:

```vue
{{ $frontmatter.title }}
```

Instead, obtain it from the page's isolated VitePress context:

```vue
<script lang="ts" setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
  {{ frontmatter.title }}
</template>
```

The YAML frontmatter block does not need to change; this convention only affects how its values are consumed in Vue.

## Reporting Bugs or Suggesting Improvements

If you wish to report a bug or suggest an improvement, please open a new issue or submit a pull request describing your
changes or findings.

**Thank you for your interest and help in improving this project!**
