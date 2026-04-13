/**
 * calendar.js — Interactive Appointment Calendar
 * Agarwal Dental Clinic
 */

'use strict';

const CLINIC_DAYS_OFF = [0]; // 0 = Sunday closed

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM',
  '10:30 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM',
  '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM',
];

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

class AppointmentCalendar {
  constructor(container) {
    this.container    = container;
    this.today        = new Date();
    this.viewDate     = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    this.selectedDate = null;
    this.selectedTime = null;
    this.direction    = 'left'; // for animation

    this.calGrid     = container.querySelector('.cal-grid');
    this.monthLabel  = container.querySelector('.cal-month-year');
    this.prevBtn     = container.querySelector('.cal-prev');
    this.nextBtn     = container.querySelector('.cal-next');
    this.slotsWrap   = container.querySelector('.time-slots');

    this.prevBtn?.addEventListener('click', () => this.changeMonth(-1));
    this.nextBtn?.addEventListener('click', () => this.changeMonth(1));

    this.render();
  }

  changeMonth(dir) {
    this.direction = dir === 1 ? 'left' : 'right';
    this.viewDate.setMonth(this.viewDate.getMonth() + dir);
    this.render();
  }

  render() {
    const y = this.viewDate.getFullYear();
    const m = this.viewDate.getMonth();

    if (this.monthLabel) {
      this.monthLabel.textContent = `${MONTH_NAMES[m]} ${y}`;
    }

    // Build grid
    const grid = this.calGrid;
    if (!grid) return;

    // Clone transition
    const dirClass = this.direction === 'left' ? 'slide-left' : 'slide-right';
    grid.className = 'cal-grid';

    // Clear & rebuild
    grid.innerHTML = '';

    // Day headers
    DAY_LABELS.forEach(d => {
      const cell = document.createElement('div');
      cell.className = 'cal-day-label';
      cell.textContent = d;
      grid.appendChild(cell);
    });

    const firstDay  = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    // Empty cells before month start
    for (let i = 0; i < firstDay; i++) {
      const cell = document.createElement('div');
      cell.className = 'cal-cell empty';
      grid.appendChild(cell);
    }

    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(y, m, d);
      const cell = document.createElement('div');
      cell.className = 'cal-cell';
      cell.textContent = d;

      const isPast    = date < new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
      const isDayOff  = CLINIC_DAYS_OFF.includes(date.getDay());
      const isToday   = date.toDateString() === this.today.toDateString();
      const isSelected = this.selectedDate && date.toDateString() === this.selectedDate.toDateString();

      if (isPast || isDayOff) cell.classList.add('disabled');
      if (isToday)    cell.classList.add('today');
      if (isSelected) cell.classList.add('selected');

      if (!isPast && !isDayOff) {
        cell.addEventListener('click', () => this.selectDate(date, cell));
      }
      grid.appendChild(cell);
    }

    // Animate in
    void grid.offsetWidth; // reflow
    grid.classList.add(dirClass);
  }

  selectDate(date, cell) {
    // Remove previous selection
    this.calGrid?.querySelectorAll('.cal-cell.selected').forEach(c => c.classList.remove('selected'));
    this.selectedDate = date;
    cell.classList.add('selected');

    // Ripple fill on cell
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute; inset:0; border-radius:var(--r-sm);
      background:var(--primary); z-index:-1;
      transform:scale(0); animation: cellRipple 0.35s ease forwards;
    `;
    cell.style.position = 'relative';
    cell.appendChild(ripple);
    setTimeout(() => ripple.remove(), 400);

    this.renderTimeSlots();
    this.updateHiddenFields();
    this.advanceStep(2);
  }

  renderTimeSlots() {
    if (!this.slotsWrap) return;
    this.slotsWrap.innerHTML = '';

    TIME_SLOTS.forEach((t, i) => {
      const slot = document.createElement('div');
      slot.className = 'time-slot';
      slot.setAttribute('role', 'button');
      slot.setAttribute('tabindex', '0');
      slot.innerHTML = `
        ${t}
        <span class="slot-check">
          <svg class="check-svg" viewBox="0 0 20 20">
            <path d="M4 10l5 5 7-8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>`;

      slot.style.animationDelay = `${i * 0.04}s`;
      slot.setAttribute('data-time', t);

      slot.addEventListener('click', () => this.selectTime(t, slot));
      slot.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') this.selectTime(t, slot); });

      this.slotsWrap.appendChild(slot);
    });
  }

  selectTime(time, slot) {
    this.slotsWrap.querySelectorAll('.time-slot.selected').forEach(s => s.classList.remove('selected'));
    this.selectedTime = time;
    slot.classList.add('selected');
    this.updateHiddenFields();
    this.advanceStep(3);
  }

  updateHiddenFields() {
    const dateInput = document.getElementById('selected-date');
    const timeInput = document.getElementById('selected-time');
    if (dateInput && this.selectedDate) {
      dateInput.value = this.selectedDate.toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    }
    if (timeInput && this.selectedTime) {
      timeInput.value = this.selectedTime;
    }
  }

  advanceStep(step) {
    document.querySelectorAll('.step-pill').forEach((pill, i) => {
      pill.classList.toggle('done',   i + 1 < step);
      pill.classList.toggle('active', i + 1 === step);
    });
    if (step === 3) {
      document.querySelector('.patient-form')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  const calContainer = document.querySelector('.calendar-widget');
  if (calContainer) {
    window._cal = new AppointmentCalendar(calContainer);
  }
});
