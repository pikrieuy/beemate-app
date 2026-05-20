import { Resend } from "resend";

// Singleton Resend client
let resendClient: Resend | null = null;

export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    // Email not configured — silently skip (not a hard requirement)
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://beemate-app.vercel.app";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "BeeMate <noreply@beemate-app.vercel.app>";

// ── Email Templates ──────────────────────────────────────────────────────────

export function teamInviteEmailHtml({
  recipientName,
  senderName,
  teamName,
  teamDescription,
}: {
  recipientName: string;
  senderName: string;
  teamName: string;
  teamDescription?: string | null;
}) {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Undangan Tim BeeMate</title>
</head>
<body style="margin:0;padding:0;background:#0f1117;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1117;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#141720;border:1px solid #2e3450;border-radius:20px;overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#f5a623,#ffbe4d);padding:32px;text-align:center;">
              <div style="font-size:32px;margin-bottom:8px;">🐝</div>
              <div style="font-size:22px;font-weight:800;color:#1a0f00;letter-spacing:-0.5px;">BeeMate</div>
              <div style="font-size:12px;color:#5a3800;margin-top:4px;">Find Your Hive</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h1 style="font-size:22px;font-weight:800;color:#f2f4fc;margin:0 0 12px;letter-spacing:-0.3px;">
                Kamu Diundang ke Tim! 🎉
              </h1>
              <p style="font-size:14px;color:#a8b0d0;line-height:1.7;margin:0 0 24px;">
                Hei <strong style="color:#f2f4fc;">${recipientName}</strong>,<br/>
                <strong style="color:#f2f4fc;">${senderName}</strong> mengundangmu untuk bergabung ke tim mereka di BeeMate.
              </p>

              <!-- Team Card -->
              <div style="background:#1e2236;border:1px solid #f5a62330;border-radius:14px;padding:20px;margin-bottom:28px;">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:${teamDescription ? "10px" : "0"};">
                  <div style="width:40px;height:40px;background:#f5a62320;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">👥</div>
                  <div>
                    <div style="font-size:16px;font-weight:800;color:#f2f4fc;">${teamName}</div>
                    <div style="font-size:12px;color:#636d9a;">Tim di BeeMate</div>
                  </div>
                </div>
                ${teamDescription ? `<p style="font-size:13px;color:#a8b0d0;margin:0;line-height:1.6;padding-top:10px;border-top:1px solid #2e3450;">${teamDescription}</p>` : ""}
              </div>

              <!-- CTA Button -->
              <div style="text-align:center;margin-bottom:28px;">
                <a href="${APP_URL}/notifications" 
                   style="display:inline-block;background:linear-gradient(135deg,#f5a623,#ffbe4d);color:#1a0f00;font-weight:800;font-size:14px;padding:14px 32px;border-radius:12px;text-decoration:none;letter-spacing:-0.2px;">
                  Lihat Undangan →
                </a>
              </div>

              <p style="font-size:12px;color:#636d9a;line-height:1.6;margin:0;">
                Kamu bisa menerima atau menolak undangan ini di halaman Notifikasi BeeMate.<br/>
                Jika kamu tidak mengenal pengirim ini, abaikan email ini.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #2e3450;text-align:center;">
              <p style="font-size:11px;color:#3a4060;margin:0;">
                BeeMate — Platform matchmaking tim kampus<br/>
                <a href="${APP_URL}" style="color:#f5a623;text-decoration:none;">${APP_URL}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function teamInviteEmailText({
  recipientName,
  senderName,
  teamName,
}: {
  recipientName: string;
  senderName: string;
  teamName: string;
}) {
  return `
Hei ${recipientName},

${senderName} mengundangmu untuk bergabung ke tim "${teamName}" di BeeMate.

Lihat undangan di: ${APP_URL}/notifications

Kamu bisa menerima atau menolak undangan ini di halaman Notifikasi.

---
BeeMate — Find Your Hive
${APP_URL}
  `.trim();
}

// ── Send Functions ────────────────────────────────────────────────────────────

export async function sendTeamInviteEmail({
  recipientEmail,
  recipientName,
  senderName,
  teamName,
  teamDescription,
}: {
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  teamName: string;
  teamDescription?: string | null;
}) {
  const resend = getResend();
  if (!resend) return; // Email not configured, skip silently

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: `${senderName} mengundangmu ke tim "${teamName}" di BeeMate 🐝`,
      html: teamInviteEmailHtml({ recipientName, senderName, teamName, teamDescription }),
      text: teamInviteEmailText({ recipientName, senderName, teamName }),
    });
  } catch (error) {
    // Log but don't throw — email failure shouldn't break the invite flow
    console.error("[EMAIL] Failed to send team invite email:", error);
  }
}

export async function sendInviteAcceptedEmail({
  recipientEmail,
  recipientName,
  acceptorName,
  teamName,
  teamId,
}: {
  recipientEmail: string;
  recipientName: string;
  acceptorName: string;
  teamName: string;
  teamId: string;
}) {
  const resend = getResend();
  if (!resend) return;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: `${acceptorName} bergabung ke tim "${teamName}" 🎉`,
      html: `
<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8" /><title>Undangan Diterima</title></head>
<body style="margin:0;padding:0;background:#0f1117;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1117;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#141720;border:1px solid #2e3450;border-radius:20px;overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,#2dd67a,#34d399);padding:32px;text-align:center;">
          <div style="font-size:32px;margin-bottom:8px;">🎉</div>
          <div style="font-size:22px;font-weight:800;color:#052e16;">BeeMate</div>
        </td></tr>
        <tr><td style="padding:36px 40px;">
          <h1 style="font-size:22px;font-weight:800;color:#f2f4fc;margin:0 0 12px;">Undangan Diterima!</h1>
          <p style="font-size:14px;color:#a8b0d0;line-height:1.7;margin:0 0 24px;">
            Hei <strong style="color:#f2f4fc;">${recipientName}</strong>,<br/>
            <strong style="color:#f2f4fc;">${acceptorName}</strong> telah menerima undanganmu dan bergabung ke tim <strong style="color:#f2f4fc;">${teamName}</strong>!
          </p>
          <div style="text-align:center;margin-bottom:28px;">
            <a href="${APP_URL}/teams/${teamId}" style="display:inline-block;background:linear-gradient(135deg,#2dd67a,#34d399);color:#052e16;font-weight:800;font-size:14px;padding:14px 32px;border-radius:12px;text-decoration:none;">
              Lihat Tim →
            </a>
          </div>
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid #2e3450;text-align:center;">
          <p style="font-size:11px;color:#3a4060;margin:0;">BeeMate — <a href="${APP_URL}" style="color:#f5a623;text-decoration:none;">${APP_URL}</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
      `.trim(),
      text: `Hei ${recipientName},\n\n${acceptorName} telah menerima undanganmu dan bergabung ke tim "${teamName}"!\n\nLihat tim: ${APP_URL}/teams/${teamId}\n\n---\nBeeMate`,
    });
  } catch (error) {
    console.error("[EMAIL] Failed to send invite accepted email:", error);
  }
}
