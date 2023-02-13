'use strict';

const dayjs = require(`dayjs`);
const customParseFormat = require(`dayjs/plugin/customParseFormat`);
const {DatePattern} = require(`../constants`);
const {getRandomInt} = require(`./common`);
dayjs.extend(customParseFormat);

const pickRandomDate = (dayOffset) => {
  if (dayOffset === 0) {
    throw new Error(`Сдвиг в днях не может быть нулевым`);
  }

  const randomDayOffset = dayOffset > 0
    ? getRandomInt(0, dayOffset)
    : getRandomInt(dayOffset, 0);

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + randomDayOffset);
  currentDate.setHours(getRandomInt(0, 23));
  currentDate.setMinutes(getRandomInt(0, 59));
  currentDate.setSeconds(getRandomInt(0, 59));

  return new Date(currentDate);
};

const humanizeDate = (date) => {
  if (!(date instanceof Date)) {
    throw new Error(`${date} не является объектом даты`);
  }

  return dayjs(date).format(DatePattern.DEFAULT);
};

const parseDate = (stringDate, formatFinal, formatOriginal = DatePattern.DEFAULT) => {

  const date = dayjs(stringDate, formatOriginal);
  return dayjs(date).format(formatFinal);
};

module.exports = {
  pickRandomDate,
  humanizeDate,
  parseDate,
};
