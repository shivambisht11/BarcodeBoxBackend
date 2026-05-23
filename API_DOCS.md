# BarcodeBox — Backend API Documentation

> **Base URL (Production):** `https://barcode-box-backend.vercel.app`
> **Base URL (Local Dev):** `http://localhost:3000`

---

## Overview

The BarcodeBox backend provides 2 main API endpoints for the Android app:

| # | Endpoint | Method | Purpose |
|---|----------|--------|---------|
| 1 | `/api/generate-qr` | POST | Generate a QR code image (base64 PNG) |
| 2 | `/api/create-message` | POST | Create a Smart Text page & get its URL |
| 3 | `/api/health` | GET | Health check (is server alive?) |

The Android app also uses:
- **`/m/{slug}`** — This is a web page (NOT an API). When a Smart Text QR is scanned, it opens this beautiful page in the browser showing the message.

---

## 1. Generate QR Code

Creates a QR code image for any URL or text and returns it as a **base64 PNG data URL**.

### Request

```
POST /api/generate-qr
Content-Type: application/json
```

#### Body

```json
{
  "text": "https://example.com"
}
```

| Field | Type | Required | Max Length | Description |
|-------|------|----------|-----------|-------------|
| `text` | `string` | ✅ Yes | 2000 chars | The URL or text to encode in the QR code |

### Response — Success (200)

```json
{
  "qrBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAA..."
}
```

| Field | Type | Description |
|-------|------|-------------|
| `qrBase64` | `string` | Base64-encoded PNG image as a data URL. Can be directly loaded in an `ImageView` using a library like Glide/Coil. |

### Response — Errors

| Status | Body | When |
|--------|------|------|
| 400 | `{ "error": "Text is required and must be a non-empty string" }` | Empty or missing `text` |
| 400 | `{ "error": "Text must be 2000 characters or less" }` | `text` exceeds 2000 chars |
| 500 | `{ "error": "Failed to generate QR code" }` | Server-side error |

### Android Usage Example (Kotlin + Retrofit)

```kotlin
// --- Data Classes ---
data class GenerateQrRequest(val text: String)
data class GenerateQrResponse(val qrBase64: String)

// --- Retrofit Interface ---
interface BarcodeBoxApi {
    @POST("/api/generate-qr")
    suspend fun generateQr(@Body request: GenerateQrRequest): GenerateQrResponse
}

// --- Usage in ViewModel ---
val response = api.generateQr(GenerateQrRequest("https://example.com"))
val base64String = response.qrBase64
// Remove "data:image/png;base64," prefix before decoding
val imageBytes = Base64.decode(
    base64String.substringAfter("base64,"), 
    Base64.DEFAULT
)
val bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
// Now set bitmap to ImageView
```

### QR Code Specs

| Property | Value |
|----------|-------|
| Image size | 400 × 400 px |
| Format | PNG |
| QR dark color | `#1a1a2e` (dark navy) |
| QR light color | `#ffffff` (white) |
| Error correction | Medium (M) |
| Margin | 2 modules |

---

## 2. Create Smart Text Message

Creates a hosted message page and returns the URL. The user's text message will be displayed on a beautiful gradient webpage at `/m/{slug}`. The QR code for this URL can then be generated using the `/api/generate-qr` endpoint.

> **Note:** Messages auto-expire after **30 days** (stored in Vercel KV with TTL).

### Request

```
POST /api/create-message
Content-Type: application/json
```

#### Body

```json
{
  "text": "Happy Birthday! 🎂 Wishing you all the best."
}
```

| Field | Type | Required | Max Length | Description |
|-------|------|----------|-----------|-------------|
| `text` | `string` | ✅ Yes | 500 chars | The message text to host on the smart page |

### Response — Success (200)

```json
{
  "url": "https://barcode-box-backend.vercel.app/m/xK9mZp2A",
  "slug": "xK9mZp2A"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `url` | `string` | Full URL of the hosted message page. **Use this as input to `/api/generate-qr` to get the QR code.** |
| `slug` | `string` | 8-character unique identifier for the message |

### Response — Errors

| Status | Body | When |
|--------|------|------|
| 400 | `{ "error": "Text is required and must be a non-empty string" }` | Empty or missing `text` |
| 400 | `{ "error": "Text must be 500 characters or less" }` | `text` exceeds 500 chars |
| 503 | `{ "error": "Smart Text feature is not configured. Please set up Vercel KV." }` | Server's KV env vars missing |
| 500 | `{ "error": "Failed to create smart text message" }` | Server-side error |

### Android Usage Example (Kotlin + Retrofit)

```kotlin
// --- Data Classes ---
data class CreateMessageRequest(val text: String)
data class CreateMessageResponse(val url: String, val slug: String)

// --- Retrofit Interface ---
interface BarcodeBoxApi {
    @POST("/api/create-message")
    suspend fun createMessage(@Body request: CreateMessageRequest): CreateMessageResponse
}

