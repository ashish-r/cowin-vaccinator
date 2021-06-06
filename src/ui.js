function addPrimaryContainer(background = 'red', message = 'Fill details annd start script!!') {
  const currentMainContainer = document.getElementById('cowin-vaccinator-main-container');
  if (currentMainContainer) currentMainContainer.remove();
  const container = document.createElement('div');
  container.setAttribute(
    'style',
    `background: ${background}; position: absolute; padding: 15px; text-align: center; cursor: pointer; border-radius: 30px; color: white; font-weight: 500;`
  );
  container.setAttribute('id', 'cowin-vaccinator-main-container');
  container.appendChild(document.createTextNode('CoWIN: Vaccinator 💉'));
  const messageContainer = document.createElement('div');
  messageContainer.setAttribute('style', 'font-size: 15px; padding-top: 5px;');
  messageContainer.appendChild(document.createTextNode(message));
  container.appendChild(messageContainer);
  container.setAttribute('id', 'cowin-vaccinator-main-message');
  container.addEventListener('click', displayForm);
  document.body.appendChild(container);
}

function displayForm() {
  console.log('Open Form');
  const currentFormContainer = document.getElementById('cowin-vaccinator-form-container');
  if (currentFormContainer) currentFormContainer.remove();
  const container = document.createElement('div');
  container.setAttribute(
    'style',
    `background: white; position: absolute; padding: 15px; text-align: center; color: black; border: 1px dashed black;`
  );
  container.setAttribute('id', 'cowin-vaccinator-form-container');

  const hr = document.createElement('hr');
  hr.setAttribute('style', `margin: 5px 0 5px;`);

  const button = document.createElement('button');
  button.setAttribute('style', `padding: 5px 10px; font-weight: 700; border-radius: 20px;`);

  const header = document.createElement('h4');
  header.appendChild(document.createTextNode('CoWIN: Vaccinator 💉 • Fill in your details'));

  container.appendChild(header);
  container.appendChild(hr.cloneNode());

  const mobileInput = document.createElement('input');
  mobileInput.setAttribute('type', 'text');
  mobileInput.setAttribute('name', 'mobileNumber');
  mobileInput.setAttribute('placeholder', '10 Digit Mobile No');
  mobileInput.setAttribute('value', vaccinatorFormData.mobileNo);
  mobileInput.addEventListener('change', (e) => {
    console.log('Mobile Upfate: ', e.target.value);
    setVaccinatorFormData('mobileNo', e.target.value);
  });
  container.appendChild(mobileInput);

  container.appendChild(hr.cloneNode());

  const submitButton = button.cloneNode();
  submitButton.appendChild(
    document.createTextNode(vaccinatorFormData.start ? 'Stop Automated Script' : 'Start Automated Script')
  );
  submitButton.addEventListener('click', () => {
    console.log('Script Will Run: ', !vaccinatorFormData.start);
    setVaccinatorFormData('start', !vaccinatorFormData.start);
    submitButton.innerText = vaccinatorFormData.start ? 'Stop Automated Script' : 'Start Automated Script';
    if (vaccinatorFormData.start) scheduleEvent();
    container.remove();
  });
  container.appendChild(submitButton);

  container.appendChild(hr.cloneNode());

  const cancelButton = button.cloneNode();
  cancelButton.appendChild(document.createTextNode('Close'));
  cancelButton.addEventListener('click', () => {
    console.log('Hide form');
    container.remove();
  });
  container.appendChild(cancelButton);

  document.body.appendChild(container);
}
