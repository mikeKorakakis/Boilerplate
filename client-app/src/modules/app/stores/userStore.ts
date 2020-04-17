// export default "hello";
import { IUser, IUserFormValues } from "../models/user";
import { observable, computed, action, runInAction } from "mobx";
// import agent from "../api/agent";
import { RootStore } from "./rootStore";

import { history } from "../../../index";

export default class UserStore {
	rootStore: RootStore;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
	}
	@observable user: IUser | null = null;
	@computed get isLoggedIn() {
		return !!this.user;
	}

	@observable loading = false;

	@action login = async (user: IUser) => {
		try {
			runInAction(() => {
				this.user = {
					username: user.username,
					displayName: user.displayName,
					token: user.token,
				};
			});
			this.rootStore.commonStore.setToken(user.token);
			// this.rootStore.modalStore.closeModal();
			history.push("/values");
		} catch (error) {
			throw error;
		}
	};

	@action logout = () => {
		this.rootStore.commonStore.setToken(null);
		this.user = null;
		history.push("/");
	};

	// @action register = async (values: IUserFormValues) => {
	// 	try {
	// 		const user = await agent.User.register(values);
	// 		this.rootStore.commonStore.setToken(user.token);
	// 		// this.rootStore.modalStore.closeModal();
	// 		history.push("/activities");
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// };

	@action getUser = async (user: IUser) => {
		try {
			// const user = await agent.User.current();
			runInAction(() => {
				this.user = user;
			});
		} catch (error) {
			console.log(error);
		}
	};

	// @action fbLogin = async (response: any) => {
	// 	this.loading = true;
	// 	try {
	// 		const user = await agent.User.fbLogin(response.accessToken);
	// 		runInAction(() => {
	// 			this.user = user;
	// 			this.rootStore.commonStore.setToken(user.token);
	// 			// this.rootStore.modalStore.closeModal();
	// 			this.loading = false;
	// 		});
	// 		history.push("/activities");
	// 	} catch (error) {
	// 		this.loading = false;
	// 		throw error;
	// 	}
	// };
}
