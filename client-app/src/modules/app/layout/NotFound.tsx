import React from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";

const NotFound = () => {
	return (
		<Grid direction="column">
			<Typography align="center" style={{ fontSize: "150px" }}>
				404
			</Typography>

			<Typography align="center" variant="h4">
				<SearchIcon fontSize="large" />
				Oops - we've looked everywhere but couldn't find this.
			</Typography>
			<Grid container justify="center">
				<Button
					component={Link}
					to="/"
					variant="contained"
					color="secondary"
					style={{ margin: "10px" }}
				>
					Return to homepage
				</Button>
			</Grid>
		</Grid>
	);
};

export default NotFound;
