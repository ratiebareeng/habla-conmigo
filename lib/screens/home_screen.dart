import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:habla_conmigo/models/chat.dart';
import 'package:habla_conmigo/providers/theme_provider.dart';
import 'package:habla_conmigo/services/mock_ai_service.dart';
import 'package:habla_conmigo/widgets/widgets.dart';
import 'package:provider/provider.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:uuid/uuid.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final List<Message> _messages = [];
  bool _isListening = false;
  bool _isSpeaking = false;
  bool _isLoading = false;
  final Topic _selectedTopic = Topic.general;
  final Difficulty _difficulty = Difficulty.beginner;
  String _transcript = '';
  String _voiceDebugInfo = '';

  // Speech recognition
  final stt.SpeechToText _speech = stt.SpeechToText();
  bool _speechAvailable = false;

  // Text-to-speech
  final FlutterTts _flutterTts = FlutterTts();
  bool _ttsAvailable = false;

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDark = themeProvider.isDarkMode;

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: const CustomAppBar(),
      body: SafeArea(
        child: Column(
          children: [
            Column(
              children: [
                // TTS warning if needed
                if (!_ttsAvailable)
                  Container(
                    margin: const EdgeInsets.only(top: 16),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.red[100],
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.red[400]!),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.warning_amber_rounded,
                            color: Colors.red[700]),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'Text-to-speech is not available. You\'ll see the text but won\'t hear speech.',
                            style: TextStyle(color: Colors.red[700]),
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),

            // Conversation area
            Expanded(
              child: ConversationArea(
                messages: _messages,
                currentTranscript: _isListening ? _transcript : '',
                onRetryAiSpeech: _handleRetryAiSpeech,
              ),
            ),

            // Voice controls
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: VoiceControls(
                isListening: _isListening,
                isSpeaking: _isSpeaking,
                isLoading: _isLoading,
                onToggleListening: _toggleListening,
                transcript: _transcript,
                onSendMessage: _handleSendMessage,
                onSkipAiSpeaking: _handleSkipSpeaking,
                onRetryLastSpeech: _handleRetryLastSpeech,
              ),
            ),

            // Debug info (can be removed in production)
            if (_voiceDebugInfo.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: Text(
                  'Debug: $_voiceDebugInfo',
                  style: const TextStyle(
                    fontSize: 12,
                    color: Colors.grey,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _speech.stop();
    _flutterTts.stop();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    _initSpeech();
    _initTts();

    // Add initial greeting
    _messages.add(
      Message(
        id: const Uuid().v4(),
        text: '¡Hola! ¿Cómo puedo ayudarte a practicar español hoy?',
        sender: MessageSender.ai,
        timestamp: DateTime.now(),
        type: MessageType.voice,
        audioDuration: 3.0,
      ),
    );

    // Speak initial greeting after a delay
    Future.delayed(const Duration(seconds: 1), () {
      _speak(_messages.first.text);
    });
  }

  // Retry speaking a specific AI message
  void _handleRetryAiSpeech(String messageId) {
    final message = _messages.firstWhere((m) => m.id == messageId);
    if (message.sender == MessageSender.ai) {
      _speak(message.text);
    }
  }

  // Retry speaking the last AI message
  void _handleRetryLastSpeech() {
    final lastAiMessage = _messages.lastWhere(
      (m) => m.sender == MessageSender.ai,
      orElse: () => _messages.first,
    );
    _speak(lastAiMessage.text);
  }

  // Send user message and get AI response
  void _handleSendMessage() {
    if (_transcript.trim().isEmpty) return;

    final userMessage = Message(
      id: const Uuid().v4(),
      text: _transcript,
      sender: MessageSender.user,
      timestamp: DateTime.now(),
    );

    setState(() {
      _messages.add(userMessage);
      _transcript = '';
      _isLoading = true;
    });

    // Simulate AI response with a delay
    Future.delayed(const Duration(seconds: 1), () {
      final aiResponseText = MockAiService.getMockResponse(
          _transcript, _selectedTopic, _difficulty);

      // Calculate mock duration based on text length
      final estimatedDuration =
          (aiResponseText.length / 15).clamp(3, double.infinity);

      final aiMessage = Message(
        id: const Uuid().v4(),
        text: aiResponseText,
        sender: MessageSender.ai,
        timestamp: DateTime.now(),
        type: MessageType.voice,
        audioDuration: estimatedDuration as double,
      );

      setState(() {
        _messages.add(aiMessage);
        _isLoading = false;
      });

      // Speak the AI response
      _speak(aiResponseText);
    });
  }

  // Skip AI speaking
  void _handleSkipSpeaking() async {
    if (_ttsAvailable) {
      await _flutterTts.stop();
      setState(() {
        _isSpeaking = false;
      });
    }
  }

  // Initialize speech recognition
  Future<void> _initSpeech() async {
    _speechAvailable = await _speech.initialize(
      onStatus: (status) {
        debugPrint('Speech recognition status: $status');
        if (status == 'done' && _isListening) {
          // When speech ends but we're still "listening", restart
          _startListening();
        }
      },
      onError: (error) => debugPrint('Speech recognition error: $error'),
    );
    setState(() {});
  }

  // Initialize text-to-speech
  Future<void> _initTts() async {
    await _flutterTts.setLanguage("es-ES");
    await _flutterTts.setSpeechRate(0.85); // Slower for learning
    await _flutterTts.setVolume(1.0);
    await _flutterTts.setPitch(1.0);

    _flutterTts.setStartHandler(() {
      setState(() {
        _isSpeaking = true;
      });
    });

    _flutterTts.setCompletionHandler(() {
      setState(() {
        _isSpeaking = false;
      });
    });

    _flutterTts.setErrorHandler((message) {
      setState(() {
        _isSpeaking = false;
        _voiceDebugInfo = 'TTS Error: $message';
      });
    });

    _ttsAvailable = true;
    setState(() {});
  }

  // Speak text
  Future<void> _speak(String text) async {
    if (!_ttsAvailable) {
      debugPrint('TTS not available');
      return;
    }

    try {
      // Cancel any ongoing speech first
      await _flutterTts.stop();
      await _flutterTts.speak(text);
    } catch (e) {
      setState(() {
        _voiceDebugInfo = 'Error speaking: $e';
      });
    }
  }

  // Start listening to speech
  void _startListening() {
    if (!_speechAvailable) return;

    _speech.listen(
      onResult: (result) {
        setState(() {
          _transcript = result.recognizedWords;
        });
      },
      listenFor: const Duration(seconds: 30),
      pauseFor: const Duration(seconds: 5),
      partialResults: true,
      localeId: 'es-ES',
      cancelOnError: true,
      listenMode: stt.ListenMode.confirmation,
    );
  }

  // Toggle listening state
  void _toggleListening() {
    if (_isListening) {
      _speech.stop();
      if (_transcript.trim().isNotEmpty) {
        _handleSendMessage();
      }
      setState(() {
        _isListening = false;
      });
    } else {
      setState(() {
        _transcript = '';
        _isListening = true;
      });
      _startListening();
    }
  }
}
