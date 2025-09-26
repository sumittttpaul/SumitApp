# =====================================
## Development Commands Reference
#
# This comprehensive command reference covers development tools and workflows that extend beyond the current repository setup. While not every tool or framework listed is implemented in this project, these commands serve as a valuable reference for both immediate development needs and future project expansions.
# =====================================

# =====================================
# Package Manager Commands
# =====================================

## Bun (Fastest Package Manager)
# Install dependencies
bun install
bun install --frozen-lockfile

# Add packages to specific workspaces
bun add ---package-name-goes-here--- --cwd projects/website
bun add ---package-name-goes-here--- --cwd projects/backend
bun add ---package-name-goes-here--- --dev --cwd projects/website

# Remove packages
bun remove ---package-name-goes-here--- --cwd projects/website

# Update packages
bun update
bun update ---package-name-goes-here---
bun outdated

# Cache management
bun pm cache
bun pm cache rm

# Run scripts
bun run dev
bun run build
bun dev  # Direct execution
bun build

# Package info
bun pm ls
bun pm ls --all

# Create new project
bun create next-app
bun create react-app
bun init

# Run files directly
bun run file.ts
bun run file.js

## Yarn
# Install dependencies
yarn install

# Add packages to specific workspaces
yarn workspaces foreach -A --include "{mobile,website}" add ---package-name-goes-here---
yarn workspace website add ---package-name-goes-here---
yarn workspace backend add ---package-name-goes-here---

# Remove packages
yarn workspace website remove ---package-name-goes-here---
yarn workspaces foreach remove ---package-name-goes-here---

# Update packages
yarn upgrade-interactive
yarn workspace website upgrade ---package-name-goes-here---

# Cache management
yarn cache clean

# Workspace info
yarn workspaces list
yarn workspaces info

## npm
# Install dependencies
npm install
npm ci  # Clean install

# Add packages to specific workspaces
npm install ---package-name-goes-here--- --workspace=website
npm install ---package-name-goes-here--- --workspace=backend

# Remove packages
npm uninstall ---package-name-goes-here--- --workspace=website

# Update packages
npm update
npm outdated

# Cache management
npm cache clean --force

## pnpm
# Install dependencies
pnpm install
pnpm i --frozen-lockfile  # CI install

# Add packages to specific workspaces
pnpm add ---package-name-goes-here--- --filter website
pnpm add ---package-name-goes-here--- --filter backend

# Remove packages
pnpm remove ---package-name-goes-here--- --filter website

# Update packages
pnpm update
pnpm update --latest

# Cache management
pnpm store prune

# Workspace commands
pnpm -r exec ---command---  # Run command in all workspaces
pnpm --filter website exec ---command---  # Run in specific workspace

# =====================================
# Advanced Development & Architecture
# =====================================

## Monorepo Management
# Lerna (if using)
npx lerna bootstrap
npx lerna publish
npx lerna version
npx lerna run test --scope=website
npx lerna exec -- rm -rf node_modules

# Nx (alternative to Turbo)
npx nx graph
npx nx run-many --target=build --all
npx nx affected:build
npx nx dep-graph

# Rush (Microsoft's monorepo tool)
rush update
rush build
rush publish

## Code Quality & Analysis
# SonarQube analysis
sonar-scanner
sonar-scanner -Dsonar.projectKey=my-project

# Code coverage
nyc npm test
nyc --reporter=html npm test
npx c8 bun test

# Complexity analysis
npx jscpd .  # Copy-paste detection
npx complexity-report src/
npx plato -r -d report src/

