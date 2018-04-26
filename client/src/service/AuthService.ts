import {injectable} from "inversify";
import {Auth0Variables} from "../entity/Auth0-Variables";

@injectable()
export class AuthService {

    client;

    createAuth0Client = () => {
        this.client = new Auth0Lock(Auth0Variables.AUTH0_CLIENT_ID,
            Auth0Variables.AUTH0_DOMAIN,
            {
                auth: {
                    redirect: false
                },
                allowedConnections: ['google-oauth2', 'facebook'],
                allowSignUp: false
            });
        this.authenticated();
    }

    authenticated = () => {
        this.client.on("authenticated", this.onAuthResult);
    };

    private onAuthResult = (authResult) => {
        this.client.getProfile(authResult.idToken, this.onReceiveProfile.bind(null, authResult));
    }

    private onReceiveProfile = (error, profile, authResult)=>{
        if (error) {
            // Handle error
            return;
        }

        localStorage.setItem("accessToken", authResult.accessToken);
        localStorage.setItem("profile", JSON.stringify(profile));

        console.log(profile);
        this.client.hide();
    }
}