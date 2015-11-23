package io.vigour.plugin.facebook;

import android.content.Intent;

/**
 * Created by michielvanliempt on 22/11/15.
 */
public interface ActivityResultListener {
    void onActivityResult(int requestCode, int resultCode, Intent data);
}
