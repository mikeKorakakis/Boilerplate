using System.Threading.Tasks;
using Application.Values;
using Domain;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Subscriptions;
using HotChocolate.Types;
using MediatR;

namespace API.Graphql.Values
{
    [ExtendObjectType(Name = "Mutation")]
    public class ValueMutations
    {
        private readonly IMediator _mediator;
        public ValueMutations(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Creates a value
        /// </summary>
        [Authorize]
        public async Task<Value> CreateValue(
             Create.Command command, [Service]IEventSender eventSender)
        {

            var value = new Value { Id = command.Id, Name = command.Name };
            await _mediator.Send(command);
            await eventSender.SendAsync(new OnValueMessage(value));
            return value;
        }
    }
}