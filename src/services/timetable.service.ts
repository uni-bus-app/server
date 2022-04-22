import dayjs, { Dayjs } from 'dayjs';
import db from '../db';
import { Time } from '../types';

const getServiceUpdates = async () => {
  const messages = await db.getMessages();
  return { messages, inService: false };
};

const getCurrentTime = (date?: string): Dayjs => {
  if (date) {
    return dayjs(date);
  } else {
    return dayjs();
  }
};

const getServiceTime = (scheduled: string, currentTime: Dayjs): string => {
  try {
    return currentTime
      .set('millisecond', 0)
      .set('second', 0)
      .set('hour', Number(scheduled.substring(0, 2)))
      .set('minute', Number(scheduled.substring(2, 4)))
      .toISOString();
  } catch (error) {
    console.log(scheduled, 1, currentTime);
  }
};

const formatTimes = (times: any[], currentTime: Dayjs): Time[] => {
  const result: Time[] = [];
  times.forEach((item) => {
    if (item.scheduled === '....') {
      return;
    }
    const scheduledDeparture = getServiceTime(item.scheduled, currentTime);
    result.push({ ...item, scheduledDeparture });
  });
  return result;
};

const getRolloverTimes = async (
  stopID: string,
  currentTime: Dayjs
): Promise<any[]> => {
  const res = await db.getTimes(stopID, currentTime.day() + 1, true);
  return formatTimes(res, currentTime.add(1, 'day'));
};

const getTimes1 = async (
  stopID: string,
  currentTime: Dayjs
): Promise<Time[]> => {
  const times = formatTimes(
    await db.getTimes(stopID, currentTime.day()),
    currentTime
  ).filter((item) => dayjs(item.scheduledDeparture).isAfter(currentTime));
  const rolloverTimes = await getRolloverTimes(stopID, currentTime);
  return [...times, ...rolloverTimes];
};

const getTimes = async (stopID: string, date?: string): Promise<Time[]> => {
  const currentTime = getCurrentTime(date);
  const times = await getTimes1(stopID, currentTime);
  if (!times.length) {
    const res = await getTimes1(
      stopID,
      currentTime.add(
        currentTime.day() === 5 ? 3 : currentTime.day() === 6 ? 2 : 1,
        'day'
      )
    );
    if (!res.length) {
      return await db.getTimesOld(stopID);
    }
    return res;
  } else {
    return times;
  }
};

export default { getServiceUpdates, getTimes };
