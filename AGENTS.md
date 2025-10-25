# AGENTS.md

This file provides guidance for AI agents (like ChatGPT, Claude, GitHub Copilot, Cursor, Warp, etc.) when working with the SumitApp codebase.

## Project Identity

**SumitApp** is a powerful CLI scaffolding tool and template system for creating production-ready, full-stack monorepo applications. Think of it as `create-react-app` meets `Turborepo` - but for complete application ecosystems.

### What Users Get

When developers run `npx create-sumit-app my-app`, they receive a fully configured Turborepo monorepo containing:

- **Next.js 16** web application with App Router and React 19
- **Expo 54** mobile app for iOS and Android
- **Node.js Express** backend optimized for Vercel serverless deployment
- **Shared packages** for components, hooks, utilities, validations, and types
- **Pre-configured tooling** for TypeScript, ESLint, Prettier, and more

## Repository Architecture

```
sumitapp/
├── create-sumit-app/     # CLI tool (published to NPM)
│   ├── src/              # TypeScript source code
│   │   ├── index.ts     # Main CLI entry point
│   │   ├── lib/         # Core functionality modules
│   │   └── types/       # TypeScript definitions
│   └── tests/           # Vitest test suite
├── official-site/        # Next.js documentation website
├── templates/            # Project templates copied by CLI
│   └── default/          # Main template structure
│       ├── packages/     # Shared workspace packages
│       └── projects/     # Individual applications
└── assets/              # Brand logos and assets
```

### Three Distinct Codebases

When working with this repository, understand you're dealing with **three separate contexts**:

1. **CLI Tool** (`create-sumit-app/`) - The scaffolding tool users install via NPM
2. **Documentation Site** (`official-site/`) - Next.js website explaining the project
3. **Project Template** (`templates/default/`) - The actual code structure users receive

## Core Development Guidelines

### Package Manager Philosophy

- **Primary**: Bun (1.2.22+) - Optimized for speed and modern JavaScript
- **Supported**: npm, yarn, pnpm (auto-detected from lockfiles)
- **Command examples**: Always use `bun` in documentation and examples
- **package.json**: All packages specify `"packageManager": "bun@1.2.22"`

### TypeScript Standards

- **Strict mode enabled** across all projects
- **Explicit return types** for public functions and APIs
- **Type-only imports**: Use `import type` where applicable
- **Naming conventions**:
  - `interface` for object shapes
  - `type` for unions, intersections, and computed types
- **Error handling**: Properly type catch blocks and error objects

### Monorepo & Workspace Management

- **Internal dependencies**: Always use `workspace:^` protocol
- **Dependency graphs**: Maintain proper task dependencies in `turbo.json`
- **Testing scope**: Test changes across all affected workspace packages
- **Package design**: Keep shared packages generic and reusable

## Common Development Commands

### CLI Development (`create-sumit-app/`)

```bash
# Development and testing
cd create-sumit-app && bun dev            # Run CLI in development mode
cd create-sumit-app && bun test           # Run Vitest test suite
cd create-sumit-app && bun test:coverage  # Generate coverage report

# Build and publish
cd create-sumit-app && bun run build      # Compile TypeScript to dist/
cd create-sumit-app && bun lint           # Run ESLint
cd create-sumit-app && bun format         # Format with Prettier

# Local testing
cd create-sumit-app && bun run dist/index.js my-test-app
```

### Documentation Site (`official-site/`)

```bash
# Development
cd official-site && bun dev               # Start dev server with Turbopack
cd official-site && bun dev:debug         # Start with Node inspector

# Production
cd official-site && bun run build        # Build for production
cd official-site && bun start            # Start production server

# Code quality
cd official-site && bun lint             # Run ESLint
cd official-site && bun check-types      # TypeScript type check
cd official-site && bun clean            # Clean build artifacts
```

### Template Testing

