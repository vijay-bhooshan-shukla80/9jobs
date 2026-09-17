const australianHour = new Intl.DateTimeFormat("en-AU", {
  timeZone: "Australia/Sydney",
  hour: "numeric",
  hourCycle: "h23",
});

export function getAustralianGreeting(date = new Date()) {
  const hour = Number(australianHour.format(date));
  if (hour >= 5 && hour < 12) return "Good morning!";
  if (hour >= 12 && hour < 17) return "Good afternoon!";
  return "Good evening!";
}
