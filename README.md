# CoWIN: Vaccinator 💉

A browser extension for superfast booking of vaccine slots on [CoWIN](https://selfregistration.cowin.gov.in/).

## Screenshots
![Fill in your details.](https://raw.githubusercontent.com/ashish-r/cowin-vaccinator/main/screenshots/cowin-screenshot-1.jpg)

![Fill in your details.](https://raw.githubusercontent.com/ashish-r/cowin-vaccinator/main/screenshots/cowin-screenshot-2.jpg)

![Bot Running...](https://raw.githubusercontent.com/ashish-r/cowin-vaccinator/main/screenshots/cowin-screenshot-3.jpg)

## Installation

To install this extension on chrome, follow the steps mentioned [here](https://developer.chrome.com/docs/extensions/mv3/faq/#faq-dev-01). 
## Uses
After installation, visit the [CoWIN self-registration portal](https://selfregistration.cowin.gov.in/). You'll see a button to start the bot. Click on that button, fill in your details, and click on book my vaccine. This will automatically fill in all your details on the CoWin website, and you only need to enter the OTP. Once you enter the OTP, the bot will continuously search for available slots, and if found, it will auto-book it for you.
In case the bot is stuck or behaves unexpectedly, stop the bot and try refreshing the page. 

## Build
### npm run build
Transpiles the code to es5, bundles with `manifest.json`, and creates a zip file under the `build` directory.


[![DeepScan grade](https://deepscan.io/api/teams/10012/projects/17476/branches/401367/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=10012&pid=17476&bid=401367)
