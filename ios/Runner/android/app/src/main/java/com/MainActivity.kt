import com.yandex.mapkit.MapKitFactory

class MainActivity: FlutterActivity() {
  override fun configureFlutterEngine(@NonNull flutterEngine: FlutterEngine) {
    MapKitFactory.setApiKey("YOUR_API_KEY") // Your generated API key
    super.configureFlutterEngine(flutterEngine)
  }
}
