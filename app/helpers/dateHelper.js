import moment from 'moment';
import _ from 'lodash';
import { constants as CONST } from '../utils';

const DATE_REGEX = /[0-9]{2}-[0-9]{4}/;

const getMinMax = (dates: []=[]) => {
  const FORMAT = 'DD-MM-YYYY';
  const filtered = dates.sort((a, b) => moment(a, FORMAT) - moment(b, FORMAT));
  return { min: filtered[0], max: filtered[filtered.length - 1] };
};

const getYearOptions = (range: {}={}) => {
  if (!range.min || !range.max) {
    return [];
  }

  const minYear = parseInt(range.min.split('-')[2], 10);
  const maxYear = parseInt(range.max.split('-')[2], 10);
  return _.range(((maxYear - minYear) + 1)).map(y => maxYear - y);
};

const getMonthOptions = (range: {}={}) => {
  if (!range.min || !range.max) {
    return [];
  }
  const monthArray = Object.values(CONST.MONTHS);
  return monthArray;
};

const getDayOptions = (range: {}={}) => {
  if (!range.min || !range.max) {
    return [];
  }
  const dayArray = Object.values(CONST.DAYS);
  return dayArray;
};

const extractDatesFromTableNames = (tables: []=[]) => {
  const result = [];
  tables.map(t => {
    const date = t.split('_')[0];
    if (date.match(DATE_REGEX)) {
      result.push(date);
    }
    return t;
  });
  return result;
};

module.exports = {
  getMinMax,
  getDayOptions,
  getMonthOptions,
  getYearOptions,
  extractDatesFromTableNames
};
