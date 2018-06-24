import * as moment from 'moment';

export const MySQLDateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
export const MySQLDateFormat = 'YYYY-MM-DD';
export const DWDateFormat = 'YYYYMMDD';

export class DateUtil {
  static toMonthSequence(month: moment.Moment): number {
    return month.year() * 12 + month.month();
  }

  static getNumMonthsFromMoments(startMoment: moment.Moment, endMoment: moment.Moment): number {
    const fullMonths = DateUtil.getFullMonthsFromMoment(startMoment, endMoment);
    const endDay = endMoment.date();
    const startDay = startMoment.date();
    const calculatedStartDay = startMoment.daysInMonth() - startDay;
    if (startMoment.isSame(endMoment, 'months') && startDay === 1 && endDay === endMoment.daysInMonth()) {
      return 1;
    }
    if ((endDay === 1 || endDay === 2) && startDay === startMoment.daysInMonth()) {
      return fullMonths;
    }
    if (startDay === startMoment.daysInMonth() && endDay === endMoment.daysInMonth()) {
      return fullMonths + 1;
    }
    // Check for rare cases when end date is less than startDate - 1 ( ex. 13 - 4 )
    if (endDay < (startDay - 1)) {
      // We need to returns the smallest integer greater than or equal to a given number
      return fullMonths + Math.ceil((calculatedStartDay + endDay) / 30.44);
    }
    // check the difference in  startday and endday
    if (endDay >= startDay || endDay === (startDay - 1)) {
      return fullMonths + 1;
    }
    // We need to check whether this is a "rounding" error
    return fullMonths;
  }
  // static getFullMonths(startDate: Date, endDate: Date): number {
  //   return DateUtil.getFullMonthsFromMoment(moment(startDate), moment(endDate));
  // }
  static getFullMonthsFromMoment(startMoment: moment.Moment, endMoment: moment.Moment): number {
    return (endMoment.year() - startMoment.year()) * 12 + (endMoment.month() - startMoment.month() - 1);
  }
  // static ifValid(date: any, orElse: any) {
  //   return (moment(date).isValid()) ? date : orElse;
  // }
  static asYearMonth(date: moment.Moment): string {
    return date.format('YYYY/MM');
  }
  static fromMySQLDateTime(value: string): moment.Moment {
    if (!value || (typeof(value) === 'string' && value.length === 0) || value === '0000-00-00 00:00:00') {
      return null;
    }
    return moment(value, MySQLDateTimeFormat);
  }
  static fromMySQLDate(value: string): moment.Moment {
    if (!value || (typeof(value) === 'string' && value.length === 0) || value === '0000-00-00') {
      return null;
    }
    return moment(value, MySQLDateFormat);
  }
  static fromDWDate(value: string): moment.Moment {
    if (!value || (typeof(value) === 'string' && value.length === 0) || value === '0000-00-00') {
      return null;
    }
    return moment(value, DWDateFormat);
  }
  static toMySQLDate(value: moment.Moment): string {
    if (!value) {
      return null;
    }
    return value.format(MySQLDateFormat);
  }
  /**
   * Transforms a moment to format YYYY-MM-DD HH:mm:ss
   * @static
   * @param {moment.Moment} value The moment to convert
   * @returns {string} The moment as a string
   * @memberof DateUtil
   */
  static toMySQLDateTime(value: moment.Moment): string {
    if (!value) {
      return null;
    }
    return value.format(MySQLDateTimeFormat);
  }
  static toDWDate(value: moment.Moment): string {
    if (!value) {
      return null;
    }
    return value.format(DWDateFormat);
  }
}
