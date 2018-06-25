"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
exports.MySQLDateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
exports.MySQLDateFormat = 'YYYY-MM-DD';
exports.DWDateFormat = 'YYYYMMDD';
class DateUtil {
    static toMonthSequence(month) {
        return month.year() * 12 + month.month();
    }
    static getNumMonthsFromMoments(startMoment, endMoment) {
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
    static getFullMonthsFromMoment(startMoment, endMoment) {
        return (endMoment.year() - startMoment.year()) * 12 + (endMoment.month() - startMoment.month() - 1);
    }
    // static ifValid(date: any, orElse: any) {
    //   return (moment(date).isValid()) ? date : orElse;
    // }
    static asYearMonth(date) {
        return date.format('YYYY/MM');
    }
    static fromMySQLDateTime(value) {
        if (!value || (typeof (value) === 'string' && value.length === 0) || value === '0000-00-00 00:00:00') {
            return null;
        }
        return moment(value, exports.MySQLDateTimeFormat);
    }
    static fromMySQLDate(value) {
        if (!value || (typeof (value) === 'string' && value.length === 0) || value === '0000-00-00') {
            return null;
        }
        return moment(value, exports.MySQLDateFormat);
    }
    static fromDWDate(value) {
        if (!value || (typeof (value) === 'string' && value.length === 0) || value === '0000-00-00') {
            return null;
        }
        return moment(value, exports.DWDateFormat);
    }
    static toMySQLDate(value) {
        if (!value) {
            return null;
        }
        return value.format(exports.MySQLDateFormat);
    }
    /**
     * Transforms a moment to format YYYY-MM-DD HH:mm:ss
     * @static
     * @param {moment.Moment} value The moment to convert
     * @returns {string} The moment as a string
     * @memberof DateUtil
     */
    static toMySQLDateTime(value) {
        if (!value) {
            return null;
        }
        return value.format(exports.MySQLDateTimeFormat);
    }
    static toDWDate(value) {
        if (!value) {
            return null;
        }
        return value.format(exports.DWDateFormat);
    }
}
exports.DateUtil = DateUtil;
//# sourceMappingURL=DateUtil.js.map