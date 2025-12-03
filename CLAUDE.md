# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Salat An-Nabi & Azkar is a VS Code extension that displays periodic Islamic reminders (Salawat upon Prophet Muhammad and various azkar). It supports multiple languages (Arabic, English, French, Turkish, Urdu) and provides auto-dismissing notifications.

## Build Commands

```bash
npm run compile      # Compile TypeScript to JavaScript (outputs to out/)
npm run watch        # Watch mode for development
npm run lint         # Run ESLint on .ts and .tsx files
npm run test         # Run all tests (requires npm run compile first)
npm run vscode:prepublish  # Prepare for publishing (runs compile)
```

## Testing

Tests are located in `src/test/extension.test.ts` using Mocha framework with VS Code test infrastructure:
- Unit tests: Extension presence, activation, command registration, configuration defaults
- Language file tests: Validates all 5 language JSON files exist and have correct structure
- Integration tests: Toggle command, show now command, configuration change detection

Run tests with: `npm run test` (automatically compiles first via pretest script)

## Architecture

### Entry Point
- `src/extension.ts` - Main extension code containing:
  - `activate()` - Extension initialization, sets up reminder scheduling, status bar, and commands
  - `deactivate()` - Cleanup on extension deactivation
  - Reminder scheduling via `setTimeout` intervals (main timeout + reminder timeouts arrays)
  - Status bar integration for toggling reminders
  - Configuration change listener for hot-reloading settings

### Key Functions in extension.ts
- `loadLanguageMessages()` - Loads language JSON, falls back to Arabic
- `updateStatusBar()` - Updates status bar text/tooltip based on enabled state
- `remindToPray()` - Shows reminder(s) and schedules next
- `scheduleNextReminder()` - Sets the main timeout for next reminder cycle
- `clearAllTimeouts()` - Cleanup function for all active timeouts

### Language Files
- `languages/*.json` - Localization files (ar, en, fr, tr, ur)
- Required structure: `reminders` (array), `statusBarText`, `statusBarTooltipEnabled`, `statusBarTooltipDisabled`, `enabledMessage`, `disabledMessage`
- Falls back to Arabic if selected language file not found

### VS Code Integration
- Activates on `onStartupFinished` event
- Commands: `salatAnNabi.toggleEnable`, `salatAnNabi.showNow`, `salatAnNabi.openSettings`
- Configuration namespace: `salatAnNabi.*` with settings: enabled, intervalMinutes, reminderCount, language, useCustomMessages, customMessages, notificationDuration

### Output
- Compiled JavaScript goes to `out/` directory
- Main entry point: `out/extension.js`
