(function () {
  const mobileNo = 8013904843;
  const autoBook = false;
  let currentPinIndex = 0;
  let currentSlotIndex = 0;
  const pin = '800008';
  const eighteenPlusOnly = true;

  const isCovishield = true;
  const isCovaxin = true;
  const isSputnik = true;

  const isFreeOnly = true;

  let previousSchedulerCancel;

  let allSlots = [];

  const [startTitleFlash, clearTitleFlash] = (() => {
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
  })();

  const logoutTimer = 870000; // 14.5 * 60000
  setTimeout(() => {
    waitForNode(() => document.getElementsByClassName('navigation logout-text')[0]).then((logoutButton) => {
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
    document.querySelector("mat-select[formcontrolname='district_id']").click();
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

  function searchByPin() {
    const searchType = document.querySelector("input[formcontrolname='searchType']");
    if (searchType && searchType.checked) {
      searchType.click();
      setTimeout(searchByPin, 100);
      return;
    }
    const pinInput = document.querySelector("input[formcontrolname='pincode']");
    const pinArr = pin.split(',');
    setTimeout(() => {
      pinInput.value = pinArr[currentPinIndex].trim();
      pinInput.dispatchEvent(new KeyboardEvent('input', {}));
      console.log('pin', pinArr[currentPinIndex]);
      filterSlots();
      currentPinIndex = currentPinIndex < pinArr.length - 1 ? currentPinIndex + 1 : 0;
    }, 100);
  }

  function selectState() {
    const searchType = document.querySelector("input[formcontrolname='searchType']");
    if (searchType && !searchType.checked) {
      searchType.click();
      setTimeout(selectState, 100);
      return;
    }
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

  async function enterMobile() {
    const input = await waitForNode(() => document.querySelector("input[formcontrolname='mobile_number']"));
    input.value = mobileNo;
    input.dispatchEvent(new KeyboardEvent('input', {}));
    input.blur();
    console.log('mobile number submit');
    document.querySelector('ion-button.login-btn').click();
    enterOtp();
  }

  async function enterOtp() {
    const otpInput = await waitForNode(() => document.querySelector("input[formcontrolname='otp']"));

    otpInput.addEventListener('input', () => {
      if (otpInput.value.length === 6) {
        console.log('otp submitted');
        document.getElementsByTagName('ion-button')[0].click();
        scheduleClick();
      }
    });
  }
  async function scheduleClick() {
    if (previousSchedulerCancel) {
      previousSchedulerCancel();
    }
    const scheduleButtonPromise = waitForNode(
      () =>
        !document.getElementsByTagName('ion-spinner').length &&
        document.querySelector("img[src='assets/images/calndericon.svg']")
    );
    previousSchedulerCancel = scheduleButtonPromise.cancel;
    const scheduleButton = await scheduleButtonPromise;
    console.log('schedule button clicked');
    scheduleButton.click();
    locationDetails();
  }

  function locationDetails() {
    if (!window.location.pathname.includes('appointment')) {
      setTimeout(locationDetails, 100);
      return;
    }
    if (pin.trim()) {
      searchByPin();
    } else {
      selectState();
    }
  }

  async function selectVaccineType() {
    if (isCovaxin && isCovishield && isSputnik) {
      return;
    }
    if (isCovaxin) {
      const button = await waitForNode(() => document.querySelector("input[id='c3']"));
      console.log('covishield selected');
      button.click();
    }
    if (isCovishield) {
      const button = await waitForNode(() => document.querySelector("input[id='c4']"));
      console.log('covishield selected');
      button.click();
    }
    if (isSputnik) {
      const button = await waitForNode(() => document.querySelector("input[id='c5']"));
      console.log('covishield selected');
      button.click();
    }
  }

  async function selectFreeOrPaid() {
    if (isFreeOnly === null) {
      return;
    }
  }

  async function apply18plus() {
    const button = await waitForNode(() => document.querySelector("input[id='c1']"));
    console.log('applied 18plus filter');
    button.click();
  }

  async function apply45plus() {
    const button = await waitForNode(() => document.querySelector("input[id='c2']"));
    console.log('applied 18plus filter');
    button.click();
  }

  async function book() {
    const timeSlots = await waitForNode(() => document.querySelectorAll('ion-button.time-slot'));
    timeSlots[Math.floor(timeSlots.length / 2)].click();
    if (autoBook) {
      console.log('book clicked');
      const bookButton = await waitForNode(() => document.querySelector("ion-button.confirm-btn[type='submit']"));
      bookButton.click();
    }
  }

  function selectSlot() {
    allSlots[currentSlotIndex].node.click();
    console.log('selected ', allSlots[currentSlotIndex].name);
    currentSlotIndex = currentSlotIndex < allSlots.length - 1 ? currentSlotIndex + 1 : 0;
    book();
  }

  async function filterSlots() {
    if (window.location.pathname === '/') {
      enterMobile();
    }
    console.log('filterSlots');
    const searchButton = await waitForNode(() => document.getElementsByTagName('ion-button')[0]);
    searchButton.click();

    const table = await waitForNode(() => document.getElementsByTagName('mat-selection-list')[0]);
    console.log('response Received');
    if (eighteenPlusOnly) {
      await apply18plus();
    } else {
      await apply45plus();
    }
    await selectVaccineType();

    await selectFreeOrPaid();

    setTimeout(() => {
      console.log('response filter');
      allSlots = [];
      const option = table.getElementsByTagName('mat-list-option');
      [...option].forEach((row) => {
        const toRemove = [...row.querySelectorAll('.vaccine-box,.vaccine-box1,.vaccine-padding')].filter(
          (node) => node.getAttribute('tooltip') || node.getElementsByTagName('a')[0].text.includes('Booked')
        );
        toRemove.forEach((node) => node.remove());
        const availableSlots = row.querySelectorAll('.vaccine-box,.vaccine-box1,.vaccine-padding');
        if (!availableSlots.length) {
          row.remove();
        } else {
          [...availableSlots].forEach((node) =>
            allSlots.push({
              name: row.querySelector('.center-name-title').textContent,
              node,
              count: (node.textContent || '').trim().split(' ')[0],
            })
          );
        }
      });

      if (allSlots.length) {
        allSlots.sort((a, b) => +b.count - +a.count);
        console.log(allSlots);

        selectSlot();
        searchButton.scrollIntoView();
        console.log('Trigger Notification');
        showNotification([...new Set(allSlots.map(({ name }) => name))].join(', '), '');
        return;
      }
      setTimeout(() => {
        console.log('searching again');
        if (window.location.pathname === '/') {
          enterMobile();
          return;
        }
        if (pin.trim()) {
          searchByPin();
        } else {
          filterSlots();
        }
      }, 3000);
    }, 100);
  }

  function showNotification(centers, type) {
    const title = 'CoWIN: Vaccinator 💉 Slots Available';
    const icon = 'image-url';
    const body = `${type} available at ${centers}.${autoBook ? '' : 'Click On Submit Now!!!'}`;
    const notification = new Notification(title, { body, icon });
    notification.onclick = () => {
      notification.close();
      window.parent.focus();
      clearTitleFlash();
    };

    startTitleFlash(type);
    const audio = new Audio('https://github.com/ashish-r/cowin-vaccinator/blob/main/src/alert.mp3?raw=true');
    audio
      .play()
      .then(function () {
        console.log('audio alert');
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function waitForNode(finder) {
    let promiseReject;
    let interval;
    const waitPromise = new Promise((resolve, reject) => {
      promiseReject = reject;
      interval = setInterval(() => {
        const node = finder();
        if (node) {
          clearInterval(interval);
          resolve(node);
        }
      }, 100);
    });
    const cancelWait = () => {
      promiseReject('cancelled');
      clearInterval(interval);
    };
    waitPromise.cancel = cancelWait;
    return waitPromise;
  }
})();
