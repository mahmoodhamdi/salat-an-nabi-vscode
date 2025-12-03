# التحسينات والأخطاء المطلوب إصلاحها
# Improvements and Bugs to Fix

> **آخر تحديث:** تم إصلاح معظم المشاكل العاجلة والمهمة. انظر العناصر المؤشر عليها بـ ✅

---

## 1. src/extension.ts

### أخطاء (Bugs)

#### ~~1.1 دالة `dismissPreviousNotifications` لا تعمل~~ ✅ تم الإصلاح (تم إزالتها)
```typescript
// السطر 123-136
function dismissPreviousNotifications() {
    activeNotifications.forEach(items => {
        items.forEach(item => {
            if (item.isCloseAffordance !== undefined) {
                (item as any).isCloseAffordance = true;
            }
        });
    });
    activeNotifications = [];
}
```
**المشكلة:** هذه الدالة لا تغلق الإشعارات فعلياً. VS Code لا يوفر طريقة مباشرة لإغلاق الإشعارات برمجياً، وتغيير `isCloseAffordance` لا يفعل شيئاً.

**الحل:** استخدام `vscode.window.withProgress` مع `CancellationToken` أو قبول أن الإشعارات ستختفي تلقائياً بعد فترة.

---

#### ~~1.2 المتغير `notification` غير مستخدم~~ ✅ تم الإصلاح
```typescript
// السطر 154
const notification = vscode.window.showInformationMessage(
    messages[randomIndex]
);
```
**المشكلة:** المتغير `notification` يُعرّف لكن لا يُستخدم.

**الحل:** إما إزالة المتغير أو استخدامه لتتبع الإشعارات.

---

#### ~~1.3 المصفوفة `activeNotifications` لا تُملأ أبداً~~ ✅ تم الإصلاح (تم إزالتها)
```typescript
// السطر 26
let activeNotifications: vscode.MessageItem[][] = [];
```
**المشكلة:** لا يتم إضافة أي إشعارات إلى هذه المصفوفة، لذا دالة `dismissPreviousNotifications` لن تفعل شيئاً.

---

#### ~~1.4 تعارض في القيمة الافتراضية لـ `intervalMinutes`~~ ✅ تم الإصلاح
```typescript
// السطر 17
let intervalMinutes = config.get<number>("intervalMinutes", 1);
// السطر 179
intervalMinutes = config.get<number>("intervalMinutes", 30);
```
**المشكلة:** القيمة الافتراضية `1` في البداية و `30` في `updateSettings()`.

**الحل:** توحيد القيمة الافتراضية (يجب أن تكون `30` حسب README).

---

#### ~~1.5 عدم تنظيف الـ timeout عند إلغاء تفعيل الإضافة~~ ✅ تم الإصلاح
```typescript
// السطر 212-214
export function deactivate() {
    // Clean up resources when extension is deactivated
}
```
**المشكلة:** لا يتم إلغاء الـ `timeout` عند إيقاف الإضافة.

**الحل:**
```typescript
export function deactivate() {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
}
```

---

#### ~~1.6 Memory Leak محتمل في setTimeout داخل الـ loop~~ ✅ تم الإصلاح
```typescript
// السطر 149-165
for (let i = 0; i < reminderCount; i++) {
    setTimeout(() => {
        // ...
        setTimeout(() => {
            dismissPreviousNotifications();
        }, notificationDuration * 1000);
    }, i * 1500);
}
```
**المشكلة:** هذه الـ timeouts لا يتم تتبعها ولا إلغاؤها عند إيقاف الإضافة.

---

### تحسينات (Improvements)

#### ~~1.7 استخدام `const` بدلاً من `let` للمتغيرات الثابتة~~ ✅ تم الإصلاح
```typescript
// السطور 101, 119
let toggleCommand = vscode.commands.registerCommand(...)
let showNowCommand = vscode.commands.registerCommand(...)
```
**الحل:** استخدام `const` لأن هذه القيم لا تتغير.

---

#### 1.8 فصل الكود إلى ملفات منفصلة
**التحسين:** الكود كله في ملف واحد. يُفضل فصله إلى:
- `src/extension.ts` - نقطة الدخول فقط
- `src/reminder.ts` - منطق التذكيرات
- `src/statusBar.ts` - إدارة شريط الحالة
- `src/config.ts` - إدارة الإعدادات
- `src/types.ts` - تعريف الأنواع (interfaces)

---

#### 1.9 إضافة logging للتصحيح
**التحسين:** إضافة output channel لتسهيل التصحيح:
```typescript
const outputChannel = vscode.window.createOutputChannel("Salat An-Nabi");
outputChannel.appendLine("Extension activated");
```

---

#### 1.10 استخدام Promises بدلاً من callbacks متداخلة
```typescript
// بدلاً من setTimeout المتداخلة
async function showRemindersSequentially() {
    for (let i = 0; i < reminderCount; i++) {
        await delay(i * 1500);
        showSingleReminder();
    }
}
```

---

## 2. package.json

### أخطاء (Bugs)