```bash
# Generate test project
npx create-sumit-app test-project
cd test-project

# Monorepo commands (what users run)
bun dev                  # Start all projects in development
bun run build            # Build all projects
bun lint                 # Lint all projects
bun check-types          # Type check all projects
bun clean                # Clean build artifacts

# Individual project commands
bun --cwd=projects/website dev     # Next.js only
bun --cwd=projects/mobile dev      # Expo only
bun --cwd=projects/backend dev     # Node.js API only
```

## CLI Tool Architecture

### Module Organization

- **`src/index.ts`** - Main entry, command parsing, orchestration
- **`src/lib/templates.ts`** - Template discovery and management
- **`src/lib/config.ts`** - User configuration persistence
- **`src/lib/utils.ts`** - Package manager detection, validation, git ops
- **`src/lib/logger.ts`** - Structured logging with formatting

### Key Implementation Patterns

#### Error Handling

```typescript
try {
  await operation();
} catch (error: any) {
  logger.error(`Operation failed: ${error.message}`);
  if (options.verbose) {
    logger.verbose(error.stack);
  }
  process.exit(1);
}
```

#### Logging Levels

```typescript
logger.verbose('Detailed debug information'); // --verbose flag
logger.info('General information'); // Default level
logger.warn('Warning messages'); // Warnings
logger.error('Error messages'); // Errors
```

#### File Operations

```typescript
import fs from 'fs-extra';

// Always check paths before operations
if (await fs.pathExists(targetPath)) {
  await fs.copy(sourcePath, targetPath);
}
```

#### Package Manager Detection

```typescript
const detectPackageManager = async (): Promise<string> => {
  const lockFiles = [
    { name: 'bun', file: 'bun.lockb' },
    { name: 'pnpm', file: 'pnpm-lock.yaml' },
    { name: 'yarn', file: 'yarn.lock' },
    { name: 'npm', file: 'package-lock.json' },
  ];
  // Implementation follows...
};
```

## Template Structure & Design

### Shared Packages (`packages/`)

All shared packages use the `@packages/` namespace:

- **`@packages/components`** - Reusable UI components (React/React Native)
- **`@packages/hooks`** - Custom React hooks
- **`@packages/utils`** - Utility functions and helpers
- **`@packages/validations`** - Zod schema definitions
- **`@packages/types`** - Shared TypeScript types and interfaces
- **`@packages/eslint-config`** - Shared ESLint configuration
- **`@packages/typescript-config`** - Base TypeScript configs

### Applications (`projects/`)

- **`website/`** - Next.js 16 web application
- **`mobile/`** - Expo 54 React Native mobile app
- **`backend/`** - Express.js serverless APIs for Vercel

### Workspace Dependencies

Always use workspace protocol for internal packages:

```json
{
  "dependencies": {
    "@packages/components": "workspace:^",
    "@packages/utils": "workspace:^",
    "@packages/types": "workspace:^"
  }
}
```

## Build System (Turborepo)

### Task Dependencies

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

### Cache Strategy

- Build artifacts cached based on input file hashes
- Shared packages built before dependent projects
- Type checking and linting run in parallel when possible
- Remote caching supported for team collaboration

## Technology Stack

### Frontend (Next.js)

- **Next.js 16** with App Router
- **React 19** with concurrent features
- **Tailwind CSS 4** for styling
- **Radix UI** for accessible primitives
- **Motion** for animations
- **Lucide React** for icons

### Mobile (Expo)

- **Expo 54** development platform
- **React Native 0.81** framework
- **NativeWind 5** (TailwindCSS for React Native)
- **React Native Paper** for Material Design
- **Expo Router** for file-based routing

### Backend (Node.js)

- **Node.js 22** runtime
- **Express 5** web framework
- **Vercel** serverless deployment
- **TypeScript 5** for type safety

### Tooling

- **Turborepo** - Monorepo orchestration
- **Bun** - Runtime and package manager
- **TypeScript 5.9** - Static typing
- **ESLint 9** - Code linting
- **Prettier 3** - Code formatting
- **Vitest** - Unit testing (CLI tool)

