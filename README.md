# Aliased - A WebView-Based Web5 Mobile Wallet App

This is a WebView-based Web5 wallet app written using Vue.js.


## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Vue - Official plugin](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and NOT Vetur, or Volar).

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` (a dependency in `package.json`) for type checking. In editors, we need Vue - Official plugin to make the TypeScript language service aware of `.vue` types.

## Building and Running the App

### Prerequisites:
- `npm`
- `xcode` (for iOS)

### Installing dependencies
1. Clone the [`web5-js` repo](https://github.com/TBD54566975/web5-js), `web5-js` repo will be used as a direct dependency for this repo.
2. Clone this repo as a peer repo to `web-js` (i.e. both repo directories have the same parent directory).
3. Under this root directory of the local `aliased` repo run:

    ```sh
    npm install --legacy-peer-deps
    ```

> NOTE: the `--legacy-peer-deps` is to workaround a [polyfill dependency issue](https://github.com/TBD54566975/aliased/issues/1)

### Compile and Hot-Reload for Development
`esbuild` is used for development in browsers taking advantage of speed of `esbuild' which allows dynamic reloading:

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production
Instead `esbuild`, `rollup` is used for production builds which then get bundled in the mobile platforms:

```sh
npm run build
```

> Optional: You can also run `npm run preview` to launch the production build and view it in a browser. This can be useful for sanity checking differences between `dev` builds, if any.

### Running as Mobile Apps
Once a production build is ready (after running `npm run build`), we can now bundle up build as a mobile app using `capacitor`:

For iOS:

1. Generate the iOS `xcode` project:

    ```sh
    npx cap sync
    ```
    > NOTE: this should be run every time you wish to deploy a new build to the phone or simulator.

1. Launch the project workspace file:

    ```sh
    open ./ios/App/App.xcworkspace
    ```
1. Click on the "play" button to launch the app.

### Lint with [ESLint](https://eslint.org/)


```sh
npm run lint
```
