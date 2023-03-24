/**
 * This interface represents a user object sent to here by server-side
 * it is strapped of any crucial details.
 */
export interface IUser {
	id: string;
	email: string;
	username: string;

	/** An array of post ids */
	posts: string[];

	/** An array of user ids */
	following: string[];

	/** An array of user ids */
	followers: string[];
}

export interface ILoginCredentials {
	email: string;
	password: string;
}

export interface IRegisterCredentials extends ILoginCredentials {
	username: string;
}

export interface ILoginResponse {
	user: IUser;
	accessToken: string;
}

export interface IAuthState {
	user: IUser | null;
	accessToken: string;
}
