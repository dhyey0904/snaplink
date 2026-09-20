import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
import os
# Read directly from OS environment variables since Pydantic Settings doesn't have them defined
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")

def send_email(to_email: str, subject: str, html_body: str):
    # 1. Try Resend HTTP API (Bypasses Render SMTP Block)
    resend_api_key = os.environ.get("RESEND_API_KEY")
    if resend_api_key:
        import requests
        print(f"Attempting to send email via Resend API to {to_email}...")
        try:
            response = requests.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {resend_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "from": "SnapLink <onboarding@resend.dev>",
                    "to": [to_email],
                    "subject": subject,
                    "html": html_body
                }
            )
            if response.status_code in [200, 201]:
                print(f"Successfully sent email via Resend to {to_email}")
                return True
            else:
                print(f"Resend API Error: {response.text}")
                return False
        except Exception as e:
            print(f"Resend API Exception: {e}")
            return False

    # 2. Fallback to standard SMTP
    if not SMTP_USER or not SMTP_PASSWORD:
        print(f"Skipping email to {to_email} (Neither RESEND_API_KEY nor SMTP credentials configured)")
        return False
        
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"SnapLink <{SMTP_USER}>"
    msg["To"] = to_email

    part = MIMEText(html_body, "html")
    msg.attach(part)

    try:
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, to_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        import traceback
        print(f"\n[SMTP ERROR] Failed to send email to {to_email}:\n{e}\n")
        traceback.print_exc()
        return False

def send_welcome_email(to_email: str):
    subject = "Welcome to SnapLink!"
    body = """
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #1a73e8;">Welcome to SnapLink!</h2>
        <p>Hi there,</p>
        <p>Thank you for creating an account on SnapLink. You now have access to the ultimate digital identity and secure file-sharing platform.</p>
        <p>Here are a few things you can do to get started:</p>
        <ul>
          <li><strong>Create a secure short link</strong> with password protection.</li>
          <li><strong>Share a large file</strong> (up to 1GB) with an auto-expiring timer.</li>
          <li><strong>Generate a 3D digital vCard</strong> to share your professional profile.</li>
        </ul>
        <p>We're thrilled to have you onboard.</p>
        <p>Cheers,<br>The SnapLink Team</p>
      </body>
    </html>
    """
    return send_email(to_email, subject, body)

def send_file_downloaded_email(to_email: str, filename: str):
    subject = "Your file has been downloaded! | SnapLink"
    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #10b981;">File Download Alert</h2>
        <p>Hi there,</p>
        <p>Great news! Your file <strong>{filename}</strong> was just successfully downloaded via SnapLink.</p>
        <p>You can track all activity and analytics for your files in your SnapLink Dashboard.</p>
        <p>Cheers,<br>The SnapLink Team</p>
      </body>
    </html>
    """
    return send_email(to_email, subject, body)

def send_password_reset_email(to_email: str, token: str):
    subject = "Reset your SnapLink password"
    # Using snaplinks.in explicitly, or environment variable
    reset_url = f"https://www.snaplinks.in/reset-password?token={token}"
    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #1a73e8;">Reset Your Password</h2>
        <p>Hi there,</p>
        <p>We received a request to reset the password for your SnapLink account. If you made this request, please click the button below to choose a new password:</p>
        <div style="margin: 30px 0;">
          <a href="{reset_url}" style="background-color: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p>Cheers,<br>The SnapLink Team</p>
      </body>
    </html>
    """
    print(f"\n[DEBUG] Password Reset Link for {to_email}: {reset_url}\n", flush=True)
    return send_email(to_email, subject, body)
