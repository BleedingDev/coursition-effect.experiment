# VS Code Configuration for Coursition Experiment

This directory contains VS Code workspace configuration optimized for Effect-TS development with Bun, TypeScript, Vitest, and Biome.

## Recommended Extensions

The following extensions are recommended for this project (see `.vscode/extensions.json`):

### Core Development
- **Biome** (`biomejs.biome`) - Fast formatter and linter for TypeScript/JavaScript
- **TypeScript Importer** (`ms-vscode.vscode-typescript-next`) - Enhanced TypeScript support

### Testing
- **Vitest** (`vitest.explorer`) - Native Vitest test runner integration

### Runtime & Package Management
- **Bun for VS Code** (`oven.bun-vscode`) - Bun runtime integration and debugging

### AI & Productivity
- **GitHub Copilot** (`github.copilot`) - AI pair programming
- **GitHub Copilot Chat** (`github.copilot-chat`) - AI chat assistance
- **JS Refactoring Assistant** (`p42ai.refactor`) - Advanced refactoring tools

### Code Quality & Documentation
- **Better Comments** (`aaron-bond.better-comments`) - Enhanced comment highlighting with TODO, FIXME, etc.
- **Error Lens** (`usernamehw.errorlens`) - Inline error and warning display

### Git & Workflow
- **Conventional Commits** (`vivaxy.vscode-conventional-commits`) - Structured commit message support

### Effect-TS Specific
- **Effect Dev Tools** (`effectful-tech.effect-vscode`) - Tools for Effect TypeScript framework development

### Package Management
- **PNPM Catalog Lens** (`antfu.pnpm-catalog-lens`) - Version information for PNPM catalog entries

## Workspace Settings

Key settings configured in `.vscode/settings.json`:

- **Biome**: Enabled for formatting and linting on save
- **TypeScript**: Enhanced auto-imports and completion
- **Bun**: Set as default runtime
- **pnpm**: Configured as package manager
- **Search exclusions**: Performance optimizations for large projects

## Available Tasks

VS Code automatically detects all npm/pnpm scripts from `package.json`. Access them via:

- `Ctrl+Shift+P` → "Tasks: Run Task"
- Command Palette → "npm: " (shows all scripts)

### Configured Task Shortcuts:
- **build** - Default build task (`Ctrl+Shift+B`)
- **test** - Default test task
- **typecheck** - TypeScript checking with error highlighting

All other scripts (`dev:server`, `test:watch`, `test:ui`, `check`, etc.) are automatically available without duplication!

## Debugging

A debug configuration is available for the server:

1. Open the Debug panel (`Ctrl+Shift+D`)
2. Select "Debug Server" configuration
3. Press F5 to start debugging

The configuration uses Bun with Node.js debugging support.

## Installation

To install the recommended extensions, VS Code will automatically prompt you when opening this workspace. Alternatively:

1. Open VS Code Command Palette (`Ctrl+Shift+P`)
2. Type "Extensions: Show Recommended Extensions"
3. Install the extensions marked with a star icon

## Effect-TS Specific Features

This configuration is optimized for Effect-TS development:

- TypeScript strict mode enabled
- Import organization for Effect modules
- Test configurations for Effect patterns using `@effect/vitest`
- Debugging support for Effect programs
- Proper exclusions for Effect build artifacts

## Troubleshooting

### Extensions Not Installing
If extensions don't install automatically, check:
1. Internet connection
2. VS Code version compatibility
3. Manually install via Extensions marketplace

### Biome Not Working
Ensure Biome is installed:
```bash
pnpm install @biomejs/biome
```

### TypeScript Issues
Run type checking task:
```bash
bun run typecheck
```

### Test Integration Issues
Ensure Vitest is properly installed:
```bash
pnpm install vitest @effect/vitest
```

For more detailed setup instructions, see the main project README.
