import React, { useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { useLoginMutation } from "../../app/graphql/graphql-hooks";
import { RootStoreContext } from "../../app/stores/rootStore";
import { observer } from "mobx-react-lite";
import { loginUserSchema } from "../../app/yupSchemas/user";

const initialValues = {
	email: "",
	password: "",
};

const handleSubmit: handleSubmit = async (
	data,
	{ setSubmitting },
	loginMutation,
	login
) => {
	console.log(data);
	setSubmitting(true);
	try {
		const res = await loginMutation({
			variables: {
				email: data.email,
				password: data.password,
			},
		});
		if (res && res.data && res.data.login) login(res.data.login);
	} catch (err) {
		console.log(err);
	}
};

const LoginForm = () => {
	const classes = useStyles();
	const [loginMutation] = useLoginMutation();
	const rootStore = useContext(RootStoreContext);
	const { login } = rootStore.userStore;

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
				<Formik
					validateOnMount={true}
					validationSchema={loginUserSchema}
					initialValues={initialValues}
					onSubmit={(data, formikHelpers) =>
						handleSubmit(data, formikHelpers, loginMutation, login)
					}
				>
					{({ isValid, isSubmitting, errors, touched }) => (
						<Form className={classes.form} noValidate>
							<Field
								as={TextField}
								variant="outlined"
								margin="normal"
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
								error={touched.email && errors.email}
								helperText={touched.email && errors.email}
								autoFocus
							/>
							<Field
								as={TextField}
								variant="outlined"
								margin="normal"
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="current-password"
								error={touched.password && errors.password}
								helperText={touched.password && errors.password}
							/>

							<Button
								// disabled={!isValid}
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
							>
								Sign In
							</Button>
						</Form>
					)}
				</Formik>
			</div>
		</Container>
	);
};

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		marginBottom: theme.spacing(4),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		margin: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

type handleSubmit = (
	data: {
		email: string;
		password: string;
	},
	formikHelpers: FormikHelpers<any>,
	loginMutation: any,
	login: any
) => Promise<any>;

export default observer(LoginForm);
