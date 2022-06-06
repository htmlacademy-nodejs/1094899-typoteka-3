'use strict';

const dayjs = require(`dayjs`);

module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

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

  return dayjs(date).format(`YYYY-MM-DD HH:mm:ss`);
};