### State & Utilities

- **Legend State** - React state management
- **Zod** - Schema validation
- **Date-fns** - Date utilities
- **Axios** - HTTP client

## Development Workflow Best Practices

### Making Changes to CLI Tool

1. **Analyze impact** - Consider effects on existing generated projects
2. **Update types** in `src/types/index.ts` first
3. **Implement logic** in appropriate `src/lib/` module
4. **Add/update tests** in `tests/` directory
5. **Run test suite** with `bun test`
6. **Update docs** in official-site if user-facing

### Modifying Templates

1. **Edit files** in `templates/default/`
2. **Test generation** by running `npx create-sumit-app test-project`
3. **Verify workspace commands** work in generated project
4. **Check Turborepo tasks** execute correctly
5. **Test each platform** (website, mobile, backend)
6. **Validate deployment configs** still work

### Updating Shared Packages

When modifying packages in `templates/default/packages/`:

- Use `workspace:^` for internal dependencies
- Update peer dependencies in consuming packages
- Test imports and type resolution across packages
- Verify Turborepo caching remains functional
- Check all projects that depend on the package

## User Experience Guidelines

### CLI UX Principles

- **Clear, actionable error messages** - Tell users what went wrong AND how to fix it
- **Loading indicators** - Use `ora` spinners for operations > 1 second
- **Interactive mode** - Support prompts for better user experience
- **Non-interactive mode** - Allow full automation via flags
- **Verbose mode** - Include `--verbose` flag for debugging
- **Graceful cancellation** - Handle Ctrl+C properly

### Error Message Format

```typescript
// ❌ Bad
logger.error('Failed');

// ✅ Good
logger.error('Failed to create project directory');
logger.info('Ensure you have write permissions in the target location');
logger.info('Try running: sudo npx create-sumit-app my-app');
```

## Testing Requirements

### CLI Tool Testing

- **Unit tests** for all utility functions in `src/lib/`
- **Integration tests** for template generation workflow
- **Error condition tests** for edge cases
- **Cross-platform compatibility** (Windows/macOS/Linux)
- **Coverage target**: Maintain > 80% code coverage

### Template Testing

- Generate projects and verify they build successfully
- Test all workspace commands execute correctly
- Verify TypeScript compilation across packages
- Check that deployment configurations work
- Test mobile app builds (iOS/Android)

### Running Tests

```bash
# CLI tool tests
cd create-sumit-app && bun test
cd create-sumit-app && bun test:coverage

# Template validation
npx create-sumit-app test-project
cd test-project
bun install
bun dev            # Should start all projects
bun run build      # Should build without errors
bun lint           # Should pass
```

## Deployment & Distribution

### CLI Tool (NPM Package)

- Package name: `create-sumit-app`
- Built to: `create-sumit-app/dist/`
- Published to: NPM registry
- Installation: `npx create-sumit-app my-app`

### Official Site (Vercel)

- Framework: Next.js 16 with App Router
- Build command: `bun run build`
- Deployment: Vercel with automatic deployments
- Features: Static optimization, React Compiler

### Generated Projects

Pre-configured for:

- **Vercel** - Website and serverless APIs
- **Expo Application Services (EAS)** - Mobile app distribution
- **GitHub Actions** - CI/CD workflows included

## Security Considerations

### Input Validation

- Sanitize project names and directory paths
- Validate template sources before cloning
- Check for directory traversal attempts
- Handle symbolic links safely
- Prevent command injection in subprocess calls

### Template Security

- No hardcoded secrets or API keys in templates
- Environment variable patterns for sensitive data
- Secure authentication defaults
- Safe dependency versions (no known vulnerabilities)
- `.env.example` files instead of `.env` with secrets

## Performance Optimization

### CLI Performance

- Minimize startup time - lazy load heavy dependencies
- Stream file operations for large templates
- Progress indicators for long-running operations
- Cache template metadata when possible
- Parallel operations where safe

