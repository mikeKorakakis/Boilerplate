using System.Collections.Generic;
using System.Threading.Tasks;
using Application.User;
using Domain;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Types;
using MediatR;

namespace API.User.Graphql
{


    [ExtendObjectType(Name = "Mutation")]
    public class UserMutations
    {
        private readonly IMediator _mediator;
        public UserMutations(IMediator mediator)
        {
            _mediator = mediator;
        }

        // [UsePaging]
        // [UseFiltering]
        // [UseSorting]

        public async Task<Application.User.User> Login(Login.Query query) => await _mediator.Send(query);
    }

}