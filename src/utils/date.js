'use strict';

const dayjs = require(`dayjs`);
const customParseFormat = require(`dayjs/plugin/customParseFormat`);
const {DATE_PATTERN} = require(`../constants`);
dayjs.extend(customParseFormat);

module.exports.pickRandomDate = (dayOffset) => {
  if (dayOffset === 0) {
    throw new Error(`Сдвиг в днях не может быть нулевым`);
  }

  const randomDayOffset = dayOffset > 0
    ? exports.getRandomInt(0, dayOffset)
    : exports.getRandomInt(dayOffset, 0);

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + randomDayOffset);
  currentDate.setHours(exports.getRandomInt(0, 23));
  currentDate.setMinutes(exports.getRandomInt(0, 59));
  currentDate.setSeconds(exports.getRandomInt(0, 59));

  return new Date(currentDate);
};

module.exports.humanizeDate = (date) => {
  if (!(date instanceof Date)) {
    throw new Error(`${date} не является объектом даты`);
  }

  return dayjs(date).format(DATE_PATTERN.default);
};

module.exports.parseDate = (stringDate, formatFinal, formatOriginal = DATE_PATTERN.default) => {

  const date = dayjs(stringDate, formatOriginal);
  return dayjs(date).format(formatFinal);
};