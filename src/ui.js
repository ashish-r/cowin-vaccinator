const container = document.createElement('div');
container.setAttribute(
  'style',
  'background: red; position: absolute; padding: 15px; text-align: center; cursor: pointer; border-radius: 30px; color: white; font-weight: 500;'
);
container.appendChild(document.createTextNode('CoWIN: Vaccinator 💉'));
const messageContainer = document.createElement('div');
messageContainer.setAttribute('style', 'font-size: 15px; padding-top: 5px;');
messageContainer.appendChild(document.createTextNode('Prefill your data for autobooking!!'));
container.appendChild(messageContainer);
document.body.appendChild(container);
