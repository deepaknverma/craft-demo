import * as moment from 'moment';
export declare const MySQLDateTimeFormat = "YYYY-MM-DD HH:mm:ss";
export declare const MySQLDateFormat = "YYYY-MM-DD";
export declare const DWDateFormat = "YYYYMMDD";
export declare class DateUtil {
    static toMonthSequence(month: moment.Moment): number;
    static getNumMonthsFromMoments(startMoment: moment.Moment, endMoment: moment.Moment): number;
    static getFullMonthsFromMoment(startMoment: moment.Moment, endMoment: moment.Moment): number;
    static asYearMonth(date: moment.Moment): string;
    static fromMySQLDateTime(value: string): moment.Moment;
    static fromMySQLDate(value: string): moment.Moment;
    static fromDWDate(value: string): moment.Moment;
    static toMySQLDate(value: moment.Moment): string;
    /**
     * Transforms a moment to format YYYY-MM-DD HH:mm:ss
     * @static
     * @param {moment.Moment} value The moment to convert
     * @returns {string} The moment as a string
     * @memberof DateUtil
     */
    static toMySQLDateTime(value: moment.Moment): string;
    static toDWDate(value: moment.Moment): string;
}
