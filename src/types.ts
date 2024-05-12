import { Frequency, RRule, Weekday } from 'rrule';

type RecurringOption =
  | ''
  | 'Daily'
  | 'Weekly'
  | 'Bi-Weekly'
  | 'Monthly'
  | 'Yearly'
  | 'Every Monday'
  | 'Every Tuesday'
  | 'Every Wednesday'
  | 'Every Thursday'
  | 'Every Friday'
  | 'Every Saturday'
  | 'Every Sunday';

export type EventJson = {
  title: string;
  start: string;
  end: string;
  recurring: RecurringOption;
  recurringUntil: string;
};

type PartialRRule = {
  freq: Frequency;
  dtstart: string;
  until?: Date;
  byweekday?: Weekday | Weekday[];
  interval?: number;
};

export type CalendarEvent = {
  title: string;
  start: Date;
  end?: Date;
  rrule?: PartialRRule;
};

export const RECURRING_FIELD_VALUE_TO_RRULE: Record<
  RecurringOption,
  (dtstart: string, until?: Date) => PartialRRule | undefined
> = {
  '': () => undefined,
  Daily: (dtstart, until) => ({
    freq: RRule.DAILY,
    dtstart,
    until,
  }),
  'Every Sunday': (dtstart, until) => ({
    freq: RRule.WEEKLY,
    dtstart,
    until,
    byweekday: RRule.SU,
  }),
  'Every Monday': (dtstart, until) => ({
    freq: RRule.WEEKLY,
    dtstart,
    until,
    byweekday: RRule.MO,
  }),
  'Every Tuesday': (dtstart, until) => ({
    freq: RRule.WEEKLY,
    dtstart,
    until,
    byweekday: RRule.TU,
  }),
  'Every Wednesday': (dtstart, until) => ({
    freq: RRule.WEEKLY,
    dtstart,
    until,
    byweekday: RRule.WE,
  }),
  'Every Thursday': (dtstart, until) => ({
    freq: RRule.WEEKLY,
    dtstart,
    until,
    byweekday: RRule.TH,
  }),
  'Every Friday': (dtstart, until) => ({
    freq: RRule.WEEKLY,
    dtstart,
    until,
    byweekday: RRule.FR,
  }),
  'Every Saturday': (dtstart, until) => ({
    freq: RRule.WEEKLY,
    dtstart,
    until,
    byweekday: RRule.SA,
  }),
  Weekly: (dtstart, until) => ({
    freq: RRule.WEEKLY,
    dtstart,
    until,
  }),
  'Bi-Weekly': (dtstart, until) => ({
    freq: RRule.WEEKLY,
    interval: 2,
    dtstart,
    until,
  }),
  Monthly: (dtstart, until) => ({
    freq: RRule.MONTHLY,
    dtstart,
    until,
  }),
  Yearly: (dtstart, until) => ({
    freq: RRule.YEARLY,
    dtstart,
    until,
  }),
};
