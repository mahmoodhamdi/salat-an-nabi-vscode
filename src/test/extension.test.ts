import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    // Unit Tests
    suite('Unit Tests', () => {
        test('Extension should be present', () => {
            const extension = vscode.extensions.getExtension('Mahmoud-Elashwah.salat-an-nabi');
            assert.ok(extension, 'Extension should be installed');
        });

        test('Extension should activate', async () => {
            const extension = vscode.extensions.getExtension('Mahmoud-Elashwah.salat-an-nabi');
            if (extension) {
                await extension.activate();
                assert.ok(extension.isActive, 'Extension should be active');
            }
        });

        test('Commands should be registered', async () => {
            const commands = await vscode.commands.getCommands(true);
            assert.ok(commands.includes('salatAnNabi.toggleEnable'), 'Toggle command should be registered');
            assert.ok(commands.includes('salatAnNabi.showNow'), 'Show now command should be registered');
        });

        test('Configuration should have default values', () => {
            const config = vscode.workspace.getConfiguration('salatAnNabi');

            assert.strictEqual(config.get('enabled'), true, 'enabled should default to true');
            assert.strictEqual(config.get('intervalMinutes'), 30, 'intervalMinutes should default to 30');
            assert.strictEqual(config.get('reminderCount'), 1, 'reminderCount should default to 1');
            assert.strictEqual(config.get('language'), 'ar', 'language should default to ar');
            assert.strictEqual(config.get('useCustomMessages'), false, 'useCustomMessages should default to false');
            assert.strictEqual(config.get('notificationDuration'), 5, 'notificationDuration should default to 5');
            assert.deepStrictEqual(config.get('customMessages'), [], 'customMessages should default to empty array');
        });

        test('Configuration intervalMinutes should have valid range', () => {
            const config = vscode.workspace.getConfiguration('salatAnNabi');
            const intervalMinutes = config.get<number>('intervalMinutes', 30);

            assert.ok(intervalMinutes >= 1, 'intervalMinutes should be at least 1');
            assert.ok(intervalMinutes <= 1440, 'intervalMinutes should be at most 1440');
        });

        test('Configuration notificationDuration should have valid range', () => {
            const config = vscode.workspace.getConfiguration('salatAnNabi');
            const notificationDuration = config.get<number>('notificationDuration', 5);

            assert.ok(notificationDuration >= 1, 'notificationDuration should be at least 1');
            assert.ok(notificationDuration <= 60, 'notificationDuration should be at most 60');
        });

        test('Supported languages should be valid', () => {
            const supportedLanguages = ['ar', 'en', 'fr', 'tr', 'ur'];
            const config = vscode.workspace.getConfiguration('salatAnNabi');
            const language = config.get<string>('language', 'ar');

            assert.ok(supportedLanguages.includes(language), `Language ${language} should be supported`);
        });
    });

    // Language Files Tests
    suite('Language Files Tests', () => {
        const languagesDir = path.join(__dirname, '..', '..', 'languages');
        const supportedLanguages = ['ar', 'en', 'fr', 'tr', 'ur'];

        for (const lang of supportedLanguages) {
            test(`Language file ${lang}.json should exist`, () => {
                const langPath = path.join(languagesDir, `${lang}.json`);
                assert.ok(fs.existsSync(langPath), `${lang}.json should exist`);
            });

            test(`Language file ${lang}.json should have valid structure`, () => {
                const langPath = path.join(languagesDir, `${lang}.json`);
                const content = fs.readFileSync(langPath, 'utf8');
                const langData = JSON.parse(content);

                assert.ok(Array.isArray(langData.reminders), 'reminders should be an array');
                assert.ok(langData.reminders.length > 0, 'reminders should not be empty');
                assert.ok(typeof langData.statusBarText === 'string', 'statusBarText should be a string');
                assert.ok(typeof langData.statusBarTooltipEnabled === 'string', 'statusBarTooltipEnabled should be a string');
                assert.ok(typeof langData.statusBarTooltipDisabled === 'string', 'statusBarTooltipDisabled should be a string');
                assert.ok(typeof langData.enabledMessage === 'string', 'enabledMessage should be a string');
                assert.ok(typeof langData.disabledMessage === 'string', 'disabledMessage should be a string');
            });

            test(`Language file ${lang}.json reminders should all be strings`, () => {
                const langPath = path.join(languagesDir, `${lang}.json`);
                const content = fs.readFileSync(langPath, 'utf8');
                const langData = JSON.parse(content);

                for (const reminder of langData.reminders) {
                    assert.ok(typeof reminder === 'string', 'Each reminder should be a string');
                    assert.ok(reminder.length > 0, 'Reminder should not be empty');
                }
            });
        }
    });

    // Integration Tests
    suite('Integration Tests', () => {
        test('Toggle command should work', async () => {
            const config = vscode.workspace.getConfiguration('salatAnNabi');
            const initialState = config.get<boolean>('enabled', true);

            // Execute toggle command
            await vscode.commands.executeCommand('salatAnNabi.toggleEnable');

            // Wait a bit for the command to complete
            await new Promise(resolve => setTimeout(resolve, 100));

            // Get new state
            const newConfig = vscode.workspace.getConfiguration('salatAnNabi');
            const newState = newConfig.get<boolean>('enabled');

            // Verify state changed
            assert.notStrictEqual(newState, initialState, 'State should have toggled');

            // Toggle back to original state
            await vscode.commands.executeCommand('salatAnNabi.toggleEnable');
        });

        test('Show now command should execute without error', async () => {
            // This test verifies the command can be executed without throwing
            try {
                await vscode.commands.executeCommand('salatAnNabi.showNow');
                assert.ok(true, 'Show now command executed successfully');
            } catch (error) {
                assert.fail(`Show now command threw an error: ${error}`);
            }
        });

        test('Configuration change should be detected', async () => {
            const config = vscode.workspace.getConfiguration('salatAnNabi');

            // Update a configuration value
            await config.update('intervalMinutes', 45, vscode.ConfigurationTarget.Global);

            // Wait for config change to propagate
            await new Promise(resolve => setTimeout(resolve, 100));

            // Verify the change
            const newConfig = vscode.workspace.getConfiguration('salatAnNabi');
            assert.strictEqual(newConfig.get('intervalMinutes'), 45, 'Configuration should be updated');

            // Reset to default
            await config.update('intervalMinutes', 30, vscode.ConfigurationTarget.Global);
        });
    });
});
