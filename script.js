(() => {
  const phone = '923345545146';
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
    }));
  }

  const tripRadios = document.querySelectorAll('input[name="tripType"]');
  const returnField = document.querySelector('#return-date-field');
  const returnInput = document.querySelector('input[name="returnDate"]');
  const departureInput = document.querySelector('input[name="departureDate"]');
  const updateTripType = () => {
    const type = document.querySelector('input[name="tripType"]:checked')?.value || 'Return';
    const isReturn = type === 'Return';
    returnField.hidden = !isReturn;
    returnInput.required = isReturn;
    returnInput.disabled = !isReturn;
    if (!isReturn) returnInput.value = '';
  };
  tripRadios.forEach(radio => radio.addEventListener('change', updateTripType));
  updateTripType();

  const today = new Date();
  const localDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  if (departureInput) departureInput.min = localDate;
  if (returnInput) returnInput.min = localDate;
  departureInput?.addEventListener('change', () => {
    if (departureInput.value) {
      returnInput.min = departureInput.value;
      if (returnInput.value && returnInput.value < departureInput.value) returnInput.value = '';
    }
  });

  const openWhatsApp = message => window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  document.querySelector('#flight-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const type = data.get('tripType');
    const message = [
      'Assalam-o-Alaikum Etimad Air Services, I would like to enquire about a flight.',
      '', `Trip type: ${type}`, `Passenger name: ${data.get('passengerName')}`, `Contact number: ${data.get('passengerPhone')}`,
      `From: ${data.get('origin')}`, `To: ${data.get('destination')}`, `Departure date: ${data.get('departureDate')}`,
      ...(type === 'Return' ? [`Return date: ${data.get('returnDate')}`] : []),
      `Adults: ${data.get('adults')}`, `Children: ${data.get('children')}`,
      ...(String(data.get('flightNotes') || '').trim() ? [`Additional details: ${String(data.get('flightNotes')).trim()}`] : []),
      '', 'Please share available flight options and fare details. Thank you.'
    ].join('\n');
    openWhatsApp(message);
  });

  document.querySelector('#contact-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const message = [
      'Assalam-o-Alaikum Etimad Air Services,', '', 'I have a message / enquiry for your team.',
      `Name: ${data.get('name')}`, `Phone: ${data.get('phone')}`, `Message: ${data.get('message')}`,
      '', 'Please contact me regarding this enquiry. Thank you.'
    ].join('\n');
    openWhatsApp(message);
  });

  document.querySelectorAll('.whatsapp-package').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const packageName = link.dataset.package || 'Umrah Servicess';
    openWhatsApp(`Assalam-o-Alaikum Etimad Air Services, I would like details about: ${packageName}. Please share current availability and package information. Thank you.`);
  }));
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
