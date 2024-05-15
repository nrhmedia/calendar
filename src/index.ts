import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import rrulePlugin from '@fullcalendar/rrule';
import timeGridPlugin from '@fullcalendar/timegrid';

import { type CalendarEvent, type EventJson, RECURRING_FIELD_VALUE_TO_RRULE } from './types';

// Decoding HTML entities with explicit type
function decodeHtmlEntities(encodedString: string): string {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = encodedString;
  return textArea.value;
}

window.Webflow ||= [];
window.Webflow.push(() => {
  const calendarElement = document.querySelector<HTMLElement>('[data-element="calendar"]');
  if (!calendarElement) {
    console.error('Calendar element not found.');
    return;
  }

  const events = getEvents();
  if (!events.length) {
    console.error('No events found.');
    return;
  }
  console.log('Events:', events); // Log the events to check if URL is included

  const calendar = new Calendar(calendarElement, {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, rrulePlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek',
    },
    events,
    eventClick: (info) => {
      console.log('Event clicked:', info.event); // Log the event object on click
      if (info.event.extendedProps.url) {
        window.location.href = info.event.extendedProps.url;
      } else {
        console.error('Event URL is missing.');
      }
    },
  });

  calendar.render();
});

// Fetching and decoding events with proper typing
const getEvents = (): CalendarEvent[] => {
  const scripts = document.querySelectorAll<HTMLScriptElement>('[data-element="event-data"]');
  if (!scripts.length) {
    console.error('No event data scripts found.');
    return [];
  }

  const events = [...scripts]
    .map((script) => {
      const decodedContent = decodeHtmlEntities(script.textContent || '');
      let eventJson: EventJson;
      try {
        eventJson = JSON.parse(decodedContent);
      } catch (error) {
        console.error('Error parsing event data:', error, script);
        return null;
      }

      const start = new Date(eventJson.start);
      const until = eventJson.recurringUntil ? new Date(eventJson.recurringUntil) : undefined;
      const calendarEvent: CalendarEvent = {
        title: eventJson.title,
        start,
        end: eventJson.end ? new Date(eventJson.end) : undefined,
        rrule: RECURRING_FIELD_VALUE_TO_RRULE[eventJson.recurring](start.toISOString(), until),
        url: eventJson.url, // Include the url field
      };

      return calendarEvent;
    })
    .filter((event) => event !== null);

  return events;
};
