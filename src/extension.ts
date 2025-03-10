import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

interface LanguageMessages {
    reminders: string[];
    statusBarText: string;
    statusBarTooltipEnabled: string;
    statusBarTooltipDisabled: string;
    enabledMessage: string;
    disabledMessage: string;
    buttonText: string;
}

export function activate(context: vscode.ExtensionContext) {
    // Initialize variables
    let config = vscode.workspace.getConfiguration("salatAnNabi");
    let intervalMinutes = config.get<number>("intervalMinutes", 30);
    let reminderCount = config.get<number>("reminderCount", 1);
    let language = config.get<string>("language", "ar");
    let customMessages = config.get<string[]>("customMessages", []);
    let useCustomMessages = config.get<boolean>("useCustomMessages", false);
    let isEnabled = config.get<boolean>("enabled", true);
    let timeout: NodeJS.Timeout | null = null;
    let statusBarItem: vscode.StatusBarItem;
    let languageMessages: LanguageMessages;

    // Load language messages
    function loadLanguageMessages() {
        try {
            const languagePath = path.join(context.extensionPath, 'languages', `${language}.json`);
            if (fs.existsSync(languagePath)) {
                const fileContent = fs.readFileSync(languagePath, 'utf8');
                languageMessages = JSON.parse(fileContent);
            } else {
                // Fall back to Arabic if language file not found
                const fallbackPath = path.join(context.extensionPath, 'languages', 'ar.json');
                const fileContent = fs.readFileSync(fallbackPath, 'utf8');
                languageMessages = JSON.parse(fileContent);
                vscode.window.showWarningMessage(`Language "${language}" not found, using Arabic as fallback.`);
            }
        } catch (error) {
            // Use default values if there's an error
            languageMessages = {
                reminders: ["صلِّ على النبي ﷺ", "اللهم صل وسلم وبارك على سيدنا محمد"],
                statusBarText: "$(heart) صلِّ على النبي",
                statusBarTooltipEnabled: "إيقاف التذكير",
                statusBarTooltipDisabled: "تفعيل التذكير",
                enabledMessage: "تم تفعيل تذكير الصلاة على النبي ﷺ",
                disabledMessage: "تم تعطيل تذكير الصلاة على النبي ﷺ",
                buttonText: "آمين"
            };
            vscode.window.showErrorMessage("Error loading language file, using defaults.");
        }
    }

    // Load language messages
    loadLanguageMessages();

    // Create status bar button
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = "salatAnNabi.toggleEnable";
    updateStatusBar();
    statusBarItem.show();

    // Update status bar state
    function updateStatusBar() {
        statusBarItem.text = isEnabled 
            ? languageMessages.statusBarText 
            : languageMessages.statusBarText.replace("$(heart)", "$(heart-filled)");
        statusBarItem.tooltip = isEnabled 
            ? languageMessages.statusBarTooltipEnabled 
            : languageMessages.statusBarTooltipDisabled;
    }

    // Toggle command
    let toggleCommand = vscode.commands.registerCommand("salatAnNabi.toggleEnable", () => {
        isEnabled = !isEnabled;
        updateStatusBar();
        
        // Update settings
        config.update("enabled", isEnabled, true);
        
        if (isEnabled) {
            vscode.window.showInformationMessage(languageMessages.enabledMessage);
            if (timeout) clearTimeout(timeout);
            scheduleNextReminder();
        } else {
            vscode.window.showInformationMessage(languageMessages.disabledMessage);
            if (timeout) clearTimeout(timeout);
        }
    });

    // Show reminder now command
    let showNowCommand = vscode.commands.registerCommand("salatAnNabi.showNow", () => {
        remindToPray();
    });

    // Display reminder
    function remindToPray() {
        if (!isEnabled) return;
        
        const messages = useCustomMessages && customMessages.length > 0 
            ? customMessages 
            : languageMessages.reminders;
        
        for (let i = 0; i < reminderCount; i++) {
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * messages.length);
                vscode.window.showInformationMessage(
                    messages[randomIndex], 
                    languageMessages.buttonText
                );
            }, i * 1500);
        }
        scheduleNextReminder();
    }

    // Schedule next reminder
    function scheduleNextReminder() {
        if (!isEnabled) return;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(remindToPray, intervalMinutes * 60 * 1000);
    }

    // Update settings when changed
    function updateSettings() {
        config = vscode.workspace.getConfiguration("salatAnNabi");
        intervalMinutes = config.get<number>("intervalMinutes", 30);
        reminderCount = config.get<number>("reminderCount", 1);
        language = config.get<string>("language", "ar");
        customMessages = config.get<string[]>("customMessages", []);
        useCustomMessages = config.get<boolean>("useCustomMessages", false);
        isEnabled = config.get<boolean>("enabled", true);
        
        loadLanguageMessages();
        updateStatusBar();
        
        if (timeout) clearTimeout(timeout);
        if (isEnabled) {
            scheduleNextReminder();
        }
    }

    // Start scheduling reminders
    if (isEnabled) {
        scheduleNextReminder();
    }

    // Register subscribers
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration("salatAnNabi")) updateSettings();
        }),
        toggleCommand,
        showNowCommand,
        statusBarItem
    );
}

export function deactivate() {
    // Clean up resources when extension is deactivated
}