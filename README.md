# spreacte

## Demo

A simple demo app is available in the `demo/` directory. The demo is configured with Create React App and CRACO so it can resolve the local module source.

### Setup

1. From `d:\REPO\spreacte` install root dependencies:
   - `yarn install`
2. From `d:\REPO\spreacte\demo` install demo dependencies:
   - `yarn install`

### Run the demo

1. In one terminal, start the root package watcher to rebuild local module changes:
   - `yarn watch`
2. In another terminal, start the demo app:
   - `cd demo && yarn start`

### Local development workflow

- Edit source code in `src/` at the root package.
- The root watcher rebuilds the package output.
- CRA in `demo/` is configured to import the local module source and should reload when the demo file tree changes.

### Optional: yarn link workflow

1. In `d:\REPO\spreacte` run:
   - `yarn link`
2. In `d:\REPO\spreacte\demo` run:
   - `yarn link "@tsminh/spreacte"`
3. Start the demo:
   - `cd demo && yarn start`

When you are done, unlink with:

- `yarn unlink "@tsminh/spreacte"` in `demo`
- `yarn unlink` in root

### What the demo shows

- `GlobalContextProvider` wrapping consumer content
- `Box` component layout and responsive sizing
- `useModal` hook to open and close a modal
- `utils.numberWithCommas` and `utils.isDev` usage
