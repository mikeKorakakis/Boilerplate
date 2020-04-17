using System;
using Domain;
using HotChocolate.Language;
using HotChocolate.Subscriptions;

namespace API.Graphql.Values
{
    public class OnValueMessage : EventMessage
    {
        public OnValueMessage(Value value) : base(CreateEventDescription(value), value)
        {

        }

        private static IEventDescription CreateEventDescription(Value value)
        {

            return new EventDescription("onValue");
        }
    }
}