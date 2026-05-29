# tat-common-library

## Build

```
yarn build
```

## Create local library

```
yarn pack
```

`yarn pack` runs the `prepack` hook, which:

1. Bumps the patch version in `package.json` (e.g. `0.1.0` → `0.1.1`).
2. Re-runs `yarn build` so `dist/` reflects the new version.

So every tarball you produce gets a fresh, higher version automatically —
you don't have to remember to edit `package.json` first.

### Bumping minor or major

By default `yarn pack` does a patch bump. To bump differently:

```
BUMP=minor yarn pack    # 0.1.7 -> 0.2.0
BUMP=major yarn pack    # 0.2.4 -> 1.0.0
```

Or bump manually without packing:

```
yarn version:patch
yarn version:minor
yarn version:major
```

## Install library in another project

1. Copy the tgz file (e.g. `tat-common-library-v0.1.0.tgz`)
2. Paste in `Project > lib`
3. Update the project's `package.json`:
   ```json
   "@tat/common-library": "./lib/tat-common-library-v0.1.0.tgz"
   ```
4. From the project directory:
   ```
   npm i
   ```
5. **Import the stylesheet once** at the root of your app (e.g. in
   `src/main.tsx` or `App.tsx`):
   ```ts
   import "@tat/common-library/styles";
   ```
   This pulls in Bootstrap CSS + JS, which the library's components rely on
   for utility classes (`btn`, `d-flex`, `table-striped`, etc.). Skip this
   step only if your app already imports Bootstrap somewhere else.
