using Domain;
using HotChocolate.Subscriptions;
using HotChocolate.Types;
namespace API.Graphql.Values
{
    [ExtendObjectType(Name = "Subscription")]
    public class ValueSubscriptions
    {
        public ValueSubscriptions()
        {
        }

        public Value onValue(
            IEventMessage message
    )
        {
            return (Value)message.Payload;
        }
    }
}