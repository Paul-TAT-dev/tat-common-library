# tat-common-library

## Build

yarn build

## Create local library

yarn pack

## library install to other project

1. Copy tgz file (e.g. tat-common-library-v0.1.0.tgz)
2. Paste in Project > lib
3. Update project package.json
   "@tat/common-library": "./lib/tat-common-library-v0.1.0.tgz",
4. In cmd > project location, type
   npm i
