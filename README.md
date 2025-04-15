# Salat An-Nabi & Azkar | صلِّ على النبي والأذكار

## Overview | نبذة عن الامتداد

Salat An-Nabi & Azkar is a Visual Studio Code extension that provides periodic reminders to send blessings upon Prophet Muhammad ❤️ and displays various Islamic remembrances (azkar). The extension is customizable and supports multiple languages.

**امتداد Salat An-Nabi & Azkar هو ملحق لـ VS Code يقوم بتذكيرك دوريًا بالصلاة على النبي ﷺ ❤️ وعرض مختلف الأذكار الإسلامية. الامتداد قابل للتعديل ويدعم لغات مختلفة.**

---

## Features | المميّزات

- Periodic reminders with both Salawat (blessings upon the Prophet) and Islamic remembrances (azkar)
- Auto-dismissing notifications (no need to click to close them)
- Customizable reminder messages
- Supports multiple languages (Arabic, English, French, Turkish, Urdu)
- Option to enable/disable reminders
- Customizable reminder interval
- Configurable notification display duration
- Status bar integration

**- تذكيرات دورية بالصلاة على النبي والأذكار الإسلامية المتنوعة**  
**- إشعارات تختفي تلقائيًا (بدون الحاجة للنقر لإغلاقها)**  
**- إمكانية تعديل رسائل التذكير**  
**- دعم اللغات المختلفة (العربية والإنجليزية والفرنسية والتركية والأردية)**  
**- خيار لتفعيل/تعطيل التذكيرات**  
**- خيار لتحديد الفترة الزمنية للتذكير**  
**- إمكانية ضبط مدة عرض الإشعارات**  
**- دمج مع شريط الحالة**  

---

## Installation | التنصيب

1. Open VS Code.
2. Go to the **Extensions** view (Ctrl+Shift+X).
3. Search for **Salat An-Nabi & Azkar**.
4. Click **Install**.

**1. افتح VS Code.**  
**2. انتقل إلى عرض الملحقات (Ctrl+Shift+X)**  
**3. ابحث عن "Salat An-Nabi & Azkar".**  
**4. اضغط على "تثبيت".**  

---

## Usage | كيفية الاستخدام

- The extension runs automatically on startup.
- You can enable/disable reminders via the command palette (Ctrl+Shift+P → **Toggle Salat An-Nabi Reminder**).
- You can show a reminder immediately via the command palette (Ctrl+Shift+P → **Show Salat An-Nabi Reminder Now**).
- Change settings in **File > Preferences > Settings > Salat An-Nabi & Azkar**.

**- يعمل الامتداد تلقائيًا عند تشغيل VS Code.**  
**- يمكنك تفعيل/تعطيل التذكير من قائمة الأوامر (Ctrl+Shift+P → Toggle Salat An-Nabi Reminder).**  
**- يمكنك عرض التذكير فورًا من قائمة الأوامر (Ctrl+Shift+P → Show Salat An-Nabi Reminder Now).**  
**- يمكنك تغيير الإعدادات من File > Preferences > Settings > Salat An-Nabi & Azkar.**  

---

## Configuration | الإعدادات

- `salatAnNabi.enabled`: Enable or disable the extension (default: true)
- `salatAnNabi.intervalMinutes`: Set reminder interval in minutes (default: 30)
- `salatAnNabi.reminderCount`: Number of reminders to show in sequence (default: 1)
- `salatAnNabi.language`: Language for reminders (default: "ar")
- `salatAnNabi.useCustomMessages`: Use custom messages instead of default ones (default: false)
- `salatAnNabi.customMessages`: Array of custom messages (if useCustomMessages is true)
- `salatAnNabi.notificationDuration`: Duration (in seconds) for which notifications are displayed before auto-dismiss (default: 5)

**- `salatAnNabi.enabled`: تفعيل أو تعطيل الامتداد (الافتراضي: مفعّل)**  
**- `salatAnNabi.intervalMinutes`: تعيين الفاصل الزمني للتذكير بالدقائق (الافتراضي: 30)**  
**- `salatAnNabi.reminderCount`: عدد التذكيرات المعروضة في تسلسل (الافتراضي: 1)**  
**- `salatAnNabi.language`: لغة التذكيرات (الافتراضي: "ar")**  
**- `salatAnNabi.useCustomMessages`: استخدام رسائل مخصصة بدلاً من الرسائل الافتراضية (الافتراضي: false)**  
**- `salatAnNabi.customMessages`: مصفوفة من الرسائل المخصصة (إذا كان useCustomMessages بقيمة true)**  
**- `salatAnNabi.notificationDuration`: مدة عرض الإشعارات (بالثواني) قبل الإخفاء التلقائي (الافتراضي: 5)**  

---

## Demo | عرض توضيحي

### 📸 Screenshots

![Screenshot 1](images/screenshot1.png)
![Screenshot 3](images/screenshot3.png)
![Screenshot 2](images/screenshot2.png)

---

## What's New in v2.2.0 | ما الجديد في الإصدار 2.2.0

- Added a wide variety of Islamic remembrances (azkar) in addition to Salawat
- Auto-dismissing notifications that disappear after a configurable time period
- Removed buttons from notifications for a cleaner interface
- New notifications automatically replace previous ones
- Added configuration option for notification duration

**- إضافة مجموعة متنوعة من الأذكار الإسلامية بالإضافة إلى الصلاة على النبي**  
**- إشعارات تختفي تلقائيًا بعد فترة زمنية قابلة للتخصيص**  
**- إزالة الأزرار من الإشعارات للحصول على واجهة أكثر نظافة**  
**- الإشعارات الجديدة تحل محل السابقة تلقائيًا**  
**- إضافة خيار تكوين لمدة عرض الإشعارات**  

---

## Contributing | المشاركة في التطوير

If you'd like to contribute, feel free to fork the repository, create a new branch, and submit a pull request.

**إذا كنت ترغب في المساهمة، فلا تتردد في عمل fork للمستودع، وإنشاء فرع جديد، وتقديم طلب سحب.**

---

## License | الرخصة

This project is licensed under the [MIT License](LICENSE).

**هذا المشروع مرخص بموجب [رخصة MIT](LICENSE).**
