import fs from 'fs';
import path from 'path';
import axios from 'axios';

const LOG_DIR = path.join(process.cwd(), 'logs');
fs.mkdirSync(LOG_DIR, { recursive: true });

export async function logAction(
  action: 'approved' | 'denied',
  filename: string,
  by: string = 'Protocol-C'
) {
  const logFile = path.join(LOG_DIR, 'actions.json');
  const timestamp = new Date().toISOString();
  const entry = { action, filename, by, timestamp };

  let logs = [];
  try {
    if (fs.existsSync(logFile)) {
      logs = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
    }
  } catch {}

  logs.push(entry);
  fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
}

export async function sendDiscordAlert(type: 'approve' | 'deny', filename: string) {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return;

  const icon = type === 'approve' ? '🟢' : '🔴';
  const message = `${icon} **${type.toUpperCase()}** \`${filename}\` by Protocol-C`;

  try {
    await axios.post(url, { content: message });
  } catch (err) {
    console.error('[Discord Webhook] Failed to send:', err);

    // ⛑ Optional fallback log
    const errorLogFile = path.join(LOG_DIR, 'errors.json');
    const errorEntry = {
      error: (err as any).message || 'Unknown error',
      type,
      filename,
      timestamp: new Date().toISOString(),
    };

    let errors = [];
    try {
      if (fs.existsSync(errorLogFile)) {
        errors = JSON.parse(fs.readFileSync(errorLogFile, 'utf-8'));
      }
    } catch {}

    errors.push(errorEntry);
    fs.writeFileSync(errorLogFile, JSON.stringify(errors, null, 2));
  }
}
