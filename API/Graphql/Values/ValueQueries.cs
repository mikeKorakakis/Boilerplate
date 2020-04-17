using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Values;
using Domain;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Execution;
using HotChocolate.Types;
using HotChocolate.Types.Relay;
using MediatR;

namespace API.Graphql.Values
{
    [ExtendObjectType(Name = "Query")]
    public class ValueQueries
    {
        private readonly IMediator _mediator;
        public ValueQueries(IMediator mediator)
        {
            _mediator = mediator;
        }

        // [UsePaging]
        // [UseFiltering]
        // [UseSorting]
        public async Task<List<Value>> GetValues()
        {

            return await _mediator.Send(new List.Query());
        }
    }

}