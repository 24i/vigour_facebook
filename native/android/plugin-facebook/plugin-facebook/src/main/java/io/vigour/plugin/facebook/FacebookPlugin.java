package io.vigour.plugin.facebook;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.facebook.share.model.ShareLinkContent;
import com.facebook.share.widget.ShareDialog;
import com.fasterxml.jackson.jr.ob.JSON;

import java.io.IOException;
import java.util.Arrays;

import io.vigour.nativewrapper.plugin.core.ActivityResultListener;
import io.vigour.nativewrapper.plugin.core.Plugin;

/**
 * Created by michielvanliempt on 21/11/15.
 */
public class FacebookPlugin extends Plugin implements ActivityResultListener {
    private static final String NAME = "facebook";
    private static final String TAG = NAME;
    Activity activity;
    private LoginManager loginManager;
    public CallbackManager callbackManager;
    FacebookStatus status;

    public FacebookPlugin(Activity context) {
        super(NAME);
        activity = context;
    }

    public String init(String key) {
        Log.d(TAG, "init called, args: " + key);

        FacebookSdk.sdkInitialize(activity.getApplicationContext());
        loginManager = LoginManager.getInstance();

        callbackManager = CallbackManager.Factory.create();

        LoginManager.getInstance().registerCallback(callbackManager,
                                                    new FacebookCallback<LoginResult>() {
                                                        @Override
                                                        public void onSuccess(LoginResult loginResult) {
                                                            AccessToken token = loginResult.getAccessToken();
                                                            update(token);
                                                        }

                                                        @Override
                                                        public void onCancel() {
                                                            update(null);
                                                        }

                                                        @Override
                                                        public void onError(FacebookException exception) {
                                                            update(exception);
                                                        }
                                                    });

        AccessToken token = AccessToken.getCurrentAccessToken();
        if (token != null) {
            return getString(new FacebookStatus(token));
        } else {
            return getString(new FacebookStatus());
        }
    }

    private void update(Object data) {
        if (data instanceof Throwable) {
            sendEvent(((Throwable) data).getMessage());
            data = null;
        }

        if (data == null) { // user said no
            status = new FacebookStatus();
        } else if (data instanceof AccessToken) {
            status = new FacebookStatus((AccessToken)data);
        } else {
            sendError("programming error in FacebookPlugin#update: unknown type");
            return;
        }

        sendEvent(getString(status));
    }

    private String getString(FacebookStatus status) {
        String message;
        try {
            message = JSON.std.asString(status);
        } catch (IOException e) {
            e.printStackTrace();
            sendError(e.getMessage());
            message = "";
        }
        return message;
    }

    public String login(Object scope) {
        Log.d(TAG, "login called, args: " + scope);
        loginManager.logInWithPublishPermissions(activity, Arrays.asList("publish_actions"));
        return "login called: " + AccessToken.getCurrentAccessToken();
    }

    public String logout() {
        loginManager.logOut();
        return "logout called: " + AccessToken.getCurrentAccessToken();
    }

    public String share(String url) {
        Log.d(TAG, "init called, args: " + url);
        ShareLinkContent content = new ShareLinkContent.Builder()
                .setContentUrl(Uri.parse("https://developers.facebook.com"))
                .build();
        ShareDialog.show(activity, content);
        return "share called";
    }

    public String getToken() {
        AccessToken token = AccessToken.getCurrentAccessToken();
        return getString(new FacebookStatus(token));
    }

    @Override public void onActivityResult(int requestCode, int resultCode, Object data) {
        callbackManager.onActivityResult(requestCode, resultCode, (Intent) data);
    }
}
