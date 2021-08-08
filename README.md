# CoWIN: Vaccinator 💉

A browser extension for superfast automated booking of vaccine slots on [CoWIN](https://selfregistration.cowin.gov.in/).

## Installation

### Chrome web store

[CoWIN: Vaccinator 💉](https://chrome.google.com/webstore/detail/cowin-vaccinator-%F0%9F%92%89/edjhnplefifonpibnpeieioopodfloio) is available on the [chrome web store](https://chrome.google.com/webstore/detail/cowin-vaccinator-%F0%9F%92%89/edjhnplefifonpibnpeieioopodfloio). Just click on **Add to Chrome** to add this extension to your browser.

### Manual install

To manually install this extension, you need to enable the _Developer mode_.
<br/>Open extensions([chrome://extensions/](chrome://extensions/)) and check the box for "Developer mode" in the top right. For more details, [click here](https://developer.chrome.com/docs/extensions/mv3/faq/#faq-dev-01). <br/>
You can now [drag and drop](#drag-and-drop) or [load the unpacked directory of files](#load-unpacked) to install.

#### Drag and drop

**Download** the packed `crx` file from [here](https://raw.githubusercontent.com/ashish-r/cowin-vaccinator/build/bin/cowin-vaccinator.crx). <br/>
Open extensions, or visit [chrome://extensions/](chrome://extensions/) and _drag-and-drop_ the downloaded `crx` file on this page.

#### Load unpacked

**Download** the zipped `zip` file from [here](https://raw.githubusercontent.com/ashish-r/cowin-vaccinator/build/bin/cowin-vaccinator.zip). <br/>
Unzip/extract files in a folder. <br/>
Open extensions, or visit [chrome://extensions/](chrome://extensions/) and click on "Load unpacked" to select the folder where you have extracted the `zip` file contents.

## Uses

After installation, visit the [CoWIN self-registration portal](https://selfregistration.cowin.gov.in/). <br/>You'll see a button to start the bot. Click on that button, fill in your details, and click on book my vaccine. <br/>
The bot will automatically fill in all your details on the CoWin website, and you only need to enter the OTP. <br/>
Once you enter the OTP, the bot will continuously search for available slots, and if found, it will auto-book it for you.

In case the bot is stuck or behaves unexpectedly, stop the bot and try refreshing the page.<br />
All the data provided by you always stay on your computer. It is not stored/shared anywhere else.

### Advanced Features

#### Superfast login

The bot saves your mobile number so, in case of log out, you only need to provide the OTP for a superfast login experience.

#### Multiple Pin Code

You can enter multiple comma(,) separated pin codes. The bot will search for the vaccine availability at all provided pin codes one by one.

#### Search By State & District

You can also search for vaccine availability with State & District. You can only search with pin codes or state and district.

#### Multi-User Accounts

The bot supports accounts with multiple registered members. You need to select the correct Member Number On Dashboard. Example: If you have 3 registered members in one account, you can use this bot to book vaccines for all the 3 members one by one. You just need to provide the correct member number(the order in which they are present on the dashboard) for every member on the dashboard.

#### Dose 2

The bot also supports automated superfast booking for the second dose of vaccine.

#### Vaccine Preference

You can select the vaccine type from Covishield / Covaxin / Sputnik. You can also limit your search for only free vaccines.

#### Choose Vaccine Centre

If Let Me Choose The Vaccination Center is checked, the bot will hide all unavailable slots so you can choose the vaccine center from the list of all available centers, based on your preference.

#### Autobook

If Autobook is selected, the bot will automatically select the available vaccination center and a time slot to autocomplete the booking for you.

#### Retry Interval

The interval after which the bot should retry searching. CoWIN allows 20 searches within 15 mins, please provide this value responsibly.

#### Rate Limit Pause

If selected, the bot automatically pauses after it reaches the 20 search rate limit in 15 mins and it automatically continues after the cool-down period.

#### Audio Alerts

You get audio alerts when a slot is found or when you need to enter your OTP so that you never miss the opportunity to book a slot.

## Screenshots

![Fill in your details.](https://raw.githubusercontent.com/ashish-r/cowin-vaccinator/main/screenshots/cowin-screenshot-1.jpg)

![Autobook vaccine](https://raw.githubusercontent.com/ashish-r/cowin-vaccinator/main/screenshots/cowin-screenshot-2a.jpg)

![Let me choose vaccination center](https://raw.githubusercontent.com/ashish-r/cowin-vaccinator/main/screenshots/cowin-screenshot-2b.jpg)

![Dose 2 vaccine](https://raw.githubusercontent.com/ashish-r/cowin-vaccinator/main/screenshots/cowin-screenshot-2c.jpg)

![Bot Running...](https://raw.githubusercontent.com/ashish-r/cowin-vaccinator/main/screenshots/cowin-screenshot-3.jpg)

![Vaccine found submit now](https://raw.githubusercontent.com/ashish-r/cowin-vaccinator/main/screenshots/cowin-screenshot-4.jpg)

![Rate limit pause](https://raw.githubusercontent.com/ashish-r/cowin-vaccinator/main/screenshots/cowin-screenshot-5.jpg)

## Development

Clone the repository from [github.com/ashish-r/cowin-vaccinator](https://github.com/ashish-r/cowin-vaccinator). [![DeepScan grade](https://deepscan.io/api/teams/10012/projects/17476/branches/401367/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=10012&pid=17476&bid=401367)

### npm run build

Transpiles the code to es5, bundles with `manifest.json`, and creates a zip file under the `bin` directory.
