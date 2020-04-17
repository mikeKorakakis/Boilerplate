using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Domain;

namespace Application.Values
{
    public class Create
    {
        public class Command : IRequest
        {
            public int Id { get; set; }
            public string Name { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {

                var Value = new Value
                {
                    Id = request.Id,
                    Name = request.Name
                };

                _context.Values.Add(Value);
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}