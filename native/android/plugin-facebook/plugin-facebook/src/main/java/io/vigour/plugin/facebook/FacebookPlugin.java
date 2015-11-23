package io.vigour.plugin.facebook;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.net.Uri;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.facebook.share.model.ShareLinkContent;
import com.facebook.share.widget.ShareDialog;

import java.util.Arrays;

import io.vigour.nativewrapper.plugin.core.Plugin;

/**
 * Created by michielvanliempt on 21/11/15.
 */
public class FacebookPlugin extends Plugin implements ActivityResultListener {
    private static final String NAME = "facebook";
    Activity activity;
    private LoginManager loginManager;
    public CallbackManager callbackManager;
    String status = "";

    public FacebookPlugin(Activity context) {
        super(NAME);
        activity = context;
    }

    public String init(String key) {
        FacebookSdk.sdkInitialize(activity.getApplicationContext());
        loginManager = LoginManager.getInstance();

        callbackManager = CallbackManager.Factory.create();

        LoginManager.getInstance().registerCallback(callbackManager,
                                                    new FacebookCallback<LoginResult>() {
                                                        @Override
                                                        public void onSuccess(LoginResult loginResult) {
                                                            status = "success " + loginResult.getAccessToken();
                                                        }

                                                        @Override
                                                        public void onCancel() {
                                                            status = "cancelled ";
                                                        }

                                                        @Override
                                                        public void onError(FacebookException exception) {
                                                            status = "error " + exception.toString();
                                                        }
                                                    });

        return "init called - login state: " + AccessToken.getCurrentAccessToken();
    }

    public String login(String scope) {
        loginManager.logInWithPublishPermissions(activity, Arrays.asList("publish_actions"));
        return "login called: " + AccessToken.getCurrentAccessToken();
    }

    public String logout() {
        loginManager.logOut();
        return "logout called: " + AccessToken.getCurrentAccessToken();
    }

    public String share(String url) {
        ShareLinkContent content = new ShareLinkContent.Builder()
                .setContentUrl(Uri.parse("https://developers.facebook.com"))
                .build();
        ShareDialog.show(activity, content);
        return "share called";
    }

    public String getToken() {
        AccessToken token = AccessToken.getCurrentAccessToken();
        if (token == null) {
            return "null";
        }

        return status + "\n" + String.format("%s %s %s", token.getToken(), token.getApplicationId(), token.getUserId());
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        callbackManager.onActivityResult(requestCode, resultCode, data);
    }
}
