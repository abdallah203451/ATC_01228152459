using AutoMapper;
using Application.DTOs;
using Core.Domain.Entities;
using System.Linq;

namespace Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Event mappings
            CreateMap<Event, EventDTO>()
                .ForMember(d => d.CategoryId, o => o.MapFrom(s => s.CategoryId))
                .ForMember(d => d.CategoryName, o => o.MapFrom(s => s.Categoryobj.Name))
                .ForMember(d => d.Tags, o => o.MapFrom(s => s.EventTags.Select(et => new TagDTO { Id = et.TagId, Name = et.Tag.Name })));


			CreateMap<Event, EventListDTO>()
                .ForMember(d => d.CategoryId, o => o.MapFrom(s => s.CategoryId))
                .ForMember(d => d.CategoryName, o => o.MapFrom(s => s.Categoryobj.Name))
                .ForMember(d => d.Tags, o => o.MapFrom(s => s.EventTags.Select(et => et.Tag.Name)));


			CreateMap<CreateEventDTO, Event>()
			    .ForMember(d => d.CategoryId, o => o.MapFrom(s => s.CategoryId))
			    .ForMember(d => d.AvailableTickets, o => o.MapFrom(s => s.Capacity));

			CreateMap<UpdateEventDTO, Event>()
			    .ForMember(d => d.CategoryId, o => o.MapFrom(s => s.CategoryId))
			    .ForMember(d => d.AvailableTickets, o => o.MapFrom((s, d) => s.Capacity));

			// Tag mappings
			CreateMap<Tag, TagDTO>();
            CreateMap<CreateTagDTO, Tag>();
            CreateMap<UpdateTagDTO, Tag>();

            // Booking mappings
            CreateMap<Booking, BookingDTO>();
            CreateMap<Booking, BookingListDTO>()
                .ForMember(dest => dest.EventName, opt => opt.MapFrom(src => src.Event.Name))
                .ForMember(dest => dest.EventDate, opt => opt.MapFrom(src => src.Event.EventDate))
                .ForMember(dest => dest.Venue, opt => opt.MapFrom(src => src.Event.Venue));
            CreateMap<CreateBookingDTO, Booking>();
            CreateMap<UpdateBookingDTO, Booking>();

            // User mappings
            CreateMap<ApplicationUser, UserDTO>()
                .ForMember(dest => dest.Roles, opt => opt.Ignore());

            // Category mappings
            CreateMap<Category, CategoryDTO>();
            CreateMap<CreateCategoryDTO, Category>();
            CreateMap<UpdateCategoryDTO, Category>();
        }
    }
} 