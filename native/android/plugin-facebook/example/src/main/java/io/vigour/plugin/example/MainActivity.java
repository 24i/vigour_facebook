package io.vigour.plugin.example;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.widget.TextView;

import java.util.HashMap;
import java.util.Map;

import butterknife.Bind;
import butterknife.ButterKnife;
import butterknife.OnClick;
import io.vigour.nativewrapper.plugin.core.BridgeEvents;
import io.vigour.plugin.facebook.FacebookPlugin;
import rx.Observer;

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

            @Override public void receive(String event, String data, String pluginId) {
                eventView.setText(event + ": " + data);
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
        plugin.login("").subscribe(new Observer<String>() {
            @Override public void onCompleted() {
                eventView.setText("completed");
            }

            @Override public void onError(Throwable e) {
                outputView.setText("login error: " + e.getMessage());
            }

            @Override public void onNext(String s) {
                outputView.setText("login result: " + s);
            }
        });
    }

    @OnClick(R.id.logout)
    public void logout() {
        feedback(plugin.logout());
    }

    @OnClick(R.id.share)
    public void log() {
        Map<String, Object> map = new HashMap<>();
        map.put("url", "vigour.io");
        feedback(plugin.share(map));
    }

    @OnClick(R.id.token)
    public void token() { feedback(plugin.getToken());}

    private void feedback(String message) {
        outputView.setText(message);
    }
}
