window.AFTERKIN_UI = (() => {
  const root = document.querySelector('#modal-root');
  const background = [...document.querySelectorAll('header, main, footer')];
  let returnFocus = null;
  function closeModal(restoreFocus = true) {
    root.replaceChildren();
    root.onkeydown = null;
    background.forEach(element => { element.inert = false; });
    document.body.classList.remove('dialog-open');
    if (restoreFocus && returnFocus?.isConnected) returnFocus.focus();
    returnFocus = null;
  }
  function openModal(markup, focusSelector = '.close') {
    closeModal(false);
    returnFocus = document.activeElement;
    root.innerHTML = `<div class="modal-shade">${markup}</div>`;
    background.forEach(element => { element.inert = true; });
    document.body.classList.add('dialog-open');
    root.querySelector('.close').onclick = () => closeModal();
    root.querySelector('.modal-shade').onclick = event => {
      if (event.target.classList.contains('modal-shade')) closeModal();
    };
    root.onkeydown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
      }
      if (event.key !== 'Tab') return;
      const controls = [...root.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), [tabindex="0"]'
      )].filter(element => !element.hidden);
      if (!controls.length) return;
      const current = controls.indexOf(document.activeElement);
      const next = (current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
      event.preventDefault();
      controls[next].focus();
    };
    (root.querySelector(focusSelector) || root.querySelector('.close')).focus();
  }
  return { openModal, closeModal };
})();
