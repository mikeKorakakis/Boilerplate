import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
// import { createUploadLink } from "apollo-upload-client";
import { createHttpLink } from "apollo-link-http";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

const httpLink = createHttpLink({
	uri: process.env.REACT_APP_SERVER_URL,
	credentials: "include",
});

const authLink = setContext((_, { headers }) => {
	// get the authentication token from local storage if it exists
	const token = localStorage.getItem("jwt");
	// return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
	uri: process.env.REACT_APP_SERVER_WS_URL as string,
	options: {
		reconnect: true,
	},
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
	// split based on operation type
	({ query }) => {
		const { kind, operation } = getMainDefinition(query) as any;
		return kind === "OperationDefinition" && operation === "subscription";
	},
	wsLink,
	authLink.concat(httpLink)
);

export const client = new ApolloClient({
	link,
	cache: new InMemoryCache(),
});
