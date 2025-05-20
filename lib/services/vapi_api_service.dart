import 'dart:developer';

import 'package:habla_conmigo/api_key.dart';
import 'package:vapi/Vapi.dart';

class VapiApiService {
  static final VapiApiService _instance = VapiApiService._internal();

  static VapiApiService get instance => _instance;

  var vapi = Vapi(vapiPublicKey);

  factory VapiApiService() => _instance;

  VapiApiService._internal();

  // listen to the Vapi call
  Stream<VapiEvent> listen() {
    return vapi.onEvent.map((event) {
      if (event.label == "call-start") {
        log('call started');
      }
      if (event.label == "call-end") {
        log('call ended');
      }

      // Speech statuses, function calls and transcripts will be sent via messages
      if (event.label == "message") {
        log(event.value);
      }
      return event;
    });
  }

  // Mute user mic
  void muteMic(bool mute) {
    vapi.setMuted(mute);
  }

  // Start the Vapi call
  Future<void> start({
    String? assistantId,
    dynamic assistant,
    dynamic assistantOverrides = const {},
  }) async {
    await vapi.start(assistant: vapiAssistantRaul);
  }

  // Stop the Vapi call
  Future<void> stop() async {
    await vapi.stop();
  }
}
