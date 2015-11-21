package io.vigour.plugin.example;

import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.widget.TextView;

import butterknife.Bind;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.vigour.plugin.facebook.FacebookPlugin;

public class MainActivity extends ActionBarActivity {

    FacebookPlugin plugin;
    @Bind(R.id.output) TextView outputView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        plugin = new FacebookPlugin(this);
        plugin.init("whatever1234");

        ButterKnife.bind(this);
    }

    @OnClick(R.id.login)
    public void login() {
        feedback(plugin.login(""));
    }

    private void feedback(String message) {
        outputView.setText(message);
    }

    @OnClick(R.id.logout)
    public void logout() {
        feedback(plugin.logout());
    }

    @OnClick(R.id.share)
    public void log() {
        feedback(plugin.share("vigour.io"));
    }
}
