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
import rx.Observable;
import rx.Subscriber;

/**
 * Created by michielvanliempt on 21/11/15.
 */
public class FacebookPlugin extends Plugin implements ActivityResultListener {
    private static final String NAME = "facebook";
    private static final String TAG = NAME;
    Activity activity;
    private LoginManager loginManager;
    public CallbackManager callbackManager;
    FacebookStatus status = new FacebookStatus();

    public FacebookPlugin(Activity context) {
        super(NAME);
        activity = context;
    }

    public String init(String key) {
        Log.d(TAG, "init called, args: " + key);

        FacebookSdk.sdkInitialize(activity.getApplicationContext());
        loginManager = LoginManager.getInstance();

        callbackManager = CallbackManager.Factory.create();

        AccessToken token = AccessToken.getCurrentAccessToken();
        if (token != null) {
            return getString(new FacebookStatus(token));
        } else {
            return getString(new FacebookStatus());
        }
    }

    public Observable<String> login(Object scope) {
        Log.d(TAG, "login called, args: " + scope);

        return Observable.create(new Observable.OnSubscribe<String>() {
            @Override public void call(final Subscriber<? super String> subscriber) {
                Log.d(TAG, "login inside observable call");
                FacebookCallback<LoginResult> callback = new FacebookCallback<LoginResult>() {
                    @Override
                    public void onSuccess(LoginResult loginResult) {
                        Log.d(TAG, "login inside success");
                        AccessToken token = loginResult.getAccessToken();
                        status = new FacebookStatus(token);
                        subscriber.onNext(getString(status));
                        subscriber.onCompleted();
                    }

                    @Override
                    public void onCancel() {
                        Log.d(TAG, "login inside cancel");
                        subscriber.onError(new Throwable("user cancelled"));
                        subscriber.onCompleted();
                    }

                    @Override
                    public void onError(FacebookException exception) {
                        Log.d(TAG, "login inside error");
                        subscriber.onError(exception);
                        subscriber.onCompleted();
                    }
                };
                LoginManager.getInstance().registerCallback(callbackManager,
                                                            callback);
                loginManager.logInWithPublishPermissions(activity, Arrays.asList("publish_actions"));
            }
        });
    }

    public String logout() {
        loginManager.logOut();
        return "";
    }

    public String share(String url) {
        Log.d(TAG, "init called, args: " + url);
        ShareLinkContent content = new ShareLinkContent.Builder()
                .setContentUrl(Uri.parse("https://developers.facebook.com"))
                .build();
        ShareDialog.show(activity, content);
        return getString(status);
    }

    public String getToken() {
        status = new FacebookStatus(AccessToken.getCurrentAccessToken());
        return getString(status);
    }

    @Override public void onActivityResult(int requestCode, int resultCode, Object data) {
        Log.i(TAG, "onactivityresult");
        callbackManager.onActivityResult(requestCode, resultCode, (Intent) data);
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


}
