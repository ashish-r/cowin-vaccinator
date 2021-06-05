(function () {
  const mobileNo = 8013904843;
  const autoBook = true;
  const pin = '';

  const [startTitleFlash, clearTitleFlash] = () => {
    const originalPageTitle = document.title;
    let interval1;
    let interval2;
    const titleFlashFunction = (type) => {
      interval1 = setInterval(() => {
        document.title = `CoWIN: Vaccinator 💉 ${type} found`;
      }, 1000);
      setTimeout(() => {
        interval2 = setInterval(() => {
          document.title = originalPageTitle;
        }, 1000);
      }, 1000);
    };

    const clearIntervals = () => {
      clearInterval(interval1);
      clearInterval(interval2);
      document.title = originalPageTitle;
    };

    return [titleFlashFunction, clearIntervals];
  };

  const logoutTimer = 870000; // 14.5 * 60000
  setTimeout(() => {
    waitForNode(() => document.getElementsByClassName('navigation logout-text')[0])[0].then((logoutButton) => {
      logoutButton.click();
      window.location.reload();
    });
  }, logoutTimer);

  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }

  scheduleEvent();

  function scheduleEvent() {
    const currentPath = window.location.pathname;
    if (currentPath.includes('appointment')) {
      locationDetails();
    } else if (currentPath.includes('dashboard')) {
      scheduleClick();
    } else {
      enterMobile();
    }
  }

  function districtSelection() {
    document.querySelector("mat-select[formcontrolname='district_id']")?.click();
    setTimeout(() => {
      const option = document.querySelector("mat-option[id='mat-option-53']");
      if (option) {
        option.click();
        console.log('district selected');
        filterSlots();
      } else {
        districtSelection();
      }
    }, 100);
  }

  function selectState() {
    if (!window.location.pathname.includes('appointment')) {
      return;
    }
    const searchType = document.querySelector("input[formcontrolname='searchType']");
    if (searchType && !searchType.checked) {
      searchType.click();
    } else {
      const stateField = document.querySelector("mat-select[formcontrolname='state_id']");
      if (stateField) {
        stateField.click();
        setTimeout(() => {
          const option = document.querySelector("mat-option[id='mat-option-21']");
          if (option) {
            console.log('state selected');
            option.click();
            districtSelection();
          } else {
            setTimeout(selectState, 100);
          }
        }, 100);
      } else {
        setTimeout(selectState, 100);
      }
    }
  }

  async function enterMobile() {
    const input = await waitForNode(() => document.querySelector("input[formcontrolname='mobile_number']"))[0];
    input.value = mobileNo;
    input.dispatchEvent(new KeyboardEvent('input', {}));
    input.blur();
    console.log('mobile number submit');
    document.getElementsByTagName('ion-button')[0].click();
    enterOtp();
  }

  async function enterOtp() {
    const otpInput = await waitForNode(() => document.querySelector("input[formcontrolname='otp']"))[0];

    otpInput.addEventListener('input', () => {
      if (otpInput.value.length === 6) {
        console.log('otp submitted');
        document.getElementsByTagName('ion-button')[0].click();
        scheduleClick();
      }
    });
  }

  let previousSchedulerCancel;
  async function scheduleClick() {
    if (previousSchedulerCancel) {
      previousSchedulerCancel();
    }
    const [scheduleButtonPromise, scheduleButtonPromiseReject] = waitForNode(
      () =>
        !document.getElementsByTagName('ion-spinner').length &&
        document.querySelector("img[src='assets/images/calndericon.svg']")
    );
    previousSchedulerCancel = scheduleButtonPromiseReject;
    await scheduleButtonPromise;
    console.log('schedule button clicked');
    scheduleButton.click();
    locationDetails();
  }

  function locationDetails() {
    if (!pin.trim()) selectState();
  }

  function apply18plus() {
    return waitForNode(() => document.querySelector("input[id='c1']"))[0].then((btn) => {
      console.log('applied 18plus filter');
      document.querySelector("input[id='c1']").click();
    });
  }

  async function filterSlots() {
    console.log('filterSlots');
    const searchButton = await waitForNode(() => document.getElementsByTagName('ion-button')[0])[0];
    searchButton.click();

    const table = await waitForNode(() => document.getElementsByTagName('mat-selection-list')?.[0])[0];
    console.log('response Received');
    await apply18plus();

    setTimeout(() => {
      console.log('response filter');
      const centerNames = [];
      const option = table.getElementsByTagName('mat-list-option');
      [...option].forEach((row) => {
        if (
          ![...row.querySelectorAll('.vaccine-box,.vaccine-box1,.vaccine-padding')].filter(
            (node) => !(node.getAttribute('tooltip') || node.getElementsByTagName('a')[0].text.includes('Booked'))
          ).length
        ) {
          row.remove();
        } else {
          centerNames.push(row.querySelector('.center-name-title').textContent);
        }
      });
      if (!option.length) {
        setTimeout(() => {
          console.log('searching again');
          if (!pin.trim()) filterSlots();
        }, 3000);
      } else {
        searchButton.scrollIntoView();
        console.log('Trigger Notification');
        showNotification(centerNames.join(', '), '');
      }
    }, 100);
  }

  function showNotification(type, centers) {
    const title = 'CoWIN: Vaccinator 💉 Slots Available';
    const icon = 'image-url';
    const body = `${type} available at ${centers}.${autoBook ? '' : 'Click On Submit Now!!!'}`;
    const notification = new Notification(title, { body, icon });
    notification.onclick = () => {
      notification.close();
      window.parent.focus();
      clearTitleFlash();
    };

    startTitleFlash();
    const audio = new Audio('./alert.wav');
    audio.play();
  }

  async function waitForNode(finder) {
    let promiseReject;
    let interval;
    const waitPromise = new Promise((resolve, reject) => {
      promiseReject = reject;
      interval = setInterval(() => {
        const node = finder();
        if (resolve) {
          clearInterval(interval);
          resolve(node);
        }
      }, 100);
    });
    const cancelWait = () => {
      promiseReject();
      clearInterval(interval);
    };
    return [waitPromise, cancelWait];
  }
})();
