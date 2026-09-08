// SessionStart hook: inject the caveman ruleset so the skill is active from
// the first turn. Reads SKILL.md (source of truth) — the hook never
// re-types the rules, so a skill update is enough to update the prompt.
// Codex reads hook output as JSON: systemMessage (banner) +
// hookSpecificOutput.additionalContext (injected into the conversation).
const fs = require('fs');
const path = require('path');

const PLUGIN_ROOT = process.env.PLUGIN_ROOT || path.resolve(__dirname, '..');

function fail(msg) {
  console.error(`[caveman] ${msg}`);
  process.exit(0); // exit 0: never block the session over a prompt injection
}

let raw;
try {
  raw = fs.readFileSync(path.join(PLUGIN_ROOT, 'skills', 'caveman', 'SKILL.md'), 'utf8');
} catch (e) {
  fail(`SKILL.md not found: ${e.message}`);
}

// Strip YAML frontmatter: it is metadata for skill discovery, not prompt.
const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
if (!body || !body.trim()) fail('SKILL.md has no body after frontmatter');

// Capped context: enough for the full ruleset + intensity table, far less
// than dumping the whole file on every session start.
const MAX_CONTEXT = 16000;
const context = body.length > MAX_CONTEXT ? body.slice(0, MAX_CONTEXT) + '\n[truncated]' : body;

const output = {
  systemMessage: 'CAVEMAN MODE ACTIVE (full)',
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: context,
  },
};
process.stdout.write(JSON.stringify(output));
