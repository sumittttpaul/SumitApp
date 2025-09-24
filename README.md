# SumitApp Project Template

## ⚡ Quick Start

1. **Clone and install**:
   git clone <repository-url>
   cd project-template
   bun install

2. **Restart your terminal** (the setup runs automatically during install)

3. **Start developing**:
   bun list # Show all workspaces
   bun workspace website dev # Start website development
   bun workspaces "website,mobile" build # Build multiple workspaces

## 🛠️ Workspace Commands

The CLI automatically discovers all workspaces in `projects/` and `packages/` directories.

### Individual Commands

bun workspace <name> <script> # Run script in workspace
bun workspace <name> add <pkg> # Add package to workspace
bun workspace <name> remove <pkg> # Remove package from workspace

text

### Multiple Workspaces

bun workspaces "<name1,name2>" <script> # Run script in multiple
bun workspaces "<name1,name2>" add <pkg> # Add to multiple
bun workspaces "<name1,name2>" remove <pkg> # Remove from multiple

text

### Utility

bun list # Show all available workspaces

text

**All normal bun commands still work**: `bun install`, `bun run build`, etc.

## 🏗️ Project Structure

- `projects/` - Main applications (website, mobile, backend)
- `packages/` - Shared packages (components, utils, types, etc.)
- `tools/` - Development tools and CLI

## 📖 Development

The workspace CLI integrates with Turborepo for build tasks and uses Bun directly for package management.

Supported platforms: **macOS**, **Linux**, **Windows** (Git Bash/PowerShell)
Key Features
Zero Setup: Just bun install and everything works ✅

Auto Discovery: Automatically finds all workspaces in projects/ and packages/ ✅

Cross Platform: Works on macOS, Linux, and Windows ✅

Shell Detection: Automatically detects Bash, Zsh, Fish, PowerShell ✅

Smart Routing: Uses Turborepo for build tasks, Bun for package management ✅

Team Friendly: Same experience for all team members ✅

Team Workflow
Your team members just need to:

Clone the repo

Run "bun install"

Restart terminal

Start using "bun workspace ..." commands

The postinstall script automatically handles building the CLI and setting up the shell function !
