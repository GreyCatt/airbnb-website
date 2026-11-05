const calendarMonths = document.querySelector('#calendar-months');
const calendarStatus = document.querySelector('#calendar-status');
const previousMonth = document.querySelector('#previous-month');
const nextMonth = document.querySelector('#next-month');
const calendarSelection = document.querySelector('#calendar-selection');
const bookingLink = document.querySelector('#calendar-booking-link');
const calendarFallback = document.querySelector('#calendar-fallback');
const listingUrl = 'https://www.airbnb.com/rooms/688787149501313080?source_impression_id=p3_1793886192_P3ub8Sx2WxIDhYxS';
const today = new Date();
const firstMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const todayIso = isoDay(today.getFullYear(), today.getMonth(), today.getDate());
let monthOffset = 0;
let unavailable = [];
let checkIn = null;
let checkOut = null;

function isoDay(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function isBlocked(day) {
  return unavailable.some(({ start, endExclusive }) => day >= start && day < endExclusive);
}

function hasBlockedNight(start, end) {
  return unavailable.some(({ start: blockedStart, endExclusive }) => blockedStart < end && endExclusive > start);
}

function formatDay(value) {
  return new Intl.DateTimeFormat('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })
    .format(new Date(`${value}T12:00:00`));
}

function updateSelection() {
  const url = new URL(listingUrl);
  if (checkIn && checkOut) {
    url.searchParams.set('check_in', checkIn);
    url.searchParams.set('check_out', checkOut);
    calendarSelection.textContent = `${formatDay(checkIn)} to ${formatDay(checkOut)} selected. Continue to Airbnb to confirm availability and book.`;
  } else if (checkIn) {
    calendarSelection.textContent = `Check-in: ${formatDay(checkIn)}. Now choose a check-out date.`;
  } else {
    calendarSelection.textContent = 'Choose a check-in date, then a check-out date. Tap a selected date again to clear it.';
  }
  bookingLink.href = url.toString();
  calendarFallback.hidden = !(checkIn && checkOut);
  renderCalendar();
}

function selectDay(value) {
  if (value === checkIn) {
    checkIn = null;
    checkOut = null;
  } else if (value === checkOut) {
    checkOut = null;
  } else if (!checkIn || checkOut || value < checkIn) {
    checkIn = value;
    checkOut = null;
  } else if (hasBlockedNight(checkIn, value)) {
    calendarSelection.textContent = 'Those dates include a blocked night. Choose a different check-out date.';
    return;
  } else {
    checkOut = value;
  }
  updateSelection();
}

function renderMonth(offset) {
  const date = new Date(firstMonth.getFullYear(), firstMonth.getMonth() + offset, 1);
  const year = date.getFullYear();
  const month = date.getMonth();
  const monthName = new Intl.DateTimeFormat('en-MY', { month: 'long', year: 'numeric' }).format(date);
  const panel = document.createElement('section');
  panel.className = 'calendar-month';
  const heading = document.createElement('h3');
  heading.textContent = monthName;
  panel.append(heading);

  const grid = document.createElement('div');
  grid.className = 'calendar-days';
  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach((label) => {
    const weekday = document.createElement('span');
    weekday.className = 'calendar-weekday';
    weekday.textContent = label;
    grid.append(weekday);
  });

  const leading = (date.getDay() + 6) % 7;
  for (let i = 0; i < leading; i += 1) {
    const spacer = document.createElement('span');
    spacer.setAttribute('aria-hidden', 'true');
    grid.append(spacer);
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day += 1) {
    const cell = document.createElement('button');
    const value = isoDay(year, month, day);
    const blocked = isBlocked(value);
    cell.type = 'button';
    cell.textContent = String(day);
    cell.className = 'calendar-day';
    if (blocked) cell.classList.add('blocked');
    if (value < todayIso) cell.classList.add('past');
    if (checkIn && checkOut && value > checkIn && value < checkOut) cell.classList.add('in-range');
    if (value === checkIn || value === checkOut) cell.classList.add('selected');
    cell.disabled = blocked || value < todayIso;
    cell.setAttribute('aria-pressed', String(value === checkIn || value === checkOut));
    cell.setAttribute('aria-label', `${monthName} ${day}: ${blocked ? 'blocked on Airbnb' : value < todayIso ? 'past date' : value === checkIn ? 'selected check-in, click to clear' : value === checkOut ? 'selected check-out, click to clear' : 'select date'}`);
    cell.addEventListener('click', (event) => {
      if (event.detail > 1) return;
      selectDay(value);
    });
    grid.append(cell);
  }
  panel.append(grid);
  return panel;
}

function renderCalendar() {
  calendarMonths.replaceChildren(renderMonth(monthOffset), renderMonth(monthOffset + 1));
  previousMonth.disabled = monthOffset === 0;
  nextMonth.disabled = monthOffset >= 10;
}

previousMonth.addEventListener('click', () => {
  monthOffset = Math.max(0, monthOffset - 2);
  renderCalendar();
});
nextMonth.addEventListener('click', () => {
  monthOffset = Math.min(10, monthOffset + 2);
  renderCalendar();
});

async function loadCalendar() {
  try {
    const response = await fetch(`/api/calendar`);
    if (!response.ok) throw new Error('Calendar unavailable');
    const data = await response.json();
    if (!Array.isArray(data.unavailable)) throw new Error('Calendar data invalid');
    unavailable = data.unavailable;
    calendarStatus.textContent = data.stale
      ? 'Calendar updates are taking longer than usual. Please confirm dates on Airbnb.'
      : 'Shaded dates are blocked on Airbnb.';
    renderCalendar();
  } catch {
    calendarStatus.textContent = 'We can’t show the calendar right now. You can check dates on Airbnb.';
    calendarSelection.textContent = 'Please choose your dates on Airbnb.';
    calendarMonths.replaceChildren();
    previousMonth.disabled = true;
    nextMonth.disabled = true;
  }
}

loadCalendar();
