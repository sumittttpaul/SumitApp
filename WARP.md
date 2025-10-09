# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

SumitApp is a CLI tool and template system for rapidly bootstrapping modern full-stack applications. The repository contains:

1. **create-sumit-app** - A CLI tool (similar to create-react-app) that scaffolds new projects
2. **official-site** - Next.js documentation website 
3. **templates/** - Project templates that get copied when users run `npx create-sumit-app`

The generated projects are monorepos powered by Turborepo with:
- **Website**: Next.js 15 with App Router, React 19, Tailwind CSS 4
- **Mobile**: Expo 54 with React Native, NativeWind
- **Backend**: Node.js Express APIs for Vercel serverless deployment
- **Shared packages**: Components, hooks, utils, validations, types

## Repository Structure

```
sumitapp/
├── create-sumit-app/          # CLI tool source code
│   ├── src/                   # TypeScript source
│   │   ├── index.ts          # Main CLI entry point
│   │   ├── lib/              # Core functionality
│   │   └── types/            # TypeScript definitions
│   ├── tests/                # Vitest test files
│   └── package.json          # NPM package config
├── official-site/            # Documentation site
│   └── [Next.js 15 app]     # Standard Next.js structure
├── templates/                # Project templates
│   └── default/              # Main template copied by CLI
│       ├── packages/         # Shared workspace packages
│       └── projects/         # Individual applications
└── assets/                   # Brand assets and logos
```

## Common Development Commands

### CLI Tool Development (create-sumit-app/)
```bash
# Development and testing
bun --cwd create-sumit-app dev            # Run CLI in dev mode
bun --cwd create-sumit-app test           # Run tests with Vitest
bun --cwd create-sumit-app test:coverage  # Run tests with coverage

# Building and publishing
bun --cwd create-sumit-app build          # Build TypeScript to dist/
bun --cwd create-sumit-app lint           # ESLint
bun --cwd create-sumit-app format         # Prettier formatting

# Testing the CLI locally
bun run create-sumit-app/dist/index.js my-test-app
```

### Official Site Development
```bash
# Development server
bun --cwd official-site dev               # Start with Turbopack
bun --cwd official-site dev:debug         # Start with Node inspector

# Production builds
bun --cwd official-site build            # Build for production
bun --cwd official-site start            # Start production server

# Code quality
bun --cwd official-site lint             # ESLint
bun --cwd official-site lint:fix         # ESLint with auto-fix
bun --cwd official-site check-types      # TypeScript type checking
bun --cwd official-site clean            # Clean build artifacts
```

### Template Testing
```bash
# Test template generation
npx create-sumit-app test-project
cd test-project

# Standard template commands (what users will use)
bun dev              # Start all projects in development
bun build            # Build all projects  
bun lint             # Lint all projects
bun format           # Format code with Prettier
bun check-types      # Type check all projects
bun clean            # Clean all build artifacts

# Individual project commands
bun --filter=website dev     # Next.js website only
bun --filter=mobile dev      # Expo mobile only  
bun --filter=backend dev     # Node.js backend only
```

## Architecture & Key Components

### CLI Tool Architecture (`create-sumit-app/`)

The CLI follows a modular architecture:

- **`src/index.ts`** - Main entry point, handles command parsing and orchestration
- **`src/lib/templates.ts`** - Template discovery and management
- **`src/lib/config.ts`** - User configuration persistence
- **`src/lib/utils.ts`** - Package manager detection, validation, git operations
- **`src/lib/logger.ts`** - Structured logging with colors and formatting

**Key Features:**
- Uses `degit` to clone templates without Git history
- Supports multiple package managers (currently optimized for Bun)
- Interactive prompts with `prompts` library
- Progress indicators with `ora`
- Automatic project name validation
- Git repository initialization post-scaffolding

### Template Structure

Templates use Turborepo workspace configuration with:

- **Shared packages** (`packages/`) - Reusable code across projects
  - `@packages/components` - UI components
  - `@packages/hooks` - React hooks
  - `@packages/utils` - Utility functions  
  - `@packages/validations` - Zod schemas
  - `@packages/types` - TypeScript definitions
  - `@packages/eslint-config` - Shared ESLint rules
  - `@packages/typescript-config` - Shared TypeScript config

- **Applications** (`projects/`) - Individual deployable projects
  - `website/` - Next.js web application
  - `mobile/` - Expo React Native mobile app
  - `backend/` - Express.js serverless APIs

### Build System (Turborepo)

The build system uses Turborepo with optimized task dependencies:

```json
{
  "build": {
    "dependsOn": ["^build", "check-types", "lint"],
    "outputs": [".next/**", "dist/**", "build/**", ".expo/**"]
  },
  "lint": {
    "dependsOn": ["^lint"]
  },
  "check-types": {
    "dependsOn": ["^check-types"]  
  }
}
```

**Cache Strategy:**
- Build artifacts are cached based on input files
- Shared packages are built before dependent projects
- Type checking and linting run in parallel with builds

## Package Manager Strategy

The project is optimized for **Bun** as the primary package manager:

- All `package.json` files specify `"packageManager": "bun@1.2.22"`
- Lockfiles use `bun.lock` format
- Scripts assume Bun's faster execution for development workflows
- CLI tool auto-detects package managers from lockfiles but defaults to Bun

For compatibility, the system also supports npm, yarn, and pnpm, but Bun provides the best development experience.

## Development Workflow

### Adding New CLI Features

1. **Extend types** in `src/types/index.ts`
2. **Add core logic** in appropriate `src/lib/` file
3. **Update main CLI** in `src/index.ts`
4. **Add tests** in `tests/` directory
5. **Update documentation** in official-site

### Modifying Templates

1. **Edit template files** in `templates/default/`
2. **Test template generation** with `npx create-sumit-app`
3. **Verify all workspaces work** in generated project
4. **Check Turborepo task dependencies** still function

### Template Package Updates

When updating shared packages in templates:
- Ensure workspace dependencies use `workspace:^` protocol
- Update peer dependencies in consuming packages
- Test cross-package imports and type resolution
- Verify Turborepo task caching isn't broken

## Deployment Strategy

### CLI Tool Publishing
- Built artifacts go to `create-sumit-app/dist/`
- Published to NPM as `create-sumit-app` package
- Users install via `npx create-sumit-app my-app`

### Official Site
- Deployed to Vercel with Next.js preset
- Build command: `bun run build`
- Uses Next.js static optimization and React Compiler

### Generated Projects
Templates are pre-configured for:
- **Vercel deployment** (both website and serverless APIs)
- **Expo Application Services** for mobile app distribution
- **GitHub Actions** workflows for CI/CD

## Key Dependencies

### CLI Tool
- **degit** - Template cloning without Git history
- **prompts** - Interactive command-line prompts
- **commander** - CLI argument parsing
- **ora** - Loading spinners and progress indicators
- **execa** - Cross-platform process execution
- **chalk** - Terminal colors and formatting

### Templates
- **Turborepo** - Monorepo build system and task runner
- **Next.js 15** - React framework with App Router
- **Expo 54** - React Native development platform  
- **Tailwind CSS 4** - Utility-first CSS framework
- **TypeScript 5.9** - Static type checking
- **Zod** - Schema validation
- **Legend State** - React state management

## Testing Strategy

The CLI tool uses **Vitest** for testing:
- Unit tests for utility functions
- Integration tests for template generation
- Coverage reporting available via `test:coverage` script

Templates include testing setups but require generated projects for full testing.

<citations>
<document>
<document_type>WARP_DOCUMENTATION</document_type>
<document_id>getting-started/quickstart-guide/coding-in-warp</document_id>
</document>
</citations>