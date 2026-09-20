import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
# You can replace these with os.environ.get if you want them highly dynamic
SMTP_USER = getattr(settings, "SMTP_USER", "")
SMTP_PASSWORD = getattr(settings, "SMTP_PASSWORD", "")

def send_email(to_email: str, subject: str, html_body: str):
    if not SMTP_USER or not SMTP_PASSWORD:
        print(f"Skipping email to {to_email} (SMTP credentials not configured)")
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
        print(f"Failed to send email to {to_email}: {e}")
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
