package com.gunman.cosmicplasma

import android.os.Bundle
import android.view.View
import android.view.WindowInsetsController
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import com.google.firebase.Firebase
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.Query
import com.google.firebase.firestore.firestore
import org.json.JSONArray
import org.json.JSONObject

class WebAppInterface(private val context: android.content.Context, private val webView: WebView) {
    private val db = Firebase.firestore

    @JavascriptInterface
    fun pushScore(playerId: String, name: String, score: Double) {
        val playerData = hashMapOf(
            "name" to name,
            "score" to score.toLong(),
            "lastUpdated" to FieldValue.serverTimestamp()
        )
        db.collection("leaderboard").document(playerId).set(playerData)
    }

    @JavascriptInterface
    fun fetchLeaderboard() {
        db.collection("leaderboard")
            .orderBy("score", Query.Direction.DESCENDING)
            .limit(100)
            .get()
            .addOnSuccessListener { documents ->
                val jsonArray = JSONArray()
                for (document in documents) {
                    val obj = JSONObject()
                    obj.put("name", document.getString("name") ?: "Unknown")
                    obj.put("score", document.getLong("score") ?: 0L)
                    jsonArray.put(obj)
                }
                webView.post {
                    webView.evaluateJavascript(
                        "window.updateLeaderboardFromAndroid(${jsonArray})", null
                    )
                }
            }
            .addOnFailureListener { }
    }

    @JavascriptInterface
    fun exitApp() {
        if (context is ComponentActivity) {
            context.finish()
        }
    }
}

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            AndroidView(
                modifier = Modifier.fillMaxSize(),
                factory = { context ->
                    WebView(context).apply {
                        webChromeClient = WebChromeClient()
                        webViewClient = WebViewClient()
                        settings.apply {
                            javaScriptEnabled = true
                            domStorageEnabled = true
                            allowFileAccess = true
                        }
                        addJavascriptInterface(WebAppInterface(context, this), "Android")
                        loadUrl("file:///android_asset/index.html")
                    }
                },
                update = { webView ->
                    onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
                        override fun handleOnBackPressed() {
                            if (webView.canGoBack()) {
                                webView.goBack()
                            } else {
                                finish()
                            }
                        }
                    })
                }
            )
        }
    }

    @Suppress("DEPRECATION")
    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) {
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
                window.setDecorFitsSystemWindows(false)
                window.insetsController?.let {
                    it.hide(android.view.WindowInsets.Type.statusBars() or android.view.WindowInsets.Type.navigationBars())
                    it.systemBarsBehavior = WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                }
            } else {
                window.decorView.systemUiVisibility = (
                    View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        or View.SYSTEM_UI_FLAG_FULLSCREEN
                        or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                )
            }
        }
    }
}
