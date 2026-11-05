package com.balineseretreat.airbnbapis;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@RestController
public class CalendarController {
    private static final Duration REFRESH_INTERVAL = Duration.ofMinutes(10);
    private static final DateTimeFormatter ICAL_DATE = DateTimeFormatter.BASIC_ISO_DATE;

    private final String calendarUrl;
    private final HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .followRedirects(HttpClient.Redirect.NEVER)
            .build();
    private CalendarResponse cached;
    private Instant cachedAt;

    public CalendarController(@Value("${airbnb.ical.url:}") String calendarUrl) {
        this.calendarUrl = calendarUrl;
    }

    @GetMapping("/api/calendar")
    public synchronized CalendarResponse calendar() {
        if (calendarUrl.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Calendar is not configured");
        }
        if (cached != null && Duration.between(cachedAt, Instant.now()).compareTo(REFRESH_INTERVAL) < 0) {
            return cached;
        }

        try {
            return fetchAndCache();
        } catch (Exception exception) {
            if (cached != null) {
                return new CalendarResponse(cached.unavailable(), true);
            }
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Calendar is temporarily unavailable");
        }
    }

    @Scheduled(fixedRate = 600_000, initialDelay = 5_000)
    public synchronized void refreshInBackground() {
        if (calendarUrl.isBlank()) return;
        try {
            fetchAndCache();
        } catch (Exception ignored) {
            // Keep the last known dates; the public response marks them as stale when needed.
        }
    }

    private CalendarResponse fetchAndCache() throws Exception {
        URI uri = URI.create(calendarUrl);
        if (!"https".equals(uri.getScheme()) || !"www.airbnb.com".equals(uri.getHost())
                || !uri.getPath().startsWith("/calendar/ical/") || !uri.getPath().endsWith(".ics")) {
            throw new IllegalArgumentException("Invalid calendar URL");
        }
        HttpRequest request = HttpRequest.newBuilder(uri).timeout(Duration.ofSeconds(12)).GET().build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) {
            throw new IllegalStateException("Calendar feed unavailable");
        }
        List<DateRange> unavailable = parseUnavailableDates(response.body());
        cached = new CalendarResponse(unavailable, false);
        cachedAt = Instant.now();
        return cached;
    }

    static List<DateRange> parseUnavailableDates(String ical) {
        if (!ical.contains("BEGIN:VCALENDAR")) {
            throw new IllegalArgumentException("Invalid calendar feed");
        }
        List<DateRange> ranges = new ArrayList<>();
        LocalDate start = null;
        LocalDate end = null;
        boolean inEvent = false;
        for (String rawLine : ical.split("\\r?\\n")) {
            String line = rawLine.trim();
            if (line.equals("BEGIN:VEVENT")) {
                inEvent = true;
                start = null;
                end = null;
            } else if (line.equals("END:VEVENT")) {
                if (inEvent && start != null && end != null && end.isAfter(start)) {
                    ranges.add(new DateRange(start, end));
                }
                inEvent = false;
            } else if (inEvent && line.startsWith("DTSTART;VALUE=DATE:")) {
                start = parseDate(line.substring("DTSTART;VALUE=DATE:".length()));
            } else if (inEvent && line.startsWith("DTEND;VALUE=DATE:")) {
                end = parseDate(line.substring("DTEND;VALUE=DATE:".length()));
            }
        }
        ranges.sort(Comparator.comparing(DateRange::start));
        return List.copyOf(ranges);
    }

    private static LocalDate parseDate(String value) {
        try {
            return LocalDate.parse(value, ICAL_DATE);
        } catch (DateTimeParseException exception) {
            throw new IllegalArgumentException("Invalid date in calendar feed", exception);
        }
    }

    public record DateRange(LocalDate start, LocalDate endExclusive) { }
    public record CalendarResponse(List<DateRange> unavailable, boolean stale) { }
}
