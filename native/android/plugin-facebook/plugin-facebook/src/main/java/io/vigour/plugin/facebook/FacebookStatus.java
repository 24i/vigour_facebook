package io.vigour.plugin.facebook;

import com.facebook.AccessToken;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

/**
 * Created by michielvanliempt on 23/11/15.
 */
public class FacebookStatus {
    String status;
    Auth authResponse = new Auth();
    DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mmZ");


    public FacebookStatus() {
        status = "not connected";
        dateFormat.setTimeZone(TimeZone.getDefault());
    }

    public FacebookStatus(AccessToken token) {
        this();
        if (token == null) {
            return;
        }
        status = "connected";
        authResponse.accessToken = token.getToken();
        authResponse.userID = token.getUserId();
        authResponse.expires = token.getExpires();
    }

    public Auth getAuthResponse() {
        return authResponse;
    }

    public String getStatus() {
        return status;
    }

    public class Auth {
        String accessToken = "";
        String userID = "";
        Date expires = new Date();

        public String getAccessToken() {
            return accessToken;
        }

        public String getExpires() {
            return dateFormat.format(expires);
        }

        public String getUserID() {
            return userID;
        }
    }
}
