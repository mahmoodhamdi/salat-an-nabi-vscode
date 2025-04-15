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
}

export function activate(context: vscode.ExtensionContext) {
    // Initialize variables
    let config = vscode.workspace.getConfiguration("salatAnNabi");
    let intervalMinutes = config.get<number>("intervalMinutes", 1);
    let reminderCount = config.get<number>("reminderCount", 1);
    let language = config.get<string>("language", "ar");
    let customMessages = config.get<string[]>("customMessages", []);
    let useCustomMessages = config.get<boolean>("useCustomMessages", false);
    let isEnabled = config.get<boolean>("enabled", true);
    let timeout: NodeJS.Timeout | null = null;
    let statusBarItem: vscode.StatusBarItem;
    let languageMessages: LanguageMessages;
    let activeNotifications: vscode.MessageItem[][] = [];
    let notificationDuration = config.get<number>("notificationDuration", 5); // Duration in seconds

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
                "reminders": [
                    "صلِّ على النبي ﷺ",
                    "اللهم صل وسلم وبارك على سيدنا محمد",
                    "اللهم صل على محمد وعلى آل محمد",
                    "اللهم صل على محمد عدد ما ذكره الذاكرون",
                    "اللهم صل وسلم على حبيبك المصطفى",
                    "اللَّهُمَّ مُنْزِلَ الْكِتَابِ، سَرِيعَ الْحِسَابِ، اهْزِمِ الأَحْزَابَ، اللَّهُمَّ اهزِمْهُمْ وَزَلْزِلْهُمْ",
                    "اللَّهُمَّ اكْفِنِي بِحَلاَلِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكِ عَمَّنْ سِوَاكَ",
                    "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
                    "أَعُوذُ بِاللَّهِ مِنَ الشَّيطَانِ الرَّجِيمِ، وَاتْفُلْ عَلَى يَسَارِكَ (ثلاثاً)",
                    "اللَّهُمَّ لاَ سَهْلَ إِلاَّ مَا جَعَلْتَهُ سَهْلاً، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلاً",
                    "مَا مِنْ عَبْدٍ يُذنِبُ ذَنْباً فَيُحْسِنُ الطُّهُورَ، ثُمَّ يَقُومُ فَيُصَلِّي رَكْعَتَيْنِ، ثُمَّ يَسْتَغْفِرُ اللَّهَ إِلاَّ غَفَرَ اللَّهُ لَهُ",
                    "قَدَرُ اللَّهُ وَمَا شَاءَ فَعَلَ",
                    "مَنْ صَلَّى عَلَيَّ صَلاَةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْراً",
                    "لاَ تَجْعَلُوا قَبْرِي عِيداً وَصَلُّوا عَلَيَّ؛ فَإِنَّ صَلاَتَكُم تَبْلُغُنِي حَيْثُ كُنْتُمْ",
                    "الْبَخِيلُ مَنْ ذُكِرْتُ عِنْدَهُ فَلَمْ يُصَلِّ عَلَيَّ",
                    "إِنَّ لِلَّهِ مَلاَئِكَةً سَيَّاحِينَ فِي الْأَرْضِ يُبَلِّغُونِي مِنْ أُمَّتِي السَّلاَمَ",
                    "مَا مِنْ أَحَدٍ يُسَلِّمُ عَلَيَّ إِلاَّ رَدَّ اللَّهُ عَلَيَّ رُوحِيَ حَتَّى أَرُدَّ عَلَيْهِ السَّلاَمَ",
                    "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ فِي يَوْمٍ مِائَةَ مَرَّةٍ حُطَّتْ خَطَايَاهُ وَلَوْ كَانَتْ مِثْلَ زَبَدِ الْبَحْر",
                    "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ، وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ عَشْرَ مِرَارٍ",
                    "كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحانَ اللَّهِ الْعَظِيمِ",
                    "لَأَنْ أَقُولَ سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلاَ إِلَهَ إِلاَّ اللَّهُ، وَاللَّهُ أَكْبَرُ، أَحَبُّ إِلَيَّ مِمَّا طَلَعَتْ عَلَيْهِ الشَّمسُ",
                    "أَيَعْجِزُ أَحَدُكُم أَنْ يَكْسِبَ كُلَّ يَوْمٍ أَلْفَ حَسَنَةٍ؟ يُسَبِّحُ مِائَةَ تَسْبِيحَةٍ، فَيُكتَبُ لَهُ أَلْفُ حَسَنَةٍ أَوْ يُحَطُّ عَنْهُ أَلْفُ خَطِيئَةٍ",
                    "مَنْ قَالَ: سُبْحَانَ اللَّهِ الْعَظِيمِ وَبِحَمْدِهِ غُرِسَتْ لَهُ نَخْلَةٌ فِي الْجَنَّةِ",
                    "يَا عَبْدَ اللَّهِ بْنَ قَيْسٍ أَلاَ أَدُلُّكَ عَلَى كَنْزٍ مِنْ كُنُوزِ الْجَنَّةِ؟ قُلْ لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ"
                  ],                statusBarText: "$(heart) صلِّ على النبي",
                statusBarTooltipEnabled: "إيقاف التذكير",
                statusBarTooltipDisabled: "تفعيل التذكير",
                enabledMessage: "تم تفعيل تذكير الصلاة على النبي ﷺ",
                disabledMessage: "تم تعطيل تذكير الصلاة على النبي ﷺ"
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

    // Close previous notifications
    function dismissPreviousNotifications() {
        // Dismiss all active notifications
        activeNotifications.forEach(items => {
            items.forEach(item => {
                if (item.isCloseAffordance !== undefined) {
                    // This is a hack to trigger the close affordance
                    // since VS Code doesn't expose a direct way to dismiss notifications
                    (item as any).isCloseAffordance = true;
                }
            });
        });
        activeNotifications = [];
    }

    // Display reminder
    function remindToPray() {
        if (!isEnabled) return;
        
        // Dismiss any existing notifications first
        dismissPreviousNotifications();
        
        const messages = useCustomMessages && customMessages.length > 0 
            ? customMessages 
            : languageMessages.reminders;
        
        for (let i = 0; i < reminderCount; i++) {
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * messages.length);
                
                // Show message without any buttons
                const notification = vscode.window.showInformationMessage(
                    messages[randomIndex]
                );
                
                // Auto-dismiss notification after the configured duration
                setTimeout(() => {
                    // Force dismiss the notification
                    dismissPreviousNotifications();
                }, notificationDuration * 1000);
                
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
        notificationDuration = config.get<number>("notificationDuration", 5);
        
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