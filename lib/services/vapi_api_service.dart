import 'package:vapi/Vapi.dart';

class VapiApiService {
  static final VapiApiService _instance = VapiApiService._internal();

  static VapiApiService get instance => _instance;

  var vapi = Vapi('your-public-key');

  factory VapiApiService() => _instance;

  VapiApiService._internal();
}
