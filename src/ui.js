function addPrimaryContainer(background = 'red', message = 'Prefill your data for autobooking!!') {
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
  container.addEventListener('click', () => {
    console.log('Open Form');
  });
  document.body.appendChild(container);
}
