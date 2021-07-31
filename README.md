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

In case the bot is stuck or behaves unexpectedly, stop the bot and try refreshing the page.

## Screenshots

![Fill in your details.](https://raw.githubusercontent.com/ashish-r/cowin-vaccinator/main/screenshots/cowin-screenshot-1.jpg)

![Book my vaccine](https://raw.githubusercontent.com/ashish-r/cowin-vaccinator/main/screenshots/cowin-screenshot-2.jpg)

![Bot Running...](https://raw.githubusercontent.com/ashish-r/cowin-vaccinator/main/screenshots/cowin-screenshot-3.jpg)

![Vaccine found submit now](https://raw.githubusercontent.com/ashish-r/cowin-vaccinator/main/screenshots/cowin-screenshot-4.jpg)

## Development

Clone the repository from [github.com/ashish-r/cowin-vaccinator](https://github.com/ashish-r/cowin-vaccinator). [![DeepScan grade](https://deepscan.io/api/teams/10012/projects/17476/branches/401367/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=10012&pid=17476&bid=401367)

### npm run build

Transpiles the code to es5, bundles with `manifest.json`, and creates a zip file under the `bin` directory.
