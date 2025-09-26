// plugins/assets/SnackBar/SnackbarModule.java

package com.azendoo.reactnativesnackbar;

// All necessary imports
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.google.android.material.snackbar.Snackbar;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SnackbarModule extends ReactContextBaseJavaModule {

    private final List<Snackbar> mActiveSnackbars = new ArrayList<>();

    public SnackbarModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "RNSnackbar";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("LENGTH_LONG", Snackbar.LENGTH_LONG);
        constants.put("LENGTH_SHORT", Snackbar.LENGTH_SHORT);
        constants.put("LENGTH_INDEFINITE", Snackbar.LENGTH_INDEFINITE);
        return constants;
    }

    @ReactMethod
    public void show(ReadableMap options, final Callback callback) {
        View view = getCurrentActivity().getWindow().getDecorView().findViewById(android.R.id.content);
        if (view == null) return;
        mActiveSnackbars.clear();
        displaySnackbar(view, options);
    }

    @ReactMethod
    public void dismiss() {
        for (Snackbar snackbar : mActiveSnackbars) {
            if (snackbar != null) snackbar.dismiss();
        }
        mActiveSnackbars.clear();
    }

    private void displaySnackbar(View view, ReadableMap options) {
        String text = getOptionValue(options, "text", "");
        int duration = getOptionValue(options, "duration", Snackbar.LENGTH_SHORT);
        final Snackbar snackbar = Snackbar.make(view, "", duration);
        Snackbar.SnackbarLayout snackbarLayout = (Snackbar.SnackbarLayout) snackbar.getView();
        mActiveSnackbars.add(snackbar);

        snackbarLayout.setBackgroundColor(Color.TRANSPARENT);
        snackbarLayout.setPadding(0, 0, 0, 0);

        android.view.ViewGroup.LayoutParams lp = snackbarLayout.getLayoutParams();
        if (lp instanceof FrameLayout.LayoutParams) {
            FrameLayout.LayoutParams params = (FrameLayout.LayoutParams) lp;
            params.gravity = Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL;
            params.width = FrameLayout.LayoutParams.WRAP_CONTENT;

            int bottomMarginInDp = getOptionValue(options, "marginBottom", 16);
            
            float scale = view.getResources().getDisplayMetrics().density;
            int horizontalMarginInPx = (int) (16 * scale + 0.5f);
            int bottomMarginInPx = (int) (bottomMarginInDp * scale + 0.5f);

            params.setMargins(horizontalMarginInPx, horizontalMarginInPx, horizontalMarginInPx, bottomMarginInPx);
            snackbarLayout.setLayoutParams(params);
        }

        LayoutInflater inflater = LayoutInflater.from(view.getContext());
        int layoutId = getReactApplicationContext().getResources().getIdentifier("custom_snackbar_view", "layout", getReactApplicationContext().getPackageName());
        View customView = inflater.inflate(layoutId, null);

        GradientDrawable shape = new GradientDrawable();
        shape.setShape(GradientDrawable.RECTANGLE);
        shape.setCornerRadius(14.4f * view.getResources().getDisplayMetrics().density);

        int backgroundColor = Color.parseColor("#333333");
        if (options.hasKey("backgroundColor")) {
            ReadableType type = options.getType("backgroundColor");
            if (type == ReadableType.Number) {
                backgroundColor = options.getInt("backgroundColor");
            } else if (type == ReadableType.String) {
                try {
                    backgroundColor = Color.parseColor(options.getString("backgroundColor"));
                } catch (IllegalArgumentException e) {
                    e.printStackTrace();
                }
            }
        }
        shape.setColor(backgroundColor);
        customView.setBackground(shape);

        TextView snackbarText = customView.findViewById(getReactApplicationContext().getResources().getIdentifier("snackbar_text", "id", getReactApplicationContext().getPackageName()));
        ImageView snackbarIcon = customView.findViewById(getReactApplicationContext().getResources().getIdentifier("snackbar_icon", "id", getReactApplicationContext().getPackageName()));
        ImageView snackbarCloseIcon = customView.findViewById(getReactApplicationContext().getResources().getIdentifier("snackbar_close_icon", "id", getReactApplicationContext().getPackageName()));

        snackbarText.setText(text);
        if (options.hasKey("textColor")) snackbarText.setTextColor(options.getInt("textColor"));
        
        if (options.hasKey("icon")) {
            int iconId = getResourceId(options.getString("icon"), "drawable");
            if (iconId != 0) {
                snackbarIcon.setImageResource(iconId);
                snackbarIcon.setVisibility(View.VISIBLE);
            }
        } else {
            snackbarIcon.setVisibility(View.GONE);
        }

        if (options.hasKey("closeIcon")) {
            int closeIconId = getResourceId(options.getString("closeIcon"), "drawable");
            if (closeIconId != 0) {
                snackbarCloseIcon.setImageResource(closeIconId);
                snackbarCloseIcon.setVisibility(View.VISIBLE);
                snackbarCloseIcon.setOnClickListener(v -> snackbar.dismiss());
            }
        } else {
            snackbarCloseIcon.setVisibility(View.GONE);
        }

        snackbarLayout.addView(customView, 0);
        snackbar.show();
    }
    
    private int getResourceId(String name, String type) {
        return getReactApplicationContext().getResources().getIdentifier(name, type, getReactApplicationContext().getPackageName());
    }

    private String getOptionValue(ReadableMap options, String key, String fallback) {
        return options.hasKey(key) ? options.getString(key) : fallback;
    }

    private int getOptionValue(ReadableMap options, String key, int fallback) {
        return options.hasKey(key) ? options.getInt(key) : fallback;
    }
    
    @ReactMethod public void addListener(String eventName) {}
    @ReactMethod public void removeListeners(Integer count) {}
}