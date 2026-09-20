---
id: 1694253871677
created_at: 2023-09-09 18:05
slug: android-tips
---

## 对apk包签名

```bash
# 生成keystore
keytool -genkeypair -alias ybf4 -keyalg RSA -validity 4000 -keystore ~/keystore/ybb.keystore

# 对APK签名
cd ~/ybf4/src-cordova/platforms/android/app/build/outputs/apk/release/ ; jarsigner -verbose -keystore ~/keystore/ybb.keystore -signedjar app-release.apk app-release-unsigned.apk ybf4
```