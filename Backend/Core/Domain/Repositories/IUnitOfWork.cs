using System;
using System.Threading.Tasks;

namespace Core.Domain.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IEventRepository Events { get; }
        ITagRepository Tags { get; }
        IBookingRepository Bookings { get; }
        IEventTagRepository EventTags { get; }
        ICategoryRepository Categories { get; }
        
        Task<int> SaveChangesAsync();
    }
} 