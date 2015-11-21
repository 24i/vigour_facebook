package io.vigour.plugin.facebook;

import android.content.Context;

import io.vigour.nativewrapper.plugin.core.Plugin;

/**
 * Created by michielvanliempt on 21/11/15.
 */
public class FacebookPlugin extends Plugin {
    private static final String NAME = "facebook";

    public FacebookPlugin(Context context) {
        super(NAME);
    }

    public String init(String key) {
        return "init not implemented yet";
    }

    public String login(String scope) {
        return "login not implemented yet";
    }

    public String logout() {
        return "logout not implemented yet";
    }

    public String share(String url) {
        return "share not implemented yet";
    }
}
