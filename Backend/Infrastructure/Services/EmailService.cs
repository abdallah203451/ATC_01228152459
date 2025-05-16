using Application.Interfaces;
using Microsoft.Extensions.Configuration;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using System;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = false)
        {
            var email = new MimeMessage();
            email.Sender = MailboxAddress.Parse(_configuration["EmailSettings:Mail"]);
            email.From.Add(MailboxAddress.Parse(_configuration["EmailSettings:Mail"]));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;

            var builder = new BodyBuilder();
            if (isHtml)
            {
                builder.HtmlBody = body;
            }
            else
            {
                builder.TextBody = body;
            }

            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(
                _configuration["EmailSettings:Host"],
                Convert.ToInt32(_configuration["EmailSettings:Port"]),
                SecureSocketOptions.StartTls
            );

            await smtp.AuthenticateAsync(
                _configuration["EmailSettings:Mail"],
                _configuration["EmailSettings:Password"]
            );

            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }

        public async Task SendPasswordResetEmailAsync(string to, string token)
        {
            var resetLink = $"{_configuration["AppSettings:ClientBaseUrl"]}/reset-password?token={token}&email={to}";

            var subject = "Reset Your Password";
            var body = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Reset Your Password</title>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .button {{ display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }}
        .footer {{ margin-top: 20px; font-size: 12px; color: #777; }}
    </style>
</head>
<body>
    <div class='container'>
        <h2>Reset Your Password</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to reset it:</p>
        <p><a href='{resetLink}' class='button'>Reset Password</a></p>
        <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
        <p>This link will expire in 24 hours.</p>
        <div class='footer'>
            <p>Event Booking System</p>
        </div>
    </div>
</body>
</html>";

            await SendEmailAsync(to, subject, body, true);
        }

        public async Task SendWelcomeEmailAsync(string to, string userName)
        {
            var subject = "Welcome to Event Booking System";
            var body = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Welcome to Event Booking System</title>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .button {{ display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }}
        .footer {{ margin-top: 20px; font-size: 12px; color: #777; }}
    </style>
</head>
<body>
    <div class='container'>
        <h2>Welcome to Event Booking System!</h2>
        <p>Hello {userName},</p>
        <p>Thank you for joining our platform. We're excited to have you on board!</p>
        <p>With Event Booking System, you can browse and book various events, manage your bookings, and much more.</p>
        <p><a href='{_configuration["AppSettings:ClientBaseUrl"]}' class='button'>Explore Events</a></p>
        <p>If you have any questions or need assistance, feel free to contact our support team.</p>
        <div class='footer'>
            <p>Event Booking System</p>
        </div>
    </div>
</body>
</html>";

            await SendEmailAsync(to, subject, body, true);
        }

        public async Task SendBookingConfirmationEmailAsync(string to, string userName, string eventName, string eventDate, string venue, int ticketCount, decimal totalPrice)
        {
            var subject = $"Booking Confirmation - {eventName}";
            var body = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Booking Confirmation</title>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .booking-details {{ background-color: #f9f9f9; padding: 20px; margin: 20px 0; }}
        .footer {{ margin-top: 20px; font-size: 12px; color: #777; }}
    </style>
</head>
<body>
    <div class='container'>
        <h2>Booking Confirmation</h2>
        <p>Hello {userName},</p>
        <p>Your booking has been confirmed! Here are the details:</p>
        
        <div class='booking-details'>
            <p><strong>Event:</strong> {eventName}</p>
            <p><strong>Date:</strong> {eventDate}</p>
            <p><strong>Venue:</strong> {venue}</p>
            <p><strong>Tickets:</strong> {ticketCount}</p>
            <p><strong>Total Amount:</strong> ${totalPrice:F2}</p>
        </div>
        
        <p>You can view your booking details in your account.</p>
        <p><a href='{_configuration["AppSettings:ClientBaseUrl"]}/my-bookings'>View My Bookings</a></p>
        
        <p>Thank you for using our service!</p>
        
        <div class='footer'>
            <p>Event Booking System</p>
        </div>
    </div>
</body>
</html>";

            await SendEmailAsync(to, subject, body, true);
        }
    }
} 