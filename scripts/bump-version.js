#!/usr/bin/env node
/**
 * bump-version.js
 *
 * Bumps the version in package.json before `yarn pack` (or `npm pack`)
 * runs, so every tarball produced has a unique, higher version.
 *
 * Default bump level is `patch`. Override with either:
 *   - CLI arg:    node scripts/bump-version.js minor
 *   - env var:    BUMP=major yarn pack
 *
 * Wired into the `prepack` lifecycle hook in package.json, so users only
 * have to run `yarn pack` and the bump happens automatically.
 */

const fs = require("fs");
const path = require("path");

const PKG_PATH = path.resolve(__dirname, "..", "package.json");
const VALID_LEVELS = new Set(["major", "minor", "patch"]);

function parseLevel() {
  const fromArg = process.argv[2];
  const fromEnv = process.env.BUMP;
  const candidate = (fromArg || fromEnv || "patch").toLowerCase();
  if (!VALID_LEVELS.has(candidate)) {
    console.error(
      `bump-version: invalid level "${candidate}". Use major | minor | patch.`,
    );
    process.exit(1);
  }
  return candidate;
}

function bump(version, level) {
  const match = /^(\d+)\.(\d+)\.(\d+)/.exec(version);
  if (!match) throw new Error(`Invalid semver in package.json: ${version}`);
  let [, major, minor, patch] = match.map(Number);

  if (level === "major") {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (level === "minor") {
    minor += 1;
    patch = 0;
  } else {
    patch += 1;
  }
  return `${major}.${minor}.${patch}`;
}

function main() {
  const level = parseLevel();
  const pkg = JSON.parse(fs.readFileSync(PKG_PATH, "utf8"));
  const prev = pkg.version;
  const next = bump(prev, level);

  pkg.version = next;
  fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2) + "\n");

  console.log(`[bump-version] ${pkg.name}: ${prev} -> ${next} (${level})`);
}

main();
