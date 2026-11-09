package ph.serv.marketplace;

import android.app.Activity;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import java.io.IOException;
import java.util.Collections;
import java.util.regex.Pattern;

public final class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + HOST + "/index.html";
    private static final int PAPER = 0xfff8f7f3;
    private static final int WELCOME = 0xff0d1516;
    private static final Pattern IMAGE = Pattern.compile("/assets/[a-z0-9-]+\\.(webp|svg)");
    private FrameLayout root;
    private WebView webView;
    private boolean keyboardVisible;

    @Override
    public void onCreate(Bundle state) {
        super.onCreate(state);
        root = new FrameLayout(this);
        webView = new WebView(this);
        root.addView(webView, new FrameLayout.LayoutParams(-1, -1));
        setContentView(root);
        configureInsets();
        setWelcomeStyle(true);

        WebSettings settings = webView.getSettings();
        settings.setUserAgentString(settings.getUserAgentString() + " SERV-Android");
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        webView.setBackgroundColor(android.graphics.Color.TRANSPARENT);
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new OfflineClient());
        webView.addJavascriptInterface(new Appearance(), "ServNative");
        if (state == null || webView.restoreState(state) == null) {
            webView.loadUrl(START_URL);
        }
    }

    @SuppressWarnings("deprecation")
    private void configureInsets() {
        if (Build.VERSION.SDK_INT < 30) return;
        Window window = getWindow();
        window.setDecorFitsSystemWindows(false);
        window.setStatusBarColor(android.graphics.Color.TRANSPARENT);
        window.setNavigationBarColor(android.graphics.Color.TRANSPARENT);
        window.setNavigationBarContrastEnforced(false);
        root.setOnApplyWindowInsetsListener((view, insets) -> {
            Insets safe = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
            int keyboard = insets.getInsets(WindowInsets.Type.ime()).bottom;
            view.setPadding(safe.left, safe.top, safe.right, Math.max(safe.bottom, keyboard));
            boolean showing = insets.isVisible(WindowInsets.Type.ime());
            if (showing != keyboardVisible) {
                keyboardVisible = showing;
                syncKeyboard();
            }
            return WindowInsets.CONSUMED;
        });
        root.requestApplyInsets();
    }

    private void syncKeyboard() {
        webView.evaluateJavascript(
            "document.documentElement.classList.toggle('native-keyboard', " + keyboardVisible + ")", null);
    }

    @SuppressWarnings("deprecation")
    private void setWelcomeStyle(boolean welcome) {
        int color = welcome ? WELCOME : PAPER;
        root.setBackgroundColor(color);
        Window window = getWindow();
        if (Build.VERSION.SDK_INT >= 30) {
            int light = WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
                | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS;
            WindowInsetsController controller = window.getInsetsController();
            if (controller != null) controller.setSystemBarsAppearance(welcome ? 0 : light, light);
        } else {
            window.setStatusBarColor(color);
            window.setNavigationBarColor(color);
            int light = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
            window.getDecorView().setSystemUiVisibility(welcome ? 0 : light);
        }
    }

    public final class Appearance {
        @JavascriptInterface
        public void setWelcome(boolean welcome) {
            runOnUiThread(() -> setWelcomeStyle(welcome));
        }
    }

    private static boolean isLocal(Uri uri) {
        return "https".equals(uri.getScheme()) && HOST.equals(uri.getHost())
            && uri.getPort() == -1 && uri.getUserInfo() == null;
    }

    private final class OfflineClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            return !isLocal(uri) || !"/index.html".equals(uri.getPath());
        }

        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            String path = uri.getPath();
            if (!isLocal(uri) || !"GET".equals(request.getMethod()) || path == null) return notFound();
            String mime;
            switch (path) {
                case "/index.html": mime = "text/html"; break;
                case "/app.js": mime = "text/javascript"; break;
                case "/assets/nav-glass.js":
                case "/assets/liquidglass-1.0.3.js": mime = "text/javascript"; break;
                case "/styles.css": mime = "text/css"; break;
                default:
                    if (!IMAGE.matcher(path).matches()) return notFound();
                    mime = path.endsWith(".svg") ? "image/svg+xml" : "image/webp";
            }
            try {
                return new WebResourceResponse(mime, mime.startsWith("image/") ? null : "UTF-8",
                    200, "OK", Collections.singletonMap("Cache-Control", "no-store"),
                    getAssets().open(path.substring(1)));
            } catch (IOException error) {
                return notFound();
            }
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            syncKeyboard();
        }
    }

    private static WebResourceResponse notFound() {
        return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found",
            Collections.emptyMap(), null);
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        webView.evaluateJavascript(
            "(function(){var dialog=document.querySelector('dialog[open]');" +
                "if(!dialog)return false;dialog.querySelector('.close-button').click();return true;})()",
            result -> {
                if ("true".equals(result)) return;
                if (webView.canGoBack()) webView.goBack();
                else super.onBackPressed();
            });
    }

    @Override
    protected void onSaveInstanceState(Bundle state) {
        super.onSaveInstanceState(state);
        webView.saveState(state);
    }

    @Override
    protected void onDestroy() {
        root.removeView(webView);
        webView.destroy();
        super.onDestroy();
    }
}
