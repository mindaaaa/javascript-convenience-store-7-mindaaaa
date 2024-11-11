import { DateTimes } from '@woowacourse/mission-utils';

class DateRange {
  constructor(start, end) {
    this.start = null;
    if (start) {
      this.start = new Date(start);
    }

    this.end = null;
    if (end) {
      this.end = this.#adjustEndOfDay(new Date(end));
    }
  }

  #adjustEndOfDay(date) {
    date.setHours(23, 59, 59, 999);
    return date;
  }

  isExpired() {
    const now = DateTimes.now();
    return this.start && (now < this.start || now > this.end);
  }

  isValid() {
    return Boolean(this.start && this.end && this.start <= this.end);
  }
}

export default DateRange;
