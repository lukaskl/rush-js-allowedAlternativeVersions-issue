# Minimal RushJS + pnpm Project

This is a minimal working RushJS monorepo using pnpm as the package manager.

## Structure

```
.
├── rush.json                          # Rush configuration
├── common/
│   ├── config/rush/
│   │   ├── .pnpmfile.cjs             # pnpm configuration
│   │   └── pnpm-lock.yaml            # pnpm lockfile
│   └── scripts/
│       └── install-run-rush.js        # Rush bootstrap script
└── packages/
    ├── example-package-a/             # Example package A
    │   ├── package.json
    │   └── index.js
    └── example-package-b/             # Example package B
        ├── package.json
        └── index.js
```

## Getting Started

### Install dependencies

```bash
node common/scripts/install-run-rush.js update
```

Or if you have Rush installed globally:

```bash
rush update
```

### Build all packages

```bash
node common/scripts/install-run-rush.js build
```

Or:

```bash
rush build
```

### Build a specific package

```bash
rush build --to example-package-a
```

## Common Commands

- `rush update` - Install/update dependencies
- `rush build` - Build all packages
- `rush rebuild` - Clean and build all packages
- `rush build --to <package>` - Build a specific package and its dependencies
- `rush build --from <package>` - Build a package and everything that depends on it

## Adding New Packages

1. Create a new folder under `packages/`
2. Add a `package.json` file
3. Register the package in `rush.json` under the `projects` array
4. Run `rush update`
