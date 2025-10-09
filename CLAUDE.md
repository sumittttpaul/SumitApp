# Claude Rules for SumitApp

## Project Understanding

You are working with **SumitApp**, a sophisticated CLI tool and template system for scaffolding modern full-stack applications. This is similar to `create-react-app` but for complete monorepo setups.

### Repository Structure
- **create-sumit-app/** - TypeScript CLI tool that users install via `npx create-sumit-app`
- **official-site/** - Next.js 15 documentation website
- **templates/** - Template files that get copied to user projects
- **assets/** - Brand assets and logos

When users run `npx create-sumit-app my-app`, they get a Turborepo monorepo with:
- Next.js 15 website with App Router
- Expo 54 mobile app with React Native
- Node.js Express backend for Vercel serverless
- Shared packages for components, hooks, utils, validations, types

## Development Philosophy

### Primary Package Manager: Bun
- **Always use Bun commands** in documentation, examples, and scripts
- Support other package managers but optimize workflows for Bun
- All package.json files should specify `"packageManager": "bun@1.2.22"`
- Use `bun` instead of `npm run` in examples

### TypeScript First
- Strict TypeScript configuration across all projects
- Explicit return types for public functions
- Proper error typing and handling
- Use `import type` for type-only imports
- Interface for object shapes, type for unions/computed types

### Monorepo & Workspace Management
- Use `workspace:^` protocol for internal dependencies
- Maintain proper dependency graphs in turbo.json
- Test changes across all workspace packages
- Keep shared packages generic and reusable

## Code Quality Standards

### Error Handling Patterns
```typescript
// CLI Error Pattern
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

### Logging Standards
```typescript
// Use structured logging with appropriate levels
logger.verbose('Detailed debug information');
logger.info('General information');
logger.warn('Warning messages');
logger.error('Error messages');
```

### CLI User Experience
- Always provide clear, actionable error messages
- Use loading spinners with `ora` for long operations
- Support both interactive and non-interactive modes
- Include `--verbose` flag for debugging
- Implement graceful cancellation (Ctrl+C handling)

## Architecture Principles

### CLI Tool Design
- **Modular architecture** - Keep concerns separated in `src/lib/`
- **Cross-platform compatibility** - Handle Windows/macOS/Linux differences
- **Template flexibility** - Design for multiple template types (though currently only "default")
- **Configuration persistence** - Save user preferences for better experience

### Template Design
- **Production-ready defaults** - Templates should work out of the box
- **Deployment optimized** - Pre-configured for Vercel, EAS, etc.
- **Development experience** - Hot reload, fast refresh, type checking
- **Extensibility** - Easy to add new packages or modify structure

### Workspace Dependencies
```json
// Always use workspace protocol for internal packages
{
  "dependencies": {
    "@packages/components": "workspace:^",
    "@packages/utils": "workspace:^"
  }
}
```

## Specific Implementation Guidelines

### File Operations
```typescript
// Always use fs-extra and check paths
import fs from 'fs-extra';

if (await fs.pathExists(targetPath)) {
  await fs.copy(sourcePath, targetPath);
}
```

### Template Copying
```typescript
// Use degit for clean template copying
const emitter = degit(templatePath, {
  cache: false,
  force: true,
  verbose: options.verbose,
});
```

### Package Manager Detection
```typescript
// Follow established pattern
const detectPackageManager = async (): Promise<string> => {
  const lockFiles = [
    { name: 'bun', file: 'bun.lockb' },
    { name: 'pnpm', file: 'pnpm-lock.yaml' },
    { name: 'yarn', file: 'yarn.lock' },
    { name: 'npm', file: 'package-lock.json' }
  ];
  // Implementation...
};
```

## Testing Requirements

### CLI Testing
- Unit tests for all utility functions
- Integration tests for template generation
- Cross-platform testing (mocked where needed)
- Error condition testing
- Performance testing for large templates

### Template Testing
- Generate projects and verify they work
- Test all workspace commands (`bun dev`, `bun build`, etc.)
- Verify Turborepo task dependencies
- Check TypeScript compilation across packages

## Documentation Standards

### Code Comments
- Document complex algorithms and business logic
- Explain CLI UX decisions and user flows
- Document template structure and customization points
- Include examples for public APIs

### User-Facing Documentation
- Clear command examples with expected output
- Troubleshooting sections for common issues
- Migration guides for breaking changes
- Architecture explanations for contributors

## Performance Considerations

### CLI Performance
- Minimize startup time (avoid heavy imports in main thread)
- Use streaming for file operations
- Implement progress indicators for operations > 1 second
- Cache template metadata when possible

### Generated Project Performance
- Optimize Turborepo cache configuration
- Use proper Next.js optimization features
- Minimize bundle sizes in shared packages
- Configure proper tree-shaking

## Security Guidelines

### Input Validation
- Sanitize project names and paths
- Validate template sources
- Check for directory traversal attacks
- Handle symlinks safely

### Template Security
- No hardcoded secrets or API keys
- Secure defaults for authentication patterns
- Proper environment variable handling
- Safe dependency versions

## Development Workflow

### Making Changes
1. **Impact analysis** - Consider effects on existing generated projects
2. **Testing strategy** - Plan how to test changes across the ecosystem
3. **Migration path** - Consider how users will upgrade
4. **Documentation updates** - Update all relevant docs

### Release Process
1. **Version bumping** - Follow semantic versioning
2. **Changelog maintenance** - Document all user-facing changes
3. **Testing** - Full integration test with template generation
4. **NPM publishing** - Ensure build artifacts are correct

### Debugging Support
- Implement comprehensive logging at all levels
- Provide diagnostic commands for troubleshooting
- Include system information in error reports
- Support for verbose/debug modes

## Integration Patterns

### With External Tools
- **Vercel** - Optimize for serverless deployment
- **Expo/EAS** - Mobile app build and distribution
- **GitHub Actions** - CI/CD workflow templates
- **Turborepo** - Monorepo build orchestration

### With Package Managers
- Auto-detect from lockfiles
- Graceful fallbacks when preferred manager not available
- Respect existing project package manager choices
- Consistent behavior across different managers

## Anti-Patterns to Avoid

### CLI Development
- ❌ Blocking operations without progress indicators
- ❌ Generic error messages without context
- ❌ Hardcoded file paths or assumptions
- ❌ Direct console.log instead of structured logging

### Template Development  
- ❌ Breaking workspace dependency protocols
- ❌ Hardcoded configuration that should be dynamic
- ❌ Dependencies that conflict across workspace packages
- ❌ Missing or incomplete TypeScript configurations

### Architecture
- ❌ Tight coupling between CLI components
- ❌ Platform-specific code without proper abstraction
- ❌ Shared state that could cause race conditions
- ❌ Missing error boundaries in critical paths

Remember: SumitApp is designed to provide developers with a **production-ready foundation** that just works, while maintaining the **flexibility to customize** and extend as needed.