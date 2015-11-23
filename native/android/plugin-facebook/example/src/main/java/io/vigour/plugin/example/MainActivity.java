package io.vigour.plugin.example;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.widget.TextView;

import butterknife.Bind;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.vigour.nativewrapper.plugin.core.BridgeEvents;
import io.vigour.plugin.facebook.FacebookPlugin;

public class MainActivity extends AppCompatActivity {

    FacebookPlugin plugin;
    @Bind(R.id.output) TextView outputView;
    @Bind(R.id.event) TextView eventView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ButterKnife.bind(this);

        plugin = new FacebookPlugin(this);
        plugin.setEventInterface(new BridgeEvents() {
            @Override public void error(String error, String pluginId) {
                eventView.setText(error);
                eventView.setTextColor(0xffff0000);
            }

            @Override public void receive(String error, String message, String pluginId) {
                if (error != null && error.length() > 0) {
                    error(error, pluginId);
                    return;
                }
                eventView.setText(message);
                eventView.setTextColor(0x99000000);
            }
        });

        feedback(plugin.init("whatever1234"));

    }

    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        plugin.onActivityResult(requestCode, resultCode, data);
    }

    @OnClick(R.id.login)
    public void login() {
        feedback(plugin.login(""));
    }

    @OnClick(R.id.logout)
    public void logout() {
        feedback(plugin.logout());
    }

    @OnClick(R.id.share)
    public void log() {
        feedback(plugin.share("vigour.io"));
    }

    @OnClick(R.id.token)
    public void token() { feedback(plugin.getToken());}

    private void feedback(String message) {
        outputView.setText(message);
    }
}
