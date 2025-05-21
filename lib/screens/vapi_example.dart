import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:habla_conmigo/api_key.dart';
import 'package:vapinew/vapinew.dart';

class VapiExample extends StatefulWidget {
  const VapiExample({super.key});

  @override
  _VapiExampleState createState() => _VapiExampleState();
}

class _VapiExampleState extends State<VapiExample> {
  String buttonText = 'Start Call';
  bool isLoading = false;
  bool isCallStarted = false;
  Vapi vapi = Vapi(vapiPublicKey);

  _VapiExampleState() {
    vapi.onEvent.listen((event) {
      if (event.label == "call-start") {
        setState(() {
          buttonText = 'End Call';
          isLoading = false;
          isCallStarted = true;
        });
        log('call started');
      }
      if (event.label == "call-end") {
        setState(() {
          buttonText = 'Start Call';
          isLoading = false;
          isCallStarted = false;
        });
        log('call ended');
      }
      if (event.label == "message") {
        log(event.value);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Test App'),
        ),
        body: Center(
          child: ElevatedButton(
            onPressed: isLoading
                ? null
                : () async {
                    setState(() {
                      buttonText = 'Loading...';
                      isLoading = true;
                    });

                    if (!isCallStarted) {
                      await vapi.start(assistant: {
                        "firstMessage": "Hello, I am an assistant.",
                        "model": {
                          "provider": "openai",
                          "model": "gpt-3.5-turbo",
                          "messages": [
                            {
                              "role": "system",
                              "content": "You are an assistant."
                            }
                          ]
                        },
                        "voice": "jennifer-playht"
                      });
                    } else {
                      await vapi.stop();
                    }
                  },
            child: Text(buttonText),
          ),
        ),
      ),
    );
  }
}