### Generated Project Performance

- Optimize Turborepo cache configuration
- Next.js optimization features enabled
- Tree-shaking configured for shared packages
- Minimize bundle sizes
- Code splitting for better load times

## Common Anti-Patterns to Avoid

### CLI Development ❌

- Blocking operations without progress indicators
- Generic error messages without actionable guidance
- Hardcoded file paths or platform assumptions
- Direct `console.log` instead of structured logging
- Synchronous file operations for large files

### Template Development ❌

- Breaking workspace dependency protocols
- Hardcoded configuration that should be dynamic
- Dependency version conflicts across packages
- Missing or incomplete TypeScript configurations
- Circular dependencies between packages

### Architecture ❌

- Tight coupling between CLI components
- Platform-specific code without abstraction layer
- Shared mutable state causing race conditions
- Missing error boundaries in critical paths
- Assumptions about user's environment

## Integration Points

### External Services

- **Vercel** - Serverless deployment for web and APIs
- **Expo/EAS** - Mobile app builds and distribution
- **GitHub Actions** - CI/CD automation
- **Turborepo** - Build orchestration and caching

### Package Managers

- Auto-detect from lockfiles in order: Bun → pnpm → Yarn → npm
- Graceful fallback when preferred manager unavailable
- Respect existing project choices
- Consistent behavior across all managers

## Debugging Support

### Verbose Mode

Enable with `--verbose` or `-v` flag:

```bash
npx create-sumit-app my-app --verbose
```

Logs should include:

- Detailed step-by-step operations
- File system operations
- Network requests
- Git operations
- Full error stack traces

### Common Issues & Solutions

**Problem**: Template cloning fails
**Solution**: Check network connectivity, try with `--verbose` flag

**Problem**: Dependency installation fails
**Solution**: Verify package manager is installed, check lockfile integrity

**Problem**: Generated project won't build
**Solution**: Ensure all workspace packages are properly linked

## Contribution Guidelines

### Code Style

- Follow existing patterns in the codebase
- Use TypeScript strictly - no `any` types without justification
- Write self-documenting code with clear variable names
- Add JSDoc comments for public APIs
- Keep functions focused and single-purpose

### Pull Request Process

1. Fork the repository
2. Create feature branch from `main`
3. Make changes with clear commit messages
4. Add tests for new functionality
5. Ensure all tests pass
6. Update relevant documentation
7. Submit PR with detailed description

## Resources & References

### Documentation

- **README.md** - User-facing project overview
- **CLAUDE.md** - Claude-specific development rules
- **WARP.md** - Warp terminal agent guidance
- **Official Site** - Comprehensive online documentation

### External Documentation

- [Turborepo Docs](https://turbo.build/repo/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Expo Docs](https://docs.expo.dev/)
- [Bun Docs](https://bun.sh/docs)

---

## Quick Reference

### Key Files to Check

- `create-sumit-app/package.json` - CLI tool dependencies and scripts
- `templates/default/turbo.json` - Monorepo build configuration
- `templates/default/package.json` - Root workspace configuration
- `official-site/package.json` - Documentation site dependencies

### Important Patterns

```typescript
// Workspace dependency
"@packages/utils": "workspace:^"

// Package manager field
"packageManager": "bun@1.2.22"

// Turborepo filter
bun --cwd=projects/website dev

// Cross-platform path
path.join(__dirname, 'templates', 'default')
```

### Project Goals

1. **Developer Experience** - Make scaffolding effortless and intuitive
2. **Production Ready** - Templates should work out-of-the-box
3. **Modern Stack** - Use latest stable versions of technologies
4. **Performance** - Optimize for fast development and builds
5. **Flexibility** - Easy to customize and extend

---

**Remember**: SumitApp aims to eliminate the tedious setup phase of modern app development, allowing developers to focus on building features from day one. Every change should enhance this goal.
