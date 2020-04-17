import * as yup from "yup";

export const emailNotLongEnough = "Email must be at least 3 characters";
export const invalidEmail = "Email must be a valid email";
export const passwordNotLongEnough = "Password must be at least 3 characters";

const email = yup
	.string()
	.min(3, emailNotLongEnough)
	.max(255)
	.email(invalidEmail)
	.required("Email is a required field.");

export const password = yup
	.string()
	.min(3, passwordNotLongEnough)
	.max(255)
	.required("Password is a required field.");

export const loginUserSchema = yup.object().shape({
	email: yup
		.string()

		.required("Email is a required field"),
	password: yup
		.string()

		.required("Password is a required field"),
});
