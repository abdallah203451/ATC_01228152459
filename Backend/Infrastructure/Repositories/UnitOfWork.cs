using Core.Domain.Repositories;
using Infrastructure.Data;
using System;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IEventRepository _events;
        private ITagRepository _tags;
        private IBookingRepository _bookings;
        private IEventTagRepository _eventTags;
		private ICategoryRepository _categories;
		private bool _disposed;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEventRepository Events => _events ??= new EventRepository(_context);
        public ITagRepository Tags => _tags ??= new TagRepository(_context);
        public IBookingRepository Bookings => _bookings ??= new BookingRepository(_context);
        public IEventTagRepository EventTags => _eventTags ??= new EventTagRepository(_context);
		public ICategoryRepository Categories => _categories ??= new CategoryRepository(_context);

		public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed && disposing)
            {
                _context.Dispose();
            }
            _disposed = true;
        }
    }
} 