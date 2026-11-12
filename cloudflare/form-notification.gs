/** @OnlyCurrentDoc */

function sendFormResponseEmail(event) {
  const response = event.response;
  const answers = new Map(response.getItemResponses().map(answer => [
    answer.getItem().getTitle(),
    String(answer.getResponse()).trim(),
  ]));
  const eventId = answers.get("Event ID") || "";
  const correction = answers.get("Correction") || "";
  const email = answers.get("Email address") || "";
  const hasEventId = /^\d{5}$/.test(eventId);
  const eventLabel = hasEventId ? `event ${eventId}` : "an event";
  const eventLink = hasEventId
    ? `https://renaissancemapping.org/?eventid=${eventId}`
    : eventId;
  const projectInbox = "renmusicmap@gmail.com";

  MailApp.sendEmail({
    to: ["jrodin@stanford.edu", projectInbox, "zazulia@berkeley.edu"].join(","),
    subject: `[Mapping the Musical Renaissance] Correction for ${eventLabel}`,
    body: [
      "Event:",
      eventLink,
      "",
      "Correction:",
      correction,
      "",
      "Reply email:",
      email,
      "",
      `Submitted: ${response.getTimestamp().toISOString()}`,
    ].join("\n"),
    replyTo: /^[^\s@,<>]+@[^\s@,<>]+\.[^\s@,<>]+$/.test(email) ? email : projectInbox,
    name: "Mapping the Musical Renaissance",
  });
}
