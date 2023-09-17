import { z } from 'zod';

const validDate = z.date();

export const isDateValid = (rawDate: string) => {
  const parseResult = validDate.safeParse(new Date(rawDate));

  return parseResult.success;
};
