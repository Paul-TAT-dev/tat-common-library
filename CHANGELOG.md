# Changelog

All notable changes to `@tat/common-library` are documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
The project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed (breaking)
- **`Table` prop renamed:** `totalPages` → `totalItems`. The prop has always
  carried the total *row* count (Pagination internally computes the number
  of pages from it), so the name now matches the semantics.

  ```diff
  - <Table totalPages={500} ... />
  + <Table totalItems={500} ... />
  ```

### Removed
- `@storybook/addon-onboarding` (Storybook's first-run tutorial, unused).

## [1.0.0] — 2026-05-29

This release consolidates a large refactor of the library. **Several breaking
changes** — see "Migration" at the bottom of this entry for the find-and-replace
cheat sheet your consumer projects need.

### Added
- `src/hooks/useClickOutside.ts` — shared hook replacing four hand-rolled
  outside-click effects.
- `src/utils/creditCard.ts` — `detectCardType`, `formatExpiry` extracted from
  `CreditCardInput` for reuse and testability.
- `src/utils/parseDate.ts` — `parseDate`, `COMMON_DATE_FORMATS` extracted from
  `DatePicker`.
- `src/types/index.ts` — shared `OptionObject` type (replaces three duplicates).
- `src/styles/_variables.scss` and `src/styles/_mixins.scss` — design tokens
  (colors, spacing, radii, shadows) and reusable mixins
  (`tat-floating-label`, `tat-field-frame`, `tat-attached-menu`,
  `tat-option-row`).
- `src/styles.ts` — opt-in stylesheet entry; import with
  `import "@tat/common-library/styles";`.
- `exports` map and `sideEffects` whitelist in `package.json` for proper
  tree-shaking and modern module resolution.
- `scripts/bump-version.js` + `prepack` hook — `yarn pack` / `npm pack` now
  auto-bumps the patch version and rebuilds `dist/`. Override the level with
  `BUMP=minor yarn pack` or `BUMP=major yarn pack`.
- `UploadFile` is now exported from the package root (was orphaned before).
- `UploadFile` accepts an `onUploadAccepted` callback (was previously a
  `console.log`).
- `Modal` has `aria-label`, `onRequestClose`, `shouldCloseOnEsc`,
  `shouldCloseOnOverlayClick`, and an SSR-safe `setAppElement` setup with an
  optional `appElement` prop.
- `Tab`, `DatePicker` day cells, and `Modal` close are now real `<button>`s
  with `aria-*` attributes.

### Changed (breaking)
- **Bootstrap CSS is no longer auto-imported.** Previously `src/index.ts`
  imported `bootstrap/dist/css/bootstrap.min.css` and the JS bundle for every
  consumer; this added ~250 KB to consumer bundles and forced duplicated
  imports for apps that already loaded Bootstrap. Consumers must now opt in:
  ```ts
  import "@tat/common-library/styles";
  ```
- **CSS classes are namespaced under `tat-`** to remove Bootstrap collisions
  and global-selector leaks. The full rename table:

  | Before                            | After                                |
  |-----------------------------------|--------------------------------------|
  | `.close`                          | `.tat-modal-close`                   |
  | `.modal-content` / `.modal-body`  | `.tat-modal-content` / `.tat-modal-body` |
  | `.modal-open` (body class)        | `.tat-modal-open`                    |
  | `.input-group` (CreditCardInput)  | `.tat-credit-card-field`             |
  | `.input-row`  (CreditCardInput)   | `.tat-credit-card-row`               |
  | `.credit-card-input-wrapper`      | `.tat-credit-card`                   |
  | `.credit-card-label`              | `.tat-credit-card-label`             |
  | `.credit-card-fields`             | `.tat-credit-card-fields`            |
  | `.datepicker-*`                   | `.tat-datepicker-*`                  |
  | `.multi-select-*`                 | `.tat-multi-select-*`                |
  | `.chip-remove`                    | `.tat-multi-select-chip-remove`      |
  | `.caret` (collision-prone)        | `.tat-multi-select-caret` / `.tat-search-dropdown-caret` |
  | `.search-dropdown-*`              | `.tat-search-dropdown-*`             |
  | `.search-selected-*`              | `.tat-search-dropdown-*`             |
  | `.search-loading`                 | `.tat-search-dropdown-loading`       |
  | `.search-clear-button`            | `.tat-search-dropdown-clear`         |
  | `.textarea-wrapper`               | `.tat-textarea`                      |
  | `.textarea-label`                 | `.tat-textarea-label`                |
  | `.textarea-field`                 | `.tat-textarea-field`                |
  | `.upload-zone`                    | `.tat-upload`                        |
  | `.zone-hover`                     | `.is-dragging`                       |
  | `.upload-file/-info/-size/...`    | `.tat-upload-file/-info/-size/...`   |
  | `.tooltip-icon`                   | `.tat-tooltip-icon`                  |
  | `#tat-tooltip` (ID selector)      | `.tat-tooltip` (class)               |
  | `.inverted` (Tooltip modifier)    | `.tat-tooltip-inverted`              |
  | `.form-floating-sm` (zoom hack)   | `.tat-checkbox`                      |
  | `.error` (Input)                  | `.has-error`                         |
  | `.active`, `.disabled` (modifiers)| `.is-active`, `.is-disabled`, `.is-open` |
  | Tab `.dis`                        | `.is-disabled`                       |
  | Tab `.tat-success/-alert/-error/-todo` | `.tat-tab-success/-alert/-error/-todo` |

- **Tab is now a `<button>`** (was a `<div>` with `onClick`). The inner
  `<label>` became a `<span>`. Visual styling is preserved via a button reset
  in SCSS, but any consumer-side selector that assumed `div.tat-tab` will
  need to drop the element specifier.
- **DatePicker calendar day cells are now `<button>` elements**, with a
  button reset in SCSS to preserve appearance.
- **Modal close button is a real `<button aria-label="Close dialog">`**
  instead of a `<span>` wrapping an SVG.

### Fixed
- **`Table` pagination broken in production.** The previous logic gated
  client-side slicing behind `process.env.NODE_ENV === "development"`,
  so production builds never paginated. Replaced with a `useMemo` that
  derives the slice from `[data, currentPage, itemsPerPage]` and detects
  server-side pagination via row-count comparison.
- **Stray Node import in `Tab.tsx`** (`import { title } from "process";`)
  removed — was pulling Node's `process` module into browser bundles.
- **`Pagination` stale `useCallback` deps** — `getPageRange` declared
  `[totalItems, itemsPerPage]` but read `currentPage` and `totalPages`.
  Fixed to `[currentPage, totalPages]`.
- **`DatePicker` duplicate format call** — `displayValue` and `isoValue`
  computed identical strings; collapsed into one `formatted` variable.
- **`DatePicker` missing effect dep** — `formatDate` was used inside
  the value-sync effect but not declared; wrapped in `useCallback` and
  added to the dep array.
- **`Tooltip` missing effect dep** — `isControllable` was used inside
  the `controlShow` effect but not in its dep array.
- **`UploadFile`** — `console.log` removed; the component is now
  controllable via an `onUploadAccepted` prop and is exported from the
  package root (was an orphan).

### Removed
- **PII leak.** `src/searchDropdown/constants.ts` contained 2,955 lines of
  real travel-agent names and email addresses. Moved to `stories/mocks/agents.ts`
  (Storybook-only, excluded from the build).
- All `*.stories.tsx` files moved out of `src/` to `stories/`; build no
  longer ships Storybook artifacts.
- `react` and `react-dom` removed from `dependencies` (kept only in
  `peerDependencies`) to prevent the duplicate-React warning in consumer apps.
- Unused devDep `html-react-parser`, unused dep `use-debounce`.
- `webpack.config.js` (dead config, unreferenced by anything).
- Three `any` casts in `SearchDropdown` and `CreditCardInput` replaced with
  properly narrowed types.
- Old global-selector leaks: `body { font-size, font-family }` in
  `input.scss` and `td { vertical-align }` in `table.css` — both were
  applying to the consumer's entire DOM.

### Infrastructure
- Added `tsconfig.build.json` that excludes stories/tests/mocks/`src/stories`
  from compiled output. `dist/` is 102 files / 428 KB (was 167 / 748 KB).
- Storybook config (`.storybook/main.ts`) globs `../stories/**` only.
- `.gitignore` cleaned up; added `storybook-static/` and `*.tgz`.

### Migration cheat sheet

Updating a consumer project:

1. **Add the stylesheet import** once at the app root:
   ```ts
   import "@tat/common-library/styles";
   ```
2. **Find-and-replace CSS class names** if your app overrides library styles
   — see the rename table above.
3. **No code changes required** for component imports. The public API
   (`Tab`, `Modal`, `DatePicker`, `Input`, etc.) is unchanged.

[Unreleased]: https://example.com/compare/v1.0.0...HEAD
[1.0.0]: https://example.com/releases/tag/v1.0.0
