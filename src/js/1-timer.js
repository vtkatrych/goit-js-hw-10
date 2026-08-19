import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const chosenDate = selectedDates[0];
    const currentDate = new Date();

    if (chosenDate <= currentDate) {
      iziToast.show({
        title: 'Error',
        message: 'Please choose a date in the future',
      });

      startBtn.disabled = true;
      userSelectedDate = null;
    } else {
      startBtn.disabled = false;
      userSelectedDate = chosenDate;
      console.log('Обрано валідну дату:', userSelectedDate);
    }

    console.log(selectedDates[0]);
  },
};

const startBtn = document.querySelector('[data-start]');

let userSelectedDate = null;

flatpickr('#datetime-picker', options);

const inputRef = document.querySelector('#datetime-picker');

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  inputRef.disabled = true;
  const timerId = setInterval(() => {
    const deltaTime = userSelectedDate - new Date();

    if (deltaTime <= 0) {
      clearInterval(timerId);

      document.querySelector('[data-days]').textContent = '00';
      document.querySelector('[data-hours]').textContent = '00';
      document.querySelector('[data-minutes]').textContent = '00';
      document.querySelector('[data-seconds]').textContent = '00';

      inputRef.disabled = false;
      startBtn.disabled = true;
      console.log('Таймер зупинено');
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(deltaTime);
    document.querySelector('[data-days]').textContent = addLeadingZero(days);
    document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
    document.querySelector('[data-minutes]').textContent =
      addLeadingZero(minutes);
    document.querySelector('[data-seconds]').textContent =
      addLeadingZero(seconds);
  }, 1000);
});
console.log('Починаємо зворотний відлік до:', userSelectedDate);

startBtn.disabled = true;

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