// --- Usage: Smart Text Flow (ViewModel) ---
// Step 1: Create the message page
val messageResponse = api.createMessage(
    CreateMessageRequest("Happy Birthday! 🎂")
)
// messageResponse.url = "https://barcode-box-backend.vercel.app/m/xK9mZp2A"

// Step 2: Generate QR for that URL
val qrResponse = api.generateQr(
    GenerateQrRequest(messageResponse.url)
)
// qrResponse.qrBase64 = "data:image/png;base64,..."

// Step 3: Show QR code to user & allow download/share
```

---

## 3. Health Check

Simple endpoint to check if the backend is running.

### Request

```
GET /api/health
```

### Response — Success (200)

```json
{
  "status": "ok",
  "timestamp": "2026-05-23T07:30:00.000Z"
}
```

### Android Usage

```kotlin
// Use this on app startup to verify backend connectivity
interface BarcodeBoxApi {
    @GET("/api/health")
    suspend fun healthCheck(): HealthResponse
}

data class HealthResponse(val status: String, val timestamp: String)
```

---

## Smart Text Page (Web Page — Not API)

### `GET /m/{slug}`

This is a **web page**, not a JSON API. When someone scans the Smart Text QR code:

1. The QR code contains a URL like `https://barcode-box-backend.vercel.app/m/xK9mZp2A`
2. Scanning opens this URL in the phone's browser
3. The page displays the message text on a **beautiful purple gradient background** with smooth animations
4. If the message has expired (30 days), it shows an "Expired" error page

**The app does NOT need to call this endpoint** — it's for the person scanning the QR code.

---

## Complete Retrofit Setup

### `ApiClient.kt`

```kotlin
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object ApiClient {
    private const val BASE_URL = "https://barcode-box-backend.vercel.app/"

    val api: BarcodeBoxApi by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(BarcodeBoxApi::class.java)
    }
}
```

### `BarcodeBoxApi.kt`

```kotlin
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface BarcodeBoxApi {

    @POST("/api/generate-qr")
    suspend fun generateQr(@Body request: GenerateQrRequest): GenerateQrResponse

    @POST("/api/create-message")
    suspend fun createMessage(@Body request: CreateMessageRequest): CreateMessageResponse

    @GET("/api/health")
    suspend fun healthCheck(): HealthResponse
}

// --- Request Models ---
data class GenerateQrRequest(val text: String)
data class CreateMessageRequest(val text: String)

// --- Response Models ---
data class GenerateQrResponse(val qrBase64: String)
data class CreateMessageResponse(val url: String, val slug: String)
data class HealthResponse(val status: String, val timestamp: String)
```

### `Base64 Image Helper`

```kotlin
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Base64

fun decodeBase64ToBitmap(dataUrl: String): Bitmap {
    val base64String = dataUrl.substringAfter("base64,")
    val imageBytes = Base64.decode(base64String, Base64.DEFAULT)
    return BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
}

// Usage:
// val bitmap = decodeBase64ToBitmap(response.qrBase64)
// imageView.setImageBitmap(bitmap)
```

---

## App Feature → API Mapping

| App Feature | API Calls Needed | Flow |
|-------------|-----------------|------|
| **Scan QR/Barcode** | ❌ None | Uses device camera + ML Kit / ZXing. No backend needed. |
| **Generate QR (URL/text)** | `POST /api/generate-qr` | Send text → get base64 image → display & allow save/share |
| **Smart Text QR** | `POST /api/create-message` → `POST /api/generate-qr` | Create message page → get URL → generate QR for URL → display |
| **History** | ❌ None | Store locally in Room DB or SharedPreferences |
| **Share QR** | ❌ None | Save bitmap to cache → use Android Share Intent |

---

## Gradle Dependencies Needed

```groovy
// build.gradle (app)
dependencies {
    // Networking
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    implementation 'com.squareup.okhttp3:logging-interceptor:4.12.0'
    
    // Image loading (for base64 QR display)
    implementation 'io.coil-kt:coil-compose:2.6.0'  // If using Compose
    // OR
    implementation 'com.github.bumptech.glide:glide:4.16.0'  // If using XML views
    
    // QR/Barcode Scanning
    implementation 'com.google.mlkit:barcode-scanning:17.2.0'
    // OR
    implementation 'com.journeyapps:zxing-android-embedded:4.3.0'
}
```

---

## Error Handling Pattern

All error responses follow the same format:

```json
{
  "error": "Human-readable error message"
}
```

```kotlin
// Retrofit error handling
try {
    val response = api.generateQr(GenerateQrRequest(text))
    // Success — use response.qrBase64
} catch (e: HttpException) {
    val errorBody = e.response()?.errorBody()?.string()
    val error = Gson().fromJson(errorBody, ErrorResponse::class.java)
    showToast(error.error) // Show server error message
} catch (e: IOException) {
    showToast("No internet connection")
}

data class ErrorResponse(val error: String)
```