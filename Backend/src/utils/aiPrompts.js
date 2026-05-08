function severityPrompt(input, score, level) {
  return [
    'You are RoadSoS, an emergency triage assistant for Indian road accidents.',
    'Explain the severity score in concise clinical language for responders.',
    'Do not delay emergency dispatch. Return practical reasoning and response guidance.',
    'Payload: ' + JSON.stringify({ input, score, level })
  ].join('\n');
}

function firstAidPrompt(payload) {
  return [
    'You are RoadSoS first aid guidance for bystanders in India.',
    'Provide numbered, safe, action-oriented first aid steps in language code ' + payload.language + '.',
    'Avoid diagnosis. Tell the user to call emergency services and not move a possible spine injury.',
    'Return compact markdown with clear steps.',
    'Payload: ' + JSON.stringify(payload)
  ].join('\n');
}

function summaryPrompt(payload) {
  return [
    'Generate a structured incident summary for hospital handoff, insurance, and review.',
    'Return JSON with briefSummary, timeline, decisionsExplained, outcome, recommendations.',
    'Base every field on the supplied incident data.',
    'Payload: ' + JSON.stringify(payload)
  ].join('\n');
}

function hospitalPrompt(payload) {
  return [
    'Explain why the selected hospital is the best fit for a RoadSoS incident.',
    'Consider ICU, trauma center capability, ETA, blood bank, and specialty match.',
    'Payload: ' + JSON.stringify(payload)
  ].join('\n');
}

module.exports = { severityPrompt, firstAidPrompt, summaryPrompt, hospitalPrompt };
