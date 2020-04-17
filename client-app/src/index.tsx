import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";

import { client } from "./apollo";
import "./index.css";
import App from "./modules/app/layout/App";
import * as serviceWorker from "./serviceWorker";

export const history = createBrowserHistory();

ReactDOM.render(
	<ApolloProvider client={client}>
		<Router history={history}>
			<React.StrictMode>
				<App />
			</React.StrictMode>
		</Router>
	</ApolloProvider>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