# Bundle analysis (advanced)
npx webpack-bundle-analyzer build/static/js/*.js
npx source-map-explorer build/static/js/*.js
ANALYZE=true npm run build

# Dependency analysis
npx madge --circular src/
npx dependency-cruiser src/
npx dpdm --circular --tree src/index.js

## Performance Profiling
# Node.js profiling
node --prof app.js
node --prof-process isolate-*.log > processed.txt

# Memory profiling
node --inspect app.js
node --inspect-brk app.js

# Performance monitoring
npx clinic doctor -- node app.js
npx clinic flame -- node app.js
npx clinic bubbleprof -- node app.js

# Lighthouse CI
npx lhci autorun
npx lhci collect --url=http://localhost:3000

# =====================================
# Advanced Git Operations
# =====================================

## Git Flow & Branching
# Git flow
git flow init
git flow feature start feature-name
git flow feature finish feature-name
git flow release start 1.0.0
git flow hotfix start hotfix-name

# Advanced branching
git checkout -b feature/JIRA-123-feature-name
git branch --merged | grep -v "\*\|main\|develop" | xargs -n 1 git branch -d
git for-each-ref --format='%(refname:short) %(committerdate)' refs/heads | sort -k2

# Interactive rebase
git rebase -i HEAD~3
git rebase --onto main feature-branch~3 feature-branch

# Advanced merging
git merge --no-ff feature-branch
git merge --squash feature-branch

# Submodules
git submodule add https://github.com/user/repo.git path/to/submodule
git submodule update --init --recursive
git submodule foreach git pull origin main

# Worktrees (multiple working directories)
git worktree add ../feature-branch feature-branch
git worktree list
git worktree remove ../feature-branch

## Advanced Git Analysis
# Git statistics
git log --oneline --graph --decorate --all
git log --author="John Doe" --since="2024-01-01" --until="2024-12-31" --pretty=format:"%h %s"
git shortlog -sn --all  # Contributor statistics

# File history and blame
git log --follow -- filename
git blame -L 1,10 filename
git log -p -- filename

# Find commits
git bisect start
git bisect bad HEAD
git bisect good v1.0.0

# Cherry-pick ranges
git cherry-pick A^..B
git cherry-pick --no-commit A^..B

# =====================================
# Database & ORM Operations
# =====================================

## Prisma (if using)
# Initialize and generate
npx prisma init
npx prisma generate
npx prisma db push
npx prisma db pull

# Migrations
npx prisma migrate dev --name init
npx prisma migrate deploy
npx prisma migrate reset

# Studio
npx prisma studio

# Seeding
npx prisma db seed

## Drizzle (if using)
# Generate migrations
npx drizzle-kit generate:mysql
npx drizzle-kit generate:pg
npx drizzle-kit push:mysql

# Studio
npx drizzle-kit studio

## Database Operations
# PostgreSQL
psql -U username -d database -h localhost
pg_dump database_name > backup.sql
psql database_name < backup.sql

# MySQL
mysql -u username -p database_name
mysqldump database_name > backup.sql
mysql database_name < backup.sql

# MongoDB
mongodump --db database_name
mongorestore dump/

# Redis
redis-cli
redis-cli --scan --pattern "prefix:*" | xargs redis-cli del

# =====================================
# Container & Infrastructure
# =====================================

## Docker (Advanced)
# Multi-stage builds
docker build --target production -t app:prod .
docker build --build-arg NODE_ENV=production -t app .

# Container management
docker exec -it container_id /bin/bash
docker logs -f container_id
docker stats
docker system df

# Docker Compose (Advanced)
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
docker-compose up --scale service_name=3
docker-compose exec service_name bash

# Registry operations
docker tag image:latest registry.com/image:latest
docker push registry.com/image:latest
docker pull registry.com/image:latest

## Kubernetes (if using)
# Basic operations
kubectl get pods
kubectl describe pod pod-name
kubectl logs -f pod-name
kubectl exec -it pod-name -- /bin/bash

# Deployments
kubectl apply -f deployment.yaml
kubectl rollout status deployment/app-deployment
kubectl rollout undo deployment/app-deployment

# Services and ingress
kubectl port-forward service/app-service 3000:80
kubectl get ingress

# Secrets and configs
kubectl create secret generic app-secret --from-literal=key=value
kubectl create configmap app-config --from-file=config.yaml

## Terraform (Infrastructure as Code)
# Initialize and plan
terraform init
terraform plan
terraform apply
terraform destroy

# State management
terraform state list
terraform state show resource_name
terraform import resource_name resource_id

# Workspaces
terraform workspace new production
terraform workspace select production

# =====================================
# Testing & Quality Assurance
# =====================================

## Advanced Testing
# Jest with coverage
jest --coverage --watchAll=false
jest --updateSnapshot
jest --detectOpenHandles

# Vitest
vitest run
vitest --coverage
vitest --ui

# Playwright
npx playwright test
npx playwright test --headed
npx playwright codegen
npx playwright show-report

# Cypress
npx cypress run
npx cypress run --spec "cypress/e2e/spec.cy.js"
npx cypress run --browser chrome

# Load testing
npx artillery quick --count 10 --num 5 http://localhost:3000
npx autocannon -c 10 -d 5 -p 10 http://localhost:3000

## API Testing
# Postman CLI
newman run collection.json
newman run collection.json -e environment.json

# HTTPie
http GET localhost:3000/api/users
http POST localhost:3000/api/users name="John" email="john@example.com"

# cURL advanced
curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' http://localhost:3000/api
curl -w "@curl-format.txt" -s -o /dev/null http://localhost:3000

# =====================================
# Security & Auditing
# =====================================

## Security Scanning
# Snyk
snyk auth
snyk test
snyk monitor
snyk wizard

# npm audit (advanced)
npm audit --audit-level moderate
npm audit fix --force

# License checking
npx license-checker --onlyAllow "MIT;Apache-2.0;BSD"
npx license-checker --summary

# OWASP dependency check
npx audit-ci --moderate

## Static Analysis
# ESLint (advanced)
npx eslint . --ext .js,.jsx,.ts,.tsx --fix
npx eslint . --format=checkstyle > checkstyle-result.xml
npx eslint . --cache --cache-location .eslintcache

# SonarJS
npx sonarjs-verify

# Semgrep (security)
semgrep --config=auto src/

# =====================================
# Monitoring & Observability
# =====================================

## Application Monitoring
# Sentry
sentry-cli releases new "$(git rev-parse HEAD)"
sentry-cli releases files "$(git rev-parse HEAD)" upload-sourcemaps ./build/static/js

# New Relic
newrelic install
newrelic entity search --name "My App"

## Performance Monitoring
# Web Vitals
npx web-vitals-cli http://localhost:3000

# Lighthouse
lighthouse http://localhost:3000 --output=html --output-path=./report.html
lighthouse http://localhost:3000 --preset=desktop --throttling.cpuSlowdownMultiplier=1

# PageSpeed Insights
npx psi http://localhost:3000

# =====================================
# CI/CD & Automation
# =====================================

## GitHub Actions (local testing)
# Act (run GitHub Actions locally)
act
act -j build
act -s GITHUB_TOKEN="token"

## Husky & Git Hooks
# Setup
npx husky install
npx husky add .husky/pre-commit "npm run lint-staged"
npx husky add .husky/commit-msg "npx commitlint --edit $1"

# Lint-staged
npx lint-staged

# Commitlint
npx commitlint --from HEAD~1 --to HEAD --verbose

## Release Management
# Semantic Release
npx semantic-release --dry-run
npx semantic-release --no-ci

# Changesets
npx changeset
npx changeset version
npx changeset publish

# Release-it
npx release-it
npx release-it --dry-run

# Standard Version
npx standard-version
npx standard-version --release-as major

# =====================================
# Advanced Node.js Operations
# =====================================

## Process Management
# PM2
pm2 start app.js
pm2 list
pm2 restart all
pm2 logs
pm2 monit

# Forever
forever start app.js
forever list
forever stopall

## Node.js Debugging
# Inspector
node --inspect-brk=0.0.0.0:9229 app.js
node --inspect app.js

# Debug with VS Code
node --inspect-brk app.js
# Then attach VS Code debugger

# Memory analysis
node --max-old-space-size=8192 app.js
node --trace-gc app.js

## Environment Management
# NVM
nvm install 18.17.0
nvm use 18.17.0
nvm alias default 18.17.0

# Volta
volta install node@18.17.0
volta pin node@18.17.0

# =====================================
# System Administration
# =====================================

## Process Monitoring (Advanced)
# htop with filtering
htop -p $(pgrep node | tr '\n' ',')

# Find resource-heavy processes
ps aux --sort=-%cpu | head -10
ps aux --sort=-%mem | head -10

# Network monitoring
netstat -tulpn | grep :3000
ss -tulpn | grep :3000
lsof -i :3000

## System Resources
# Disk usage analysis
du -sh * | sort -rh
ncdu  # Interactive disk usage

# Memory analysis
free -h
cat /proc/meminfo
vmstat 1

# File system monitoring
inotifywait -m -r -e modify,create,delete /path/to/watch

## Log Management
# Tail logs with filtering
tail -f /var/log/app.log | grep ERROR
journalctl -u service-name -f

# Log rotation
logrotate -f /etc/logrotate.conf

# =====================================
# Advanced Troubleshooting
# =====================================

## Network Debugging
# DNS resolution
nslookup domain.com
dig domain.com
host domain.com

# Network connectivity
telnet hostname 80
nc -zv hostname 80
ping -c 4 hostname

# HTTP debugging
curl -I http://domain.com
curl -v http://domain.com
curl --trace-time http://domain.com

## System Diagnostics
# Check open file descriptors
lsof | grep node
ulimit -n

# Check system limits
ulimit -a
cat /proc/sys/fs/file-max

# Performance profiling
strace -c node app.js
ltrace -c node app.js

# =====================================
# Environment & Configuration
# =====================================

## Environment Variables
# Cross-platform env setting
cross-env NODE_ENV=production npm start

# Dotenv management
node -r dotenv/config app.js
node -e "require('dotenv').config(); console.log(process.env)"

## Configuration Management
# Consul (if using)
consul kv put config/app/database_url "postgresql://..."
consul kv get config/app/database_url

# Vault (if using)
vault kv put secret/myapp db_password="secret"
vault kv get secret/myapp

# =====================================
# Useful Aliases for Senior Developers
# =====================================

# Add these to ~/.bashrc or ~/.zshrc:
# alias be='bun exec'
# alias br='bun run'
# alias bd='bun dev'
# alias bb='bun build'
# alias gst='git status'
# alias gco='git checkout'
# alias gpl='git pull'
# alias gps='git push'
# alias gcm='git commit -m'
# alias glog='git log --oneline --graph --decorate'
# alias ll='ls -la'
# alias la='ls -A'
# alias ..='cd ..'
# alias ...='cd ../..'
# alias cls='clear'
# alias reload='source ~/.bashrc'  # or ~/.zshrc
# alias dps='docker ps'
# alias dimg='docker images'
# alias k='kubectl'
# alias tf='terraform'
# alias ports='netstat -tuln'
# alias myip='curl ipinfo.io/ip'

# =====================================
# One-liner Productivity Commands
# =====================================

# Find and replace in all files
find . -type f -name "*.js" -exec sed -i 's/old-text/new-text/g' {} \;

# Count lines of code
find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | xargs wc -l

# Find large files
find . -type f -size +10M -exec ls -lh {} \; | sort -k5 -hr

# Remove node_modules recursively
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

# Generate file tree structure
tree -I 'node_modules|dist|build|.git'

# Quick HTTP server
python3 -m http.server 8000  # Python 3
php -S localhost:8000        # PHP
npx serve .                  # Node.js

# =====================================
# Project Initialization Templates
# =====================================

# Bun project templates
bun create next-app my-app
bun create react-app my-app
bun create vite my-app
bun create elysia my-api

# Advanced project setup with tools
npx create-t3-app@latest
npx create-remix@latest
npx create-svelte@latest my-app
npx degit sveltejs/template my-app

# =====================================
# Turbo Commands
# =====================================

# Build all packages
turbo run build

# Build specific packages
turbo run build --filter=website
turbo run build --filter=backend

# Development
turbo run dev
turbo run dev --filter=website

# Lint all packages
turbo run lint
turbo run lint --filter=website

# Type checking
turbo run check-types

# Testing
turbo run test
turbo run test --filter=website

# Clean cache
turbo run clean
turbo prune

# Generate turbo graph
turbo run build --graph=graph.html

# =====================================
# Next.js Commands
# =====================================

# Development
npm run dev
yarn dev
pnpm dev
bun run dev

# Build
npm run build
yarn build
pnpm build
bun run build

# Start production server
npm start
yarn start
pnpm start
bun run start

# Lint
npm run lint
yarn lint
pnpm lint
bun run lint

# Type checking
npx tsc --noEmit
yarn tsc --noEmit

# Analyze bundle
npm run build -- --analyze
ANALYZE=true npm run build

# Clean Next.js cache
rm -rf .next
npx next build --debug

# =====================================
# Expo Commands
# =====================================

# Install Expo CLI
npm install -g @expo/cli
yarn global add @expo/cli

# Start development server
npx expo start
npx expo start --tunnel
npx expo start --lan

# Run on platforms
npx expo run:android
npx expo run:ios
npx expo run:web

# Prebuild (generate native files)
npx expo prebuild
npx expo prebuild --clean

# Install dependencies
npx expo install
npx expo install ---package-name---

# Check compatibility
npx expo doctor
npx expo dependencies

# Build for stores
eas build --platform android --profile preview
eas build --platform ios --profile preview
eas build --platform all --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios

# Manage credentials
eas credentials

# Update Expo SDK
npx expo upgrade

# Clean Expo cache
npx expo start --clear
rm -rf node_modules .expo android ios && npm install && npx expo prebuild

# =====================================
# Vercel Commands
# =====================================

# Install Vercel CLI
npm install -g vercel
yarn global add vercel
pnpm add -g vercel
bun add -g vercel

# Login
vercel login

# Deploy
vercel
vercel --prod

# Development
vercel dev
vercel dev --port 3001

# Build locally
vercel build
vercel build --prod

# Environment variables
vercel env ls
vercel env add
vercel env rm ---name---

# Domains
vercel domains ls
vercel domains add ---domain---

# Projects
vercel projects ls
vercel link

# Logs
vercel logs ---deployment-url---

# Secrets (deprecated, use env)
vercel secrets ls
vercel secrets add ---name--- ---value---

# Pull environment variables
vercel env pull .env.local

# =====================================
# Database Commands (Supabase)
# =====================================

# Install Supabase CLI
npm install -g supabase
brew install supabase/tap/supabase

# Initialize project
supabase init
supabase login

# Start local development
supabase start
supabase stop

# Generate TypeScript types
supabase gen types typescript --project-id ---project-id--- > database.types.ts
supabase gen types typescript --local > database.types.ts

# Database migrations
supabase db reset
supabase db push
supabase db pull

# Functions
supabase functions new ---function-name---
supabase functions serve
supabase functions deploy ---function-name---

# =====================================
# React Native / Android Commands
# =====================================

# Clean Android build
cd android && ./gradlew clean && cd ..
cd android && ./gradlew cleanBuildCache && cd ..

# Reset Metro cache
npx react-native start --reset-cache

# Run Android
npx react-native run-android
npx react-native run-android --device

# Run iOS
npx react-native run-ios
npx react-native run-ios --device "iPhone 14"

# Check environment
npx react-native doctor

# Link native dependencies (legacy)
npx react-native link

# =====================================
# Development Tools
# =====================================

# React Compiler Health Check
npx react-compiler-healthcheck@latest

# Bundle analyzer
npx @next/bundle-analyzer
npx webpack-bundle-analyzer

# TypeScript
npx tsc --noEmit  # Type check only
npx tsc --init    # Initialize tsconfig.json

# ESLint
npx eslint . --fix
npx eslint --init

# Prettier
npx prettier . --write
npx prettier . --check

# Husky (Git hooks)
npx husky install
npx husky add .husky/pre-commit "npm run lint"

# License checker
npx license-checker

# Security audit
npm audit
npm audit fix
yarn audit
pnpm audit

# =====================================
# System & Utility Commands
# =====================================

# Get current directory (PowerShell)
Get-Location

# Get current directory (Bash/Zsh)
pwd

# Find large files
find . -type f -size +50M

# Check Node version
node --version
npm --version
yarn --version
pnpm --version
bun --version

# Check ports in use
netstat -an | grep :3000  # Unix
netstat -an | findstr :3000  # Windows

# Kill process on port
npx kill-port 3000
lsof -ti:3000 | xargs kill  # macOS/Linux

# Environment info
npx envinfo

# Network diagnostics
ping google.com
nslookup domain.com

# =====================================
# Git Commands (Common)
# =====================================

# Status and basic operations
git status
git add .
git commit -m "commit message"
git push
git pull

# Branch operations
git branch
git checkout -b feature/new-feature
git merge main
git rebase main

# Stash operations
git stash
git stash pop
git stash list

# Reset operations
git reset --hard HEAD~1
git clean -fd

# =====================================
# Docker Commands (if using)
# =====================================

# Build and run
docker build -t app-name .
docker run -p 3000:3000 app-name

# Docker Compose
docker-compose up
docker-compose down
docker-compose up --build

# Clean up
docker system prune
docker image prune

# =====================================
# Performance & Debugging
# =====================================

# Memory usage
ps aux | grep node  # Unix
wmic process where name="node.exe" get PageFileUsage,WorkingSetSize  # Windows

# Process monitoring
htop  # Linux
Activity Monitor  # macOS
Task Manager  # Windows

# Network monitoring
iftop  # Linux
nettop  # macOS

# =====================================
# Quick Fixes & Troubleshooting
# =====================================

# Clear all caches and reinstall (Nuclear option)
rm -rf node_modules package-lock.json yarn.lock .next .turbo && npm install

# Fix permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Reset git repository (DANGER!)
git reset --hard origin/main
git clean -fd

# Check for updates
npx npm-check-updates
npx npm-check-updates -u

# Fix Expo issues
npx expo doctor
rm -rf node_modules && npm install && npx expo prebuild --clean

# =====================================
# Useful Aliases (add to ~/.bashrc or ~/.zshrc)
# =====================================

# alias ll='ls -la'
# alias gs='git status'
# alias gp='git push'
# alias y='yarn'
# alias nr='npm run'
# alias nrd='npm run dev'
# alias nrb='npm run build'
# alias cls='clear'  # Windows-style clear