export default () => {
  const mobileNo = 8013904843;

  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }

  function showNotification(centers) {
    const title = 'CoWin: Vaccinator Slots Available';
    const icon = 'image-url';
    const body = centers;
    const notification = new Notification(title, { body, icon });
    notification.onclick = () => {
      notification.close();
      window.parent.focus();
    };
  }

  console.log('vaccinator :', mobileNo);
  const enterMobile = (inputField) => {
    const input = inputField || document.querySelector("input[formcontrolname='mobile_number']");
    if (input?.placeholder?.includes('mobile')) {
      input.value = mobileNo;
      input.dispatchEvent(new KeyboardEvent('input', {}));
      input.blur();
      console.log('mobile number submit');
      document.getElementsByTagName('ion-button')[0].click();
    }
  };

  enterMobile();

  let listInterval;
  const filterSlots = () => {
    console.log('search');
    const searchButton = document.getElementsByTagName('ion-button')[0];
    searchButton.click();
    listInterval = setInterval(() => {
      const table = document.getElementsByTagName('mat-selection-list')?.[0];
      if (table) {
        console.log('response Received');
        clearInterval(listInterval);
        document.querySelector("input[id='c1']").click();
        setTimeout(() => {
          console.log('dom filter');
          const centerNames = [];
          [...table.getElementsByTagName('mat-list-option')].forEach((row) => {
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
          if (!document.getElementsByTagName('mat-list-option').length) {
            setTimeout(() => {
              console.log('re search');
              filterSlots();
            }, 3000);
          } else {
            searchButton.scrollIntoView();
            console.log('Trigger Notification');
            showNotification(centerNames.join(', '));
          }
        }, 100);
      }
    }, 1000);
  };

  const stateSelection = () => {
    console.log('state selected');
    document.querySelector("mat-option[id='mat-option-21']")?.click();
    setTimeout(() => {
      console.log('select district');
      document.querySelector("mat-select[formcontrolname='district_id']")?.click();
      setTimeout(() => {
        console.log('district selected');
        document.querySelector("mat-option[id='mat-option-53']")?.click();
        setTimeout(filterSlots, 100);
      }, 100);
    }, 1500);
  };

  let selectStateInterval;
  const selectState = () => {
    selectStateInterval = setInterval(() => {
      const searchType = document.querySelector("input[formcontrolname='searchType']");
      if (!searchType.checked) {
        searchType.click();
      } else {
        const stateField = document.querySelector("mat-select[formcontrolname='state_id']");
        if (stateField) {
          clearInterval(selectStateInterval);
          console.log('select state');
          stateField.click();
          setTimeout(stateSelection, 100);
        }
      }
    }, 750);
  };

  let scheduleInterval;
  const scheduleClick = () => {
    scheduleInterval = setInterval(() => {
      const scheduleButton =
        !document.getElementsByTagName('ion-spinner').length &&
        document.querySelector("img[src='assets/images/calndericon.svg']");
      if (scheduleButton) {
        console.log('schedule click');
        clearInterval(scheduleInterval);
        scheduleButton.click();

        selectState();
      }
    }, 1000);
  };

  const scheduleEvent = (e) => {
    if (typeof e.target?.querySelector !== 'function') {
      return;
    }
    const otpInput = e.target.querySelector("input[formcontrolname='otp']");
    if (otpInput) {
      document.removeEventListener('DOMNodeInserted', scheduleEvent);
      otpInput.addEventListener('input', () => {
        if (otpInput.value.length === 6) {
          console.log('otp submit');
          document.getElementsByTagName('ion-button')[0].click();
          scheduleClick();
        }
      });
      return;
    }
    const scheduleButton = e.target.querySelector("img[src='assets/images/calndericon.svg']");
    if (scheduleButton) {
      console.log('dashboard loaded');
      document.removeEventListener('DOMNodeInserted', scheduleEvent);
      scheduleClick();
      return;
    }
    const mobileInput = e.target.querySelector("input[formcontrolname='mobile_number']");
    if (mobileInput) {
      console.log('mobileInput');
      enterMobile(mobileInput);
    }
  };
  document.addEventListener('DOMNodeInserted', scheduleEvent, false);
};

const parsed_model = JSON.parse(atob(model || ''));
const parser = new DOMParser();
const svg = parser.parseFromString(
  atob(
    document
      .querySelector('img#captchaImage')
      .getAttribute('src')
      .split('base64,')[1]
  ),
  'image/svg+xml'
);
[...svg.getElementsByTagName('path')].forEach((p) => {
  if (p.getAttribute('stroke') != undefined) p.remove();
});
const vals = [];
[...svg.getElementsByTagName('path')].forEach((p) => {
  vals.push(
    parseInt(
      p
        .getAttribute('d')
        .split('.')[0]
        .replace('M', ''),
      10
    )
  );
});
const sorted = [...vals].sort(function(a, b) {
  return a - b;
});
const solution = ['', '', '', '', ''];

[...svg.getElementsByTagName('path')].forEach((p, idx) => {
  const pattern = p.getAttribute('d').replace(/[\d.\s]/g, '');

  solution[sorted.indexOf(vals[idx])] = parsed_model[pattern];
});