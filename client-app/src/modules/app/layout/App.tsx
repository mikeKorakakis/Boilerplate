import React, { Fragment, useContext, useEffect } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Values from "../../features/values/Values";
import { Container, makeStyles } from "@material-ui/core";
import NotFound from "./NotFound";
import PrivateRoute from "./PrivateRoute";
import { observer } from "mobx-react-lite";
import Footer from "./Footer";
import NavBar from "./NavBar";
import HomePage from "../../features/home/HomePage";
import { RootStoreContext } from "../stores/rootStore";
import { useCurrentUserQuery } from "../graphql/graphql-hooks";
import LoadingComponent from "../common/LoadingComponent";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexDirection: "column",
		minHeight: "100vh",
		flexGrow: 0,
	},
	flexDiv: {
		display: "flex",
		flexGrow: 2,
	},
}));

function App() {
	const RootStore = useContext(RootStoreContext);
	const { setAppLoaded, token, appLoaded } = RootStore.commonStore;
	const { getUser } = RootStore.userStore;
	const { data, loading } = useCurrentUserQuery();
	useEffect(() => {
		if (token && !loading && data && data.currentUser) {
			getUser({
				username: data?.currentUser?.username!,
				displayName: data?.currentUser?.displayName!,
				token: data?.currentUser?.token!,
			}).finally(() => setAppLoaded());
		} else {
			setAppLoaded();
		}
	}, [getUser, setAppLoaded, token, data, loading]);
	const classes = useStyles();

	if (!appLoaded) return <LoadingComponent />;

	return (
		<Fragment>
			<Route exact path="/" component={HomePage} />
			<Route
				path={"/(.+)"}
				render={() => (
					<div className={classes.root}>
						<NavBar />
						<Switch>
							<PrivateRoute
								exact
								path="/values"
								component={Values}
							/>
							<Route component={NotFound} />
						</Switch>
						<div className={classes.flexDiv} />
						<Footer />
					</div>
				)}
			/>
		</Fragment>
	);
}

export default withRouter(observer(App));