#### ~~2.1 إعداد `notificationDuration` غير معرّف~~ ✅ تم الإصلاح
**المشكلة:** الإعداد `salatAnNabi.notificationDuration` مستخدم في الكود لكن غير معرّف في `package.json`.

**الحل:** إضافة:
```json
"salatAnNabi.notificationDuration": {
    "type": "number",
    "default": 5,
    "minimum": 1,
    "maximum": 60,
    "description": "مدة عرض الإشعار (بالثواني) | Notification display duration (in seconds)"
}
```

---

#### ~~2.2 القيمة الافتراضية لـ `intervalMinutes` خاطئة~~ ✅ تم الإصلاح
```json
"salatAnNabi.intervalMinutes": {
    "type": "number",
    "default": 1,  // يجب أن تكون 30
```
**المشكلة:** القيمة `1` دقيقة قصيرة جداً وتزعج المستخدم.

**الحل:** تغييرها إلى `30`.

---

### تحسينات (Improvements)

#### ~~2.3 إضافة حدود للقيم الرقمية~~ ✅ تم الإصلاح
```json
"salatAnNabi.intervalMinutes": {
    "type": "number",
    "default": 30,
    "minimum": 1,
    "maximum": 1440,
    "description": "..."
}
```

---

#### ~~2.4 إضافة أمر لإظهار الإعدادات مباشرة~~ ✅ تم الإصلاح
```json
{
    "command": "salatAnNabi.openSettings",
    "title": "Open Salat An-Nabi Settings | فتح إعدادات صلِّ على النبي"
}
```

---

## 3. ملفات اللغات (languages/*.json)

### تحسينات (Improvements)

#### ~~3.1 حقل `buttonText` غير مستخدم~~ ✅ تم الإصلاح (تم إزالته)
```json
"buttonText": "آمين"
```
**المشكلة:** هذا الحقل موجود لكن غير مستخدم في الكود بعد إزالة الأزرار.

**الحل:** إزالته من جميع ملفات اللغات أو استخدامه.

---

#### 3.2 عدم تطابق الرسائل في الكود الاحتياطي
**المشكلة:** الرسائل الاحتياطية في `extension.ts` (السطور 46-71) لا تتطابق مع `ar.json`.

**الحل:** تحديث الرسائل الاحتياطية لتتطابق مع الملف.

---

## 4. الاختبارات (src/test/extension.test.ts)

### أخطاء (Bugs)

#### ~~4.1 لا توجد اختبارات فعلية~~ ✅ تم الإصلاح
```typescript
test('Sample test', () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
});
```
**المشكلة:** هذا اختبار نموذجي لا يختبر أي شيء في الإضافة.

**الحل:** إضافة اختبارات حقيقية:
```typescript
test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('Mahmoud-Elashwah.salat-an-nabi'));
});

test('Commands should be registered', async () => {
    const commands = await vscode.commands.getCommands();
    assert.ok(commands.includes('salatAnNabi.toggleEnable'));
    assert.ok(commands.includes('salatAnNabi.showNow'));
});
```

---

## 5. تحسينات عامة

### ~~5.1 إضافة TypeScript strict mode~~ ✅ تم الإصلاح
في `tsconfig.json`:
```json
{
    "compilerOptions": {
        "strictNullChecks": true,
        "noImplicitAny": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true
    }
}
```

---

### ~~5.2 إضافة .editorconfig~~ ✅ تم الإصلاح
```ini
root = true

[*]
indent_style = space
indent_size = 4
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

---

### ~~5.3 إضافة GitHub Actions للـ CI/CD~~ ✅ تم الإصلاح
إنشاء `.github/workflows/ci.yml` للتحقق التلقائي من:
- التجميع (compile)
- Linting
- الاختبارات

---

### ~~5.4 إضافة Prettier للتنسيق~~ ✅ تم الإصلاح
إضافة `.prettierrc`:
```json
{
    "semi": true,
    "singleQuote": true,
    "tabWidth": 4,
    "trailingComma": "es5"
}
```

---

## 6. ملخص الأولويات

### عاجل (Critical) ✅ تم إنجازها جميعاً
1. ~~إصلاح تعارض القيمة الافتراضية لـ `intervalMinutes`~~ ✅
2. ~~إضافة إعداد `notificationDuration` في package.json~~ ✅
3. ~~إصلاح دالة `deactivate()` لتنظيف الموارد~~ ✅

### مهم (Important) ✅ تم إنجازها جميعاً
4. ~~إصلاح أو إزالة دالة `dismissPreviousNotifications`~~ ✅
5. ~~إزالة المتغيرات غير المستخدمة~~ ✅
6. ~~إضافة اختبارات حقيقية~~ ✅

### تحسينات (Nice to have) - مكتمل جزئياً
7. فصل الكود إلى ملفات *(لم يتم - اختياري)*
8. إضافة logging *(لم يتم - اختياري)*
9. ~~إضافة CI/CD~~ ✅
10. ~~إضافة Prettier و EditorConfig~~ ✅
