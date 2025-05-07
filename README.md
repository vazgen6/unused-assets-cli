# unused-assets-cli

A CLI tool to find and optionally remove unused asset files for example in Angular or React.js project.

## Installation

```bash
npm install -g unused-assets-cli
```

## Usage

```bash
# Scan assets and list unused files
unused-assets

# Scan custom patterns
unused-assets -p "src/assets/images/**/*.*" "src/assets/fonts/**/*.*"

# Remove unused files interactively
unused-assets --remove

# Force remove without prompt
unused-assets --remove --force
```

## Build & Development

```bash
git clone <repo>
npm install
npm run build