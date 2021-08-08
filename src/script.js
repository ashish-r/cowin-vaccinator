let vaccinatorFormData = {};
(async function () {
  const maximumSearch = 20;
  const maximumSearchIntervalLimit = 15;
  const maximumSearchInterval = (maximumSearchIntervalLimit + 0.2) * 60 * 1000; // extra time for safety
  const defaultRetryInterval = Math.ceil((maximumSearchIntervalLimit * 60) / maximumSearch);
  let remainingSearch = maximumSearch;

  if (!window.Notification) {
    window.Notification = {
      mock: true,
    };
  }
  vaccinatorFormData = {
    autoSelect: true,
    autoBook: true,
    isCovaxin: true,
    isCovishield: true,
    isSputnik: true,
    eighteenPlusOnly: true,
    memberNumber: 1,
    dose: 1,
    searchTimeStamp: [],
    rateLimit: false,
    retryInterval: defaultRetryInterval,
    ...(await getData()),
  };

  if (vaccinatorFormData.start) {
    addPrimaryContainer('green', 'Bot Running...');
  } else {
    addPrimaryContainer('red', 'Start Bot');
  }

  searchQuotaCron();

  let currentPinIndex = 0;

  let previousSchedulerCancel;
  let logoutTimeout;

  const [startTitleFlash, clearTitleFlash] = (() => {
    const originalPageTitle = document.title;
    let interval1;
    let interval2;
    const titleFlashFunction = (title) => {
      interval1 = setInterval(() => {
        document.title = title;
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

  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }

  if (
    vaccinatorFormData.start &&
    vaccinatorFormData.mobileNo &&
    (vaccinatorFormData.pin || (vaccinatorFormData.state && vaccinatorFormData.district))
  ) {
    scheduleEvent();
  } else if (!vaccinatorFormData.start) {
    console.log('Collecting form data for CoWIN: Vaccinator 💉');
    collectData();
  }

  function scheduleEvent() {
    const currentPath = window.location.pathname;
    if (currentPath.includes('appointment')) {
      locationDetails();
    } else if (currentPath.includes('dashboard')) {
      scheduleClick();
    } else if (currentPath === '/') {
      if (logoutTimeout) {
        window.location.reload();
        return;
      }
      enterMobile();
    } else {
      setTimeout(scheduleEvent, 100);
    }
  }

  async function collectData() {
    waitForNode(() => document.querySelector("input[formcontrolname='pincode']")).then((pinInput) => {
      pinInput.addEventListener('change', (e) => {
        if (!vaccinatorFormData.start) {
          setVaccinatorFormData('pin', e.target.value);
        }
      });
    });

    waitForNode(() => document.querySelector("mat-select[formcontrolname='state_id']")).then((stateField) => {
      stateField.addEventListener('click', async () => {
        const options = await waitForNode(() => document.querySelector("div[role='listbox']"));
        options.addEventListener('click', (e) => {
          if (!vaccinatorFormData.start) {
            setVaccinatorFormData('state', (e.target.textContent || '').trim());
          }
        });
      });
    });

    waitForNode(() => document.querySelector("mat-select[formcontrolname='district_id']")).then((districtField) => {
      districtField.addEventListener('click', async () => {
        const options = await waitForNode(() => document.querySelector("div[role='listbox']"));
        options.addEventListener('click', (e) => {
          if (!vaccinatorFormData.start) {
            setVaccinatorFormData('district', (e.target.textContent || '').trim());
          }
        });
      });
    });

    waitForNode(() => document.querySelector("input[id='ca1']")).then((age1845Button) => {
      age1845Button.addEventListener('change', (e) => {
        if (!vaccinatorFormData.start) {
          setVaccinatorFormData('eighteenPlusOnly', e.target.checked);
        }
      });
    });

    waitForNode(() => document.querySelector("input[id='c2']")).then((age45Button) => {
      age45Button.addEventListener('change', (e) => {
        if (!vaccinatorFormData.start) {
          setVaccinatorFormData('eighteenPlusOnly', !e.target.checked);
        }
      });
    });

    waitForNode(() => document.querySelector("input[id='c3']")).then((covishieldButton) => {
      covishieldButton.addEventListener('change', (e) => {
        if (!vaccinatorFormData.start) {
          setVaccinatorFormData('isCovishield', e.target.checked);
        }
      });
    });

    waitForNode(() => document.querySelector("input[id='c4']")).then((covaxinButton) => {
      covaxinButton.addEventListener('change', (e) => {
        if (!vaccinatorFormData.start) {
          setVaccinatorFormData('isCovaxin', e.target.checked);
        }
      });
    });

    waitForNode(() => document.querySelector("input[id='c5']")).then((sputnikButton) => {
      sputnikButton.addEventListener('change', (e) => {
        if (!vaccinatorFormData.start) {
          setVaccinatorFormData('isSputnik', e.target.checked);
        }
      });
    });

    waitForNode(() => document.querySelector("input[id='c7']")).then((freeButton) => {
      freeButton.addEventListener('change', (e) => {
        if (!vaccinatorFormData.start) {
          setVaccinatorFormData('isFreeOnly', e.target.checked);
        }
      });
    });

    waitForNode(() => document.querySelector("input[formcontrolname='mobile_number']")).then((mobileInput) => {
      console.log('CoWIN: Vaccinator 💉 watching mobile field');
      mobileInput.addEventListener('change', (e) => {
        if (!vaccinatorFormData.start) {
          setVaccinatorFormData('mobileNo', e.target.value);
        }
      });
    });
  }

  function districtSelection() {
    document.querySelector("mat-select[formcontrolname='district_id']").click();
    if (!vaccinatorFormData.district) return;

    setTimeout(() => {
      const option = [...document.querySelectorAll("mat-option[role='option']")].find(
        (node) => node.textContent.trim().toLowerCase() === vaccinatorFormData.district.trim().toLowerCase()
      );
      if (option) {
        option.click();
        console.log('district selected');
        filterSlots();
      } else {
        setTimeout(districtSelection, 100);
      }
    }, 100);
  }

  async function searchByPin() {
    const searchType = document.querySelector("input[formcontrolname='searchType']");
    if (searchType && searchType.checked) {
      searchType.click();
      setTimeout(searchByPin, 100);
      return;
    }
    const pinInput = await waitForNode(() => document.querySelector("input[formcontrolname='pincode']"));
    const pinArr = vaccinatorFormData.pin.split(',');
    const pinToSerach = pinArr[currentPinIndex].trim();
    if (!pinToSerach) return;
    setTimeout(() => {
      pinInput.value = pinToSerach;
      pinInput.dispatchEvent(new KeyboardEvent('input', {}));
      console.log('pin', pinToSerach);
      setTimeout(() => {
        filterSlots();
        currentPinIndex = currentPinIndex < pinArr.length - 1 ? currentPinIndex + 1 : 0;
      }, 100);
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
      if (!vaccinatorFormData.state) return;
      setTimeout(() => {
        const option = [...document.querySelectorAll("mat-option[role='option']")].find(
          (node) => node.textContent.trim().toLowerCase() === vaccinatorFormData.state.trim().toLowerCase()
        );
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
    const mobileNumber = (vaccinatorFormData.mobileNo || '').trim();
    if (!mobileNumber) return;
    input.value = mobileNumber;
    input.dispatchEvent(new KeyboardEvent('input', {}));
    input.blur();
    console.log('mobile number submit');
    document.querySelector('ion-button.login-btn').click();
    enterOtp();
  }

  async function enterOtp() {
    showNotification('CoWIN: Vaccinator 💉 Login Again', 'Please enter OTP to login again');
    const otpInput = await waitForNode(() => document.querySelector("input[formcontrolname='otp']"));
    otpInput.addEventListener('input', () => {
      if (otpInput.value.length === 6) {
        console.log('otp submitted');
        document.getElementsByTagName('ion-button')[0].click();
        scheduleClick();
        scheduleLogout();
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
        document.querySelectorAll("img[src='assets/images/calndericon.svg']")[
          (+vaccinatorFormData.memberNumber || 1) - 1
        ]
    );
    previousSchedulerCancel = scheduleButtonPromise.cancel;
    const scheduleButton = await scheduleButtonPromise;
    console.log('schedule button clicked');
    scheduleButton.click();
    locationDetails();
  }

  async function locationDetails() {
    const shouldProceed = await new Promise((resolve) => {
      setTimeout(() => {
        if (!window.location.pathname.includes('appointment')) {
          window.location.reload();
          resolve(false);
        } else {
          resolve(true);
        }
      }, 100);
    });

    if (!shouldProceed) return;

    if ((vaccinatorFormData.pin || '').trim()) {
      searchByPin();
    } else {
      selectState();
    }
  }

  async function selectVaccineType() {
    if (
      (vaccinatorFormData.isCovaxin && vaccinatorFormData.isCovishield && vaccinatorFormData.isSputnik) ||
      vaccinatorFormData.dose === 2
    ) {
      return;
    }
    if (vaccinatorFormData.isCovaxin) {
      const button = await waitForNode(() => document.querySelector("input[id='c4']"));
      console.log('Covaxin selected');
      button.click();
    }
    if (vaccinatorFormData.isCovishield) {
      const button = await waitForNode(() => document.querySelector("input[id='c3']"));
      console.log('Covishield selected');
      button.click();
    }
    if (vaccinatorFormData.isSputnik) {
      const button = await waitForNode(() => document.querySelector("input[id='c5']"));
      console.log('Sputnik selected');
      button.click();
    }
  }

  async function selectFreeOrPaid() {
    if (vaccinatorFormData.isFreeOnly) {
      const freeButton = await waitForNode(() => document.querySelector("input[id='c7']"));
      console.log('applied free filter');
      freeButton.click();
    }
  }

  async function apply18plus() {
    const button = await waitForNode(() => document.querySelector("input[id='c1']"));
    console.log('applied 18plus filter');
    button.click();
  }

  async function apply1844() {
    const button = await waitForNode(() => document.querySelector("input[id='ca1']"));
    console.log('applied 18 - 44 filter');
    button.click();
  }

  async function apply45plus() {
    const button = await waitForNode(() => document.querySelector("input[id='c2']"));
    console.log('applied 45plus filter');
    button.click();
  }

  async function book() {
    const timeSlots = await waitForNode(() => document.querySelectorAll('ion-button.time-slot'));
    if (!timeSlots.length) return;
    timeSlots[Math.floor(timeSlots.length / 2)].click();
    if (vaccinatorFormData.autoBook) {
      console.log('book clicked');
      const bookButton = await waitForNode(() => document.querySelector("ion-button.confirm-btn[type='submit']"));
      bookButton.click();
    } else {
      addPrimaryContainer('yellow', `Click on the 'CONFIRM' button to book your slot!!`);
    }
  }

  function selectSlot(slot, allLocations) {
    if (vaccinatorFormData.autoSelect) {
      slot.node.click();
      book();
    }
    showNotification(
      'CoWIN: Vaccinator 💉 Slots Available',
      `Available at ${slot.name} + ${allLocations.length - 1} other locations`
    );
  }

  async function filterSlots() {
    if (window.location.pathname === '/') {
      window.location.reload();
      return;
    }

    if (vaccinatorFormData.rateLimit && remainingSearch <= 0) {
      console.log('Search Quota Over');
      const remainingTime =
        maximumSearchInterval - (new Date().getTime() - vaccinatorFormData.searchTimeStamp[0]) + 11000; // 11 seconds buffer because cron runs every 10 secs
      const remainingMin = Math.ceil(remainingTime / 60000);
      if (vaccinatorFormData.start) {
        addPrimaryContainer('darkcyan', `Rate limit: Bot paused for ${remainingMin} mins`);
      }
      setTimeout(filterSlots, vaccinatorFormData.retryInterval * 1000);
      return;
    }
    if (vaccinatorFormData.start) {
      addPrimaryContainer('green', 'Bot Running...');
    }
    console.log('filterSlots');
    const searchButton = await waitForNode(() => document.getElementsByTagName('ion-button')[0]);
    searchButton.click();
    searchButton.innerText = `Search (${remainingSearch - 1} left)`;
    reduceSearchQuota();

    const shouldProceed = await new Promise((resolve) => {
      setTimeout(() => {
        if (document.querySelector('.error-text')) {
          locationDetails();
          resolve(false);
        } else {
          resolve(true);
        }
      }, 500);
    });

    if (!shouldProceed) return;

    const table = await waitForNode(() => document.getElementsByTagName('mat-selection-list')[0]);
    console.log('response Received');
    if (vaccinatorFormData.eighteenPlusOnly) {
      await apply1844();
    } else {
      await apply45plus();
    }
    await apply18plus();
    await selectVaccineType();

    await selectFreeOrPaid();

    setTimeout(() => {
      searchButton.scrollIntoView();
      console.log('response filter');
      let slot = {};
      const allSlotLocations = [];
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
          const slotLocation = row.querySelector('.center-name-title').textContent;
          allSlotLocations.push(slotLocation);
          [...availableSlots].forEach((node) => {
            const slotCount = +(node.textContent || '').trim().split(' ')[0];
            if (slotCount > (slot.count || 0)) {
              slot = {
                name: slotLocation,
                node,
                count: slotCount,
              };
            }
          });
        }
      });

      if (slot.count) {
        selectSlot(slot, allSlotLocations);
        return;
      }
      setTimeout(() => {
        console.log('searching again');
        if (window.location.pathname === '/') {
          window.location.reload();
          return;
        }
        if (vaccinatorFormData.start) {
          if ((vaccinatorFormData.pin || '').trim()) {
            searchByPin();
          } else {
            filterSlots();
          }
        }
      }, vaccinatorFormData.retryInterval * 1000);
    }, 100);
  }

  function scheduleLogout() {
    const logoutTimer = 14.5 * 60000; // logout brfore 15 mins
    logoutTimeout = setTimeout(() => {
      waitForNode(() => document.getElementsByClassName('navigation logout-text')[0]).then((logoutButton) => {
        if (logoutTimeout === null || logoutTimeout === undefined) return;
        console.log('logout');
        logoutButton.click();
        setTimeout(window.location.reload, 100);
      });
    }, logoutTimer);
  }

  function showNotification(title, message) {
    if (Notification.mock) return;
    console.log('Trigger Notification');
    const icon = 'image-url';
    const body = message;
    const notification = new Notification(title, { body, icon });
    notification.onclick = () => {
      notification.close();
      window.parent.focus();
      clearTitleFlash();
    };

    startTitleFlash(title);
    if (!window.Audio) return;
    const audio = new Audio('https://raw.githubusercontent.com/ashish-r/cowin-vaccinator/main/src/alert.mp3');
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

  function addPrimaryContainer(background, message) {
    const currentMainContainer = document.getElementById('cowin-vaccinator-main-container');
    if (currentMainContainer) currentMainContainer.remove();
    const container = document.createElement('div');
    container.setAttribute(
      'style',
      `background: ${background}; position: absolute; padding: 15px; text-align: center; cursor: pointer; border-radius: 30px; color: ${
        background === 'yellow' ? 'black' : 'white'
      }; font-weight: 800;`
    );
    container.setAttribute('id', 'cowin-vaccinator-main-container');
    container.appendChild(document.createTextNode('CoWIN: Vaccinator 💉'));
    const messageContainer = document.createElement('div');
    messageContainer.setAttribute('style', 'font-size: 15px; padding-top: 5px;');
    messageContainer.appendChild(document.createTextNode(message));
    messageContainer.setAttribute('id', 'cowin-vaccinator-main-message');
    container.appendChild(messageContainer);
    container.addEventListener('click', () => displayForm());
    document.body.appendChild(container);
  }

  function displayForm(withError) {
    console.log(`Open Form. IsError: ${withError}`);

    const createLabel = (labelText, id, containerEl) => {
      const label = document.createElement('label');
      label.htmlFor = id;
      label.appendChild(document.createTextNode(labelText));
      label.setAttribute('style', `padding-right: 10px;`);
      containerEl.appendChild(label);
      return label;
    };
    const createCheckbox = (id, value, labelText, containerEl, onChange) => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = id;
      checkbox.checked = value;
      checkbox.id = id;
      createLabel(labelText, id, containerEl);

      checkbox.addEventListener('change', (e) => {
        onChange(e.target.checked);
      });
      containerEl.appendChild(checkbox);
      return checkbox;
    };

    const createInputField = (id, value, placeholder, containerEl, onChange) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('name', id);
      input.setAttribute('id', id);
      input.setAttribute('placeholder', placeholder);
      input.setAttribute('style', 'width: 70%; background: white;');
      input.setAttribute('value', value);
      input.addEventListener('change', (e) => {
        onChange(e.target.value);
      });
      containerEl.appendChild(input);
      return input;
    };

    const createSelectOption = (selectItem, data, placeholder) => {
      [...selectItem.getElementsByTagName('option')].forEach((node) => node.remove());

      if (placeholder) {
        const placeholderOption = document.createElement('option');
        placeholderOption.value = -1;
        placeholderOption.text = placeholder;
        placeholderOption.selected = true;
        selectItem.appendChild(placeholderOption);
      }

      //Create and append the options
      data.forEach((val) => {
        const option = document.createElement('option');
        option.value = val;
        option.text = val;
        selectItem.appendChild(option);
      });
    };

    const createSelect = (id, placeholder, data, containerEl, callback) => {
      const selectList = document.createElement('select');
      selectList.setAttribute('style', 'width: 40%; background: white; margin-right: 10px;');
      selectList.id = id;
      createSelectOption(selectList, data, placeholder);
      selectList.addEventListener('change', () => {
        callback(selectList.value);
      });

      containerEl.appendChild(selectList);
      return selectList;
    };

    const currentFormContainer = document.getElementById('cowin-vaccinator-form-container');
    if (currentFormContainer) currentFormContainer.remove();
    const container = document.createElement('div');
    container.setAttribute(
      'style',
      `background: white; position: absolute; padding: 15px; text-align: center; color: black; border: 1px dashed black; font-size: 20px; font-weight: normal; line-height: 1.5; max-height: 100%; overflow: scroll;`
    );
    container.setAttribute('id', 'cowin-vaccinator-form-container');

    const hr = document.createElement('hr');
    hr.setAttribute('style', `margin: 5px 0 5px; border-width: 0;`);

    const button = document.createElement('button');
    button.setAttribute(
      'style',
      'font-weight: 700; border-radius: 20px; padding: 10px 15px; font-size: inherit; line-height: inherit;'
    );

    const header = document.createElement('h4');
    header.appendChild(document.createTextNode('CoWIN: Vaccinator 💉 • Fill in your details'));
    header.setAttribute('style', 'font-size: 30px; padding-bottom: 10px;');

    container.appendChild(header);
    container.appendChild(hr.cloneNode());

    createInputField(
      'vaccinator-mobileNumber',
      vaccinatorFormData.mobileNo || '',
      '10 Digit Mobile No',
      container,
      (value) => setVaccinatorFormData('mobileNo', (value || '').trim())
    );

    container.appendChild(hr.cloneNode());
    container.appendChild(document.createTextNode(' '));
    container.appendChild(hr.cloneNode());

    createInputField(
      'vaccinator-pinCodes',
      vaccinatorFormData.pin || '',
      'Enter comma(,) separated pincodes',
      container,
      (value) => {
        const filteredValue = (value || '')
          .split(',')
          .map((pinValue) => pinValue.trim())
          .filter(Boolean)
          .join(',');
        setVaccinatorFormData('pin', filteredValue);
        if (filteredValue) {
          document.getElementById('vaccinator-state-select').setAttribute('disabled', true);
          document.getElementById('vaccinator-district-select').setAttribute('disabled', true);
        } else {
          document.getElementById('vaccinator-state-select').removeAttribute('disabled');
          document.getElementById('vaccinator-district-select').removeAttribute('disabled');
        }
      }
    );
    container.appendChild(hr.cloneNode());
    container.appendChild(document.createTextNode('- OR -'));
    container.appendChild(hr.cloneNode());
    createSelect('vaccinator-state-select', 'Select State', Object.keys(stateData).sort(), container, (value) => {
      if (value !== '-1') {
        setVaccinatorFormData('state', value);
        setVaccinatorFormData('district', '');
        createSelectOption(
          document.getElementById('vaccinator-district-select'),
          stateDistrictData[stateData[value]].districts.map((districtInfo) => districtInfo.district_name),
          'Select District'
        );
        document.getElementById('vaccinator-pinCodes').setAttribute('disabled', true);
      } else {
        setVaccinatorFormData('state', '');
        setVaccinatorFormData('district', '');
        createSelectOption(document.getElementById('vaccinator-district-select'), [], 'Select District');
        document.getElementById('vaccinator-pinCodes').removeAttribute('disabled');
      }
    });

    createSelect('vaccinator-district-select', 'Select District', [], container, (value) => {
      if (value !== '-1') {
        setVaccinatorFormData('district', value);
      } else {
        setVaccinatorFormData('district', '');
      }
    });

    container.appendChild(hr.cloneNode());

    setTimeout(() => {
      if ((vaccinatorFormData.pin || '').trim()) {
        document.getElementById('vaccinator-state-select').setAttribute('disabled', true);
        document.getElementById('vaccinator-district-select').setAttribute('disabled', true);
      } else {
        if (vaccinatorFormData.state) {
          document.getElementById('vaccinator-pinCodes').setAttribute('disabled', true);
          document.getElementById('vaccinator-state-select').value = vaccinatorFormData.state;
          createSelectOption(
            document.getElementById('vaccinator-district-select'),
            stateDistrictData[stateData[vaccinatorFormData.state]].districts.map(
              (districtInfo) => districtInfo.district_name
            ),
            'Select District'
          );
        }
        if (vaccinatorFormData.district) {
          setTimeout(() => {
            document.getElementById('vaccinator-district-select').value = vaccinatorFormData.district;
          }, 100);
        }
      }
    }, 100);

    createLabel('Member Number On Dashboard:', 'vaccinator-member-number', container);

    createSelect(
      'vaccinator-member-number',
      null,
      Array(20)
        .fill()
        .map((_, i) => i + 1),
      container,
      (value) => {
        setVaccinatorFormData('memberNumber', +value);
      }
    );

    setTimeout(() => {
      document.getElementById('vaccinator-member-number').value = vaccinatorFormData.memberNumber;
    }, 100);

    container.appendChild(hr.cloneNode());

    createLabel('Dose:', 'vaccinator-dose', container);

    createSelect(
      'vaccinator-dose',
      null,
      Array(2)
        .fill()
        .map((_, i) => i + 1),
      container,
      (value) => {
        const doseNumber = +value;
        setVaccinatorFormData('dose', doseNumber);
        const isFirstDose = doseNumber !== 2;
        setVaccinatorFormData('isCovishield', isFirstDose);
        setVaccinatorFormData('isCovaxin', isFirstDose);
        setVaccinatorFormData('isSputnik', isFirstDose);
        displayForm(withError);
      }
    );

    setTimeout(() => {
      document.getElementById('vaccinator-dose').value = vaccinatorFormData.dose;
    }, 100);

    container.appendChild(hr.cloneNode());

    createCheckbox(
      'vaccinator-eighteenPlusOnly-checkbox',
      vaccinatorFormData.eighteenPlusOnly,
      'Age Group (18 - 44): ',
      container,
      (value) => {
        setVaccinatorFormData('eighteenPlusOnly', value);
      }
    );

    if (vaccinatorFormData.dose !== 2) {
      container.appendChild(hr.cloneNode());

      createCheckbox(
        'vaccinator-isCovishield-checkbox',
        vaccinatorFormData.isCovishield,
        'Covishield:',
        container,
        (value) => {
          setVaccinatorFormData('isCovishield', value);
        }
      );

      container.appendChild(hr.cloneNode());

      createCheckbox('vaccinator-isCovaxin-checkbox', vaccinatorFormData.isCovaxin, 'Covaxin:', container, (value) => {
        setVaccinatorFormData('isCovaxin', value);
      });

      container.appendChild(hr.cloneNode());

      createCheckbox(
        'vaccinator-isSputnik-checkbox',
        vaccinatorFormData.isSputnik,
        'Sputnik V:',
        container,
        (value) => {
          setVaccinatorFormData('isSputnik', value);
        }
      );
    }

    container.appendChild(hr.cloneNode());

    createCheckbox(
      'vacinator-isFreeOnly-checkbox',
      vaccinatorFormData.isFreeOnly,
      'Only Free Vaccines:',
      container,
      (value) => {
        setVaccinatorFormData('isFreeOnly', value);
      }
    );

    container.appendChild(hr.cloneNode());

    createCheckbox(
      'vacinator-autoselect-checkbox',
      !vaccinatorFormData.autoSelect,
      'Let Me Choose The Vaccination Center:',
      container,
      (value) => {
        const allowAutoSelect = !value;
        setVaccinatorFormData('autoSelect', allowAutoSelect);
        setVaccinatorFormData('autoBook', allowAutoSelect);
        displayForm(withError);
      }
    );

    if (vaccinatorFormData.autoSelect) {
      container.appendChild(hr.cloneNode());

      createCheckbox(
        'vacinator-autobook-checkbox',
        vaccinatorFormData.autoBook,
        'Autobook (Bot will automatically book an available slot):',
        container,
        (value) => {
          setVaccinatorFormData('autoBook', value);
        }
      );
    }

    container.appendChild(hr.cloneNode());
    createLabel(
      `Retry Interval (${maximumSearch} searches within ${maximumSearchIntervalLimit} mins allowed):`,
      'vaccinator-retryinterval',
      container
    );
    const searchIntervalInput = createInputField(
      'vaccinator-retryinterval',
      vaccinatorFormData.retryInterval,
      'seconds',
      container,
      (value) => setVaccinatorFormData('retryInterval', +(value || '').trim() || defaultRetryInterval)
    );
    searchIntervalInput.style.width = '90px';

    container.appendChild(hr.cloneNode());
    createCheckbox(
      'vacinator-ratelimit-checkbox',
      vaccinatorFormData.rateLimit,
      `Rate Limit (Pause bot if ${maximumSearch} searches reached before ${maximumSearchIntervalLimit} mins):`,
      container,
      (value) => {
        setVaccinatorFormData('rateLimit', value);
      }
    );

    if (withError) {
      container.appendChild(hr.cloneNode());
      const error = document.createElement('div');
      error.appendChild(
        document.createTextNode(
          `Fill all mandatory fields: ${!vaccinatorFormData.mobileNo ? 'Mobile Number' : ''}${
            !(vaccinatorFormData.pin || (vaccinatorFormData.state && vaccinatorFormData.district))
              ? `${!vaccinatorFormData.mobileNo ? ', ' : ''}Pin code / State & District`
              : ''
          }`
        )
      );
      error.setAttribute('style', 'color: red;');
      container.appendChild(error);
    }

    container.appendChild(hr.cloneNode());
    container.appendChild(document.createTextNode(' '));
    container.appendChild(hr.cloneNode());

    const submitButton = button.cloneNode();
    submitButton.appendChild(document.createTextNode(vaccinatorFormData.start ? 'Stop Bot' : 'Book my vaccine'));
    submitButton.addEventListener('click', () => {
      if (
        !(
          vaccinatorFormData.mobileNo &&
          (vaccinatorFormData.pin || (vaccinatorFormData.state && vaccinatorFormData.district))
        )
      ) {
        console.log('fill mandatory data', vaccinatorFormData);
        displayForm(true);
      } else {
        console.log('Script Will Run: ', vaccinatorFormData);
        setVaccinatorFormData('start', !vaccinatorFormData.start);
        if (vaccinatorFormData.start) {
          scheduleEvent();
          addPrimaryContainer('green', 'Bot Running...');
        } else {
          addPrimaryContainer('red', 'Start Bot');
        }
      }
      container.remove();
    });
    container.appendChild(submitButton);

    const cancelButton = button.cloneNode();
    cancelButton.style.marginLeft = '50px';
    cancelButton.appendChild(document.createTextNode('Close'));
    cancelButton.addEventListener('click', () => {
      console.log('Hide form');
      container.remove();
    });
    container.appendChild(cancelButton);

    document.body.appendChild(container);
  }

  function setVaccinatorFormData(key, value) {
    vaccinatorFormData[key] = value;
    saveData();
    console.log(`CoWIN: Vaccinator 💉 ${key}: `, value);
  }

  function saveData() {
    if (window.chrome && window.chrome.storage.sync.set) {
      window.chrome.storage.sync.set({ cowinVaccinatorData: JSON.stringify(vaccinatorFormData) });
    } else if (window.localStorage && window.localStorage.setItem) {
      window.localStorage.setItem('cowinVaccinatorData', JSON.stringify(vaccinatorFormData));
    }
  }

  function getData() {
    return new Promise((resolve) => {
      let data = '{}';
      if (window.chrome && window.chrome.storage.sync.set) {
        window.chrome.storage.sync.get('cowinVaccinatorData', (chromeStoragedata) => {
          resolve(JSON.parse(chromeStoragedata.cowinVaccinatorData || data));
        });
        return;
      } else if (window.localStorage && window.localStorage.getItem) {
        data = window.localStorage.getItem('cowinVaccinatorData') || data;
      }
      resolve(JSON.parse(data));
    });
  }

  function reduceSearchQuota() {
    setVaccinatorFormData('searchTimeStamp', vaccinatorFormData.searchTimeStamp.concat(new Date().getTime()));
    if (remainingSearch) {
      remainingSearch -= 1;
    }
  }

  function searchQuotaCron() {
    const currentTimeStamp = new Date().getTime();
    const searchaTimeStamp = vaccinatorFormData.searchTimeStamp.filter(
      (timestamp) => currentTimeStamp - timestamp < maximumSearchInterval
    );
    remainingSearch = maximumSearch - searchaTimeStamp.length;
    setVaccinatorFormData('searchTimeStamp', searchaTimeStamp);
    setTimeout(searchQuotaCron, 10000);
  }
})();
