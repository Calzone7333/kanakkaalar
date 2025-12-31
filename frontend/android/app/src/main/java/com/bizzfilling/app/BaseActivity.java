package com.bizzfilling.app;

import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkRequest;
import android.os.Build;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

public class BaseActivity extends AppCompatActivity {

    private ConnectivityManager connectivityManager;
    private ConnectivityManager.NetworkCallback networkCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
    }

    @Override
    protected void onResume() {
        super.onResume();
        registerNetworkCallback();
        // Check immediately on resume
        if (!isNetworkConnected()) {
            showNoInternetActivity();
        }
    }

    private boolean isNetworkConnected() {
        if (connectivityManager == null) return false;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Network network = connectivityManager.getActiveNetwork();
            if (network == null) return false;
            NetworkCapabilities actNw = connectivityManager.getNetworkCapabilities(network);
            return actNw != null && (actNw.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) ||
                    actNw.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) ||
                    actNw.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET));
        } else {
             android.net.NetworkInfo networkInfo = connectivityManager.getActiveNetworkInfo();
             return networkInfo != null && networkInfo.isConnected();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        unregisterNetworkCallback();
    }

    private void registerNetworkCallback() {
        if (connectivityManager == null) return;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            networkCallback = new ConnectivityManager.NetworkCallback() {
                @Override
                public void onLost(Network network) {
                    super.onLost(network);
                    runOnUiThread(() -> showNoInternetActivity());
                }
            };
            connectivityManager.registerDefaultNetworkCallback(networkCallback);
        } else {
            // For older devices, you might need a BroadcastReceiver, 
            // but for now we'll rely on the manual checks in the activities 
            // or assume API 24+ which covers most modern devices.
        }
    }

    private void unregisterNetworkCallback() {
        if (connectivityManager != null && networkCallback != null) {
            try {
                connectivityManager.unregisterNetworkCallback(networkCallback);
            } catch (Exception e) {
                // Already unregistered or failed
            }
        }
    }

    private void showNoInternetActivity() {
        // Avoid opening if already opened or if this IS the NoInternetActivity (though NoInternetActivity won't extend BaseActivity)
        if (!getClass().equals(NoInternetActivity.class)) {
            Intent intent = new Intent(this, NoInternetActivity.class);
            // Add flags to prevent stacking multiple instances if connection flickers
            intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP); 
            startActivity(intent);
        }
    }
}
