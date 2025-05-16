using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body, bool isHtml = false);
        Task SendPasswordResetEmailAsync(string to, string token);
        Task SendWelcomeEmailAsync(string to, string userName);
        Task SendBookingConfirmationEmailAsync(string to, string userName, string eventName, string eventDate, string venue, int ticketCount, decimal totalPrice);
    }
} 