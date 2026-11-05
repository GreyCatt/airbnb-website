package com.balineseretreat.airbnbapis;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CalendarControllerTest {
    @Test
    void parsesOnlyDateRangesAndTreatsEndAsExclusive() {
        String ical = "BEGIN:VCALENDAR\r\n"
                + "BEGIN:VEVENT\r\n"
                + "SUMMARY:Reserved\r\n"
                + "DTSTART;VALUE=DATE:20261107\r\n"
                + "DTEND;VALUE=DATE:20261109\r\n"
                + "END:VEVENT\r\n"
                + "BEGIN:VEVENT\r\n"
                + "DTSTART;VALUE=DATE:20261106\r\n"
                + "DTEND;VALUE=DATE:20261107\r\n"
                + "END:VEVENT\r\n"
                + "END:VCALENDAR\r\n";

        var ranges = CalendarController.parseUnavailableDates(ical);

        assertEquals(2, ranges.size());
        assertEquals(new CalendarController.DateRange(
                LocalDate.of(2026, 11, 6), LocalDate.of(2026, 11, 7)), ranges.get(0));
        assertEquals(new CalendarController.DateRange(
                LocalDate.of(2026, 11, 7), LocalDate.of(2026, 11, 9)), ranges.get(1));
    }
}
