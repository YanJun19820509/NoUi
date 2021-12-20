package com.game.h5;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends AppCompatActivity {
    private WebView webview;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        //隐藏标题栏
        requestWindowFeature(Window.FEATURE_NO_TITLE);//隐藏状态栏
        //定义全屏参数
        int flag= WindowManager.LayoutParams.FLAG_FULLSCREEN;
        //设置当前窗体为全屏显示
        window.setFlags(flag, flag);

        //setContentView(R.layout.activity_main);
        //实例化WebView对象
        webview = new WebView(this);

        //[*关键的三行start]
        //设置WebView属性，能够执行Javascript脚本
        webview.getSettings().setJavaScriptEnabled(true);
        webview.getSettings().setAllowFileAccessFromFileURLs(true);
        webview.getSettings().setAllowUniversalAccessFromFileURLs(true);
        //[*关键的三行end]

        //加载需要显示的网页
        webview.loadUrl("https://anti-spoofing.oss-cn-hangzhou.aliyuncs.com/hjy/test/index.html");

//        系统默认会通过手机浏览器打开网页 为了能够直接通过WebView显示网页 必须设置
        webview.setWebViewClient(new WebViewClient(){
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url){
//                使用WebView加载显示url
                view.loadUrl(url);
                return true;
            }
        });
        //设置Web视图
        setContentView(webview);

        //  获取控件，组件ID名字
//        WebView webView = (WebView)findViewById(R.id.web_view);
//
////        调用JS，两句不加会出现错误
//        webView.getSettings().setJavaScriptEnabled(true);
//        webView.getSettings().setUseWideViewPort(true);
//
////        访问网页
//        webView.loadUrl("https://anti-spoofing.oss-cn-hangzhou.aliyuncs.com/hjy/test/index.html");
//
    }
}