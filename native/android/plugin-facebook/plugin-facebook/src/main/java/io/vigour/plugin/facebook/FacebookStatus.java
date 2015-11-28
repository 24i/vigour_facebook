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
    String connectionStatus;
    String token;
    String userId;

    public FacebookStatus() {
        connectionStatus = "unknown";
    }

    public FacebookStatus(AccessToken token) {
        this();
        if (token == null) {
            return;
        }
        connectionStatus = "connected";
        this.token = token.getToken();
        userId = token.getUserId();
    }

    public String getConnectionStatus() {
        return connectionStatus;
    }

    public String getToken() {
        return token;
    }

    public String getUserId() {
        return userId;
    }
}
