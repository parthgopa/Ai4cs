import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_otp_email(to_email, otp):
    smtp_server = "smtp.hostinger.com"
    smtp_port = 465
    from_email = "info@ai4cs.in"
    password = "Pp847060#"

    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = "Your AI4CS Verification Code"

    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #0b5ed7; margin: 0;">AI4CS</h2>
          <p style="color: #6c757d; margin: 5px 0 0 0;">AI Tools for Company Secretaries</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <h3 style="color: #1f2937;">Email Verification Required</h3>
        <p>Hello,</p>
        <p>Thank you for signing up with AI4CS. Please use the following One-Time Password (OTP) to verify your email address and activate your account:</p>
        <div style="background-color: #f6f8fb; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; margin: 20px 0; color: #0b5ed7; border: 1px solid #e8f1fd;">
          {otp}
        </div>
        <p>This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
          This is an automated message, please do not reply.
        </p>
      </body>
    </html>
    """
    msg.attach(MIMEText(body, 'html'))

    try:
        server = smtplib.SMTP_SSL(smtp_server, smtp_port, timeout=15)
        server.login(from_email, password)
        server.sendmail(from_email, to_email, msg.as_string())
        server.quit()
        print(f"OTP email sent successfully to {to_email}")
        return True
    except Exception as e:
        print(f"SMTP Error occurred while sending to {to_email}: {e}")
        return False

def send_admin_otp_email(to_email, otp):
    smtp_server = "smtp.hostinger.com"
    smtp_port = 465
    from_email = "info@ai4cs.in"
    password = "Pp847060#"

    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = "AI4CS Admin Portal Approval OTP"

    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #dc3545; margin: 0;">AI4CS Admin Portal</h2>
          <p style="color: #6c757d; margin: 5px 0 0 0;">Administrative Console</p>
        </div>
        <hr style="border: 0; border-top: 2px solid #dc3545; margin: 20px 0;">
        <h3 style="color: #1f2937;">Admin Approval OTP Required</h3>
        <p>Hello,</p>
        <p>A request has been received to register this email address as an administrator on the AI4CS platform.</p>
        <p>Please use the following One-Time Password (OTP) to confirm and verify this administrator account activation:</p>
        <div style="background-color: #fff5f5; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; margin: 20px 0; color: #dc3545; border: 1px solid #fecdd3;">
          {otp}
        </div>
        <p>This administrator authorization code will expire in 10 minutes. If you did not request admin access, please contact cybersecurity teams immediately.</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
          This is an automated administrative authorization message, please do not reply.
        </p>
      </body>
    </html>
    """
    msg.attach(MIMEText(body, 'html'))

    try:
        server = smtplib.SMTP_SSL(smtp_server, smtp_port, timeout=15)
        server.login(from_email, password)
        server.sendmail(from_email, to_email, msg.as_string())
        server.quit()
        print(f"Admin Approval OTP email sent successfully to {to_email}")
        return True
    except Exception as e:
        print(f"SMTP Error occurred while sending Admin OTP to {to_email}: {e}")
        return False

