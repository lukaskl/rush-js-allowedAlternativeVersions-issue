# `allowedAlternativeVersions` issue reproduction

This repository is created to reproduce an issue with Rush's `common-versions.json` `allowedAlternativeVersions` feature.
i.e. `allowedAlternativeVersions` is too permissive and allows versions that should not be allowed.

## Problem description

`rush check` or `rush update` may incorrectly pass even if some packages use versions outside the allowed alternatives specified in `common-versions.json`.

# Relevant files structure

```
.
├── rush.json                       # Rush configuration
├── common/
│   ├── config/rush/
│   │   └── common-versions.json    # common versions configuration
└── packages/
    ├── example-19-0-0/             # Package with React 19.0.0
    │   └── package.json
    ├── example-19-0-1/             # Package with React 19.0.1
    │   └── package.json
    ├── example-19-2-0/             # Package with React 19.2.0
    │   └── package.json
    └── example-19-2-1/             # Package with React 19.2.1
        └── package.json
```

## Reproduction steps

**Step 1:** Set up `allowedAlternativeVersions`

Let's say at `allowedAlternativeVersions` we have:

```json
"react": ["19.0.1", "19.2.1"]
```

**Step 2:** Include one matching and one non-matching version

I'm controlling which versions are referenced by the workspaces via `rush.json` projects configuration, simply by commenting/uncommenting the relevant projects.

For example, let's include packages with `React` versions `19.0.0` and `19.0.1`:

```json
"projects": [
  { "packageName": "example-19-0-0", "projectFolder": "packages/example-19-0-0" },
  { "packageName": "example-19-0-1", "projectFolder": "packages/example-19-0-1" }
  // { "packageName": "example-19-2-0", "projectFolder": "packages/example-19-2-0" },
  // { "packageName": "example-19-2-1", "projectFolder": "packages/example-19-2-1" }
]
```

**Step 3:** Run `rush check` or `rush update`

**Expected outcome:**

The command should fail, indicating that `example-19-0-0` is using a disallowed version of `React`.

**Actual outcome:**

The command passes successfully, even though `example-19-0-0` is using a version of `React@19.0.0` that is not listed in the allowed alternatives.

## Variations

Let's simplify our version notation, let's say we have:

- `A` representing version `19.0.0`
- `B` representing version `19.0.1`
- `C` representing version `19.2.0`
- `D` representing version `19.2.1`

We have allowed versions: `B`, `D`, then the following table summarizes various combinations of workspace referenced versions and the expected vs actual results from `rush check` or `rush update`:

| Workspace referenced <br> versions | Allowed <br> versions | `rush check` <br> Expected result | `rush check` <br> Actual result |
| ---------------------------------- | --------------------- | --------------------------------- | ------------------------------- |
| A                                  | B & D                 | ❌\*                              | ✅                              |
| B                                  | B & D                 | ✅                                | ✅                              |
| C                                  | B & D                 | ❌\*                              | ✅                              |
| D                                  | B & D                 | ✅                                | ✅                              |
| A & B                              | B & D                 | ❌                                | ✅                              |
| A & C                              | B & D                 | ❌                                | ❌                              |
| A & D                              | B & D                 | ❌                                | ✅                              |
| B & C                              | B & D                 | ❌                                | ✅                              |
| B & D                              | B & D                 | ✅                                | ✅                              |
| C & D                              | B & D                 | ❌                                | ✅                              |
| A & B & C                          | B & D                 | ❌                                | ❌                              |
| A & B & D                          | B & D                 | ❌                                | ✅                              |
| A & C & D                          | B & D                 | ❌                                | ❌                              |
| B & C & D                          | B & D                 | ❌                                | ✅                              |
| A & B & C & D                      | B & D                 | ❌                                | ❌                              |

\* Regarding single `A` and single `C` cases, reluctantly I accept that Rush may not flag them as errors since there are no "alternative" versions present. However, I believe it would be more consistent if these cases were also flagged as errors, given that they do not comply with the allowed versions policy.
