# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Salat An-Nabi & Azkar is a VS Code extension that displays periodic Islamic reminders (Salawat upon Prophet Muhammad and various azkar). It supports multiple languages (Arabic, English, French, Turkish, Urdu) and provides auto-dismissing notifications.

## Build Commands

```bash
npm run compile      # Compile TypeScript to JavaScript (outputs to out/)
npm run watch        # Watch mode for development
npm run lint         # Run ESLint on .ts and .tsx files
npm run test         # Run all tests (compiles automatically via pretest)
npm run vscode:prepublish  # Prepare for publishing (runs compile)
```

## Testing

Tests are in `src/test/extension.test.ts` using Mocha with VS Code test infrastructure:
- Unit tests: Extension presence, activation, command registration, configuration defaults
- Language file tests: Validates all 5 language JSON files have correct structure
- Integration tests: Toggle command, show now command, configuration change detection

Run tests: `npm run test`

## Architecture

### Entry Point
`src/extension.ts` - Single-file extension with:
- `activate()` - Initialization: reminder scheduling, status bar, commands
- `deactivate()` - Cleanup via `clearAllTimeouts()`
- Module-level timeout tracking: `mainTimeout` and `reminderTimeouts[]`
- Configuration change listener for hot-reloading settings

### Key Functions
- `loadLanguageMessages()` - Loads language JSON, falls back to Arabic
- `updateStatusBar()` - Updates status bar text/tooltip based on enabled state
- `remindToPray()` - Shows reminder(s) and schedules next cycle
- `scheduleNextReminder()` - Sets main timeout for next reminder
- `clearAllTimeouts()` - Cleanup for memory leak prevention

### Language Files
`languages/*.json` (ar, en, fr, tr, ur) with required structure:
```typescript
interface LanguageMessages {
    reminders: string[];
    statusBarText: string;
    statusBarTooltipEnabled: string;
    statusBarTooltipDisabled: string;
    enabledMessage: string;
    disabledMessage: string;
}
```

### VS Code Integration
- Activation: `onStartupFinished` event
- Commands: `salatAnNabi.toggleEnable`, `salatAnNabi.showNow`, `salatAnNabi.openSettings`
- Configuration: `salatAnNabi.*` namespace (enabled, intervalMinutes, reminderCount, language, useCustomMessages, customMessages, notificationDuration)

### Output
- Compiled JS: `out/` directory
- Entry point: `out/extension.js`

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on push/PR to main:
- Node.js 20
- `npm ci`, `npm run compile`, `npm run lint`
