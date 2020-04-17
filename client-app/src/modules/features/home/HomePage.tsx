import { useContext, useEffect, useCallback } from "react";
import { RootStoreContext } from "../../app/stores/rootStore";
import React from "react";
import { Dialog, Slide, Button } from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";
import { observer } from "mobx-react-lite";

const Transition = React.forwardRef<unknown, TransitionProps>(
	function Transition(props, ref) {
		// @ts-ignore
		return <Slide direction="up" ref={ref} {...props} />;
	}
);

const HomePage = () => {
	const token = window.localStorage.getItem("jwt");
	const rootStore = useContext(RootStoreContext);
	const { isLoggedIn, user } = rootStore.userStore;

	const [open, setOpen] = React.useState(false);

	const handleClickOpen = useCallback(() => {
		setOpen(true);
	}, [setOpen]);

	const handleClose = useCallback(() => {
		setOpen(false);
	}, [setOpen]);

	console.log(user, isLoggedIn);

	useEffect(() => {
		handleClickOpen();
		return () => {
			handleClose();
		};
	}, [handleClickOpen, handleClose]);

	return (
		<div
			style={{
				display: "flex",
				width: "100%",
				height: "100vh",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{isLoggedIn && user && token ? (
				<Button
					style={{ margin: "auto" }}
					component={Link}
					to="/values"
				>
					Go to values
				</Button>
			) : (
				<Dialog
					open={!isLoggedIn && !user && !token && open}
					TransitionComponent={Transition}
					keepMounted
					// onClose={handleClose}
					aria-labelledby="alert-dialog-slide-title"
					aria-describedby="alert-dialog-slide-description"
				>
					<LoginForm />
				</Dialog>
			)}
		</div>
	);
};

export default observer(HomePage);
