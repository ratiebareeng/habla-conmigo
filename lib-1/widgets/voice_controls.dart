import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';

import '../providers/theme_provider.dart';

class VoiceControls extends StatelessWidget {
  final bool isListening;
  final bool isSpeaking;
  final bool isLoading;
  final VoidCallback onToggleListening;
  final String transcript;
  final VoidCallback onSendMessage;
  final VoidCallback? onSkipAiSpeaking;
  final VoidCallback? onRetryLastSpeech;

  const VoiceControls({
    super.key,
    required this.isListening,
    required this.isSpeaking,
    required this.isLoading,
    required this.onToggleListening,
    required this.transcript,
    required this.onSendMessage,
    this.onSkipAiSpeaking,
    this.onRetryLastSpeech,
  });

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDark = themeProvider.isDarkMode;

    // Determine if we're on a mobile device
    final isMobile = MediaQuery.of(context).size.width < 600;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark
            ? const Color(0xFF1E293B) // slate-800
            : Colors.white.withOpacity(0.8),
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Column(
        children: [
          // Main controls row
          Row(
            children: [
              // Mic and additional control buttons
              Row(
                children: [
                  // Mic button
                  ElevatedButton(
                    onPressed: isLoading ? null : onToggleListening,
                    style: ElevatedButton.styleFrom(
                      backgroundColor:
                          isListening ? Colors.red[500] : Colors.blue[500],
                      foregroundColor: Colors.white,
                      shape: const CircleBorder(),
                      padding: EdgeInsets.all(isMobile ? 16 : 20),
                      disabledBackgroundColor: Colors.grey[400],
                    ),
                    child: Icon(
                      isListening ? Icons.mic_off : Icons.mic,
                      size: isMobile ? 24 : 28,
                    ),
                  ).animate(target: isListening ? 1 : 0).shimmer(
                        duration: 1.5.seconds,
                        delay: 200.ms,
                        curve: Curves.easeInOut,
                      ),

                  if (!isMobile) const SizedBox(width: 12),

                  // Secondary button (shows loading, speaking, or retry)
                  if (isLoading)
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.orange[500],
                        shape: BoxShape.circle,
                      ),
                      child: SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 3,
                        ),
                      ),
                    )
                  else if (isSpeaking && onSkipAiSpeaking != null)
                    ElevatedButton.icon(
                      onPressed: onSkipAiSpeaking,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green[500],
                        foregroundColor: Colors.white,
                        shape: const StadiumBorder(),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 12,
                        ),
                      ),
                      icon: const Icon(Icons.volume_up, size: 20),
                      label: const Icon(Icons.skip_next, size: 16),
                    )
                  else if (onRetryLastSpeech != null && !isListening)
                    ElevatedButton(
                      onPressed: onRetryLastSpeech,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.orange[500],
                        foregroundColor: Colors.white,
                        shape: const CircleBorder(),
                        padding: const EdgeInsets.all(16),
                      ),
                      child: const Icon(Icons.refresh, size: 20),
                    ),
                ],
              ),

              const SizedBox(width: 16),

              // Text area
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                  decoration: BoxDecoration(
                    color: isDark ? Colors.grey[800] : Colors.grey[100],
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(
                          _getDisplayText(),
                          style: TextStyle(
                            color: _getTextColor(isDark),
                            fontWeight: isListening ? FontWeight.w500 : null,
                          ),
                          overflow: TextOverflow.ellipsis,
                          maxLines: 1,
                        ),
                      ),
                      if (transcript.isNotEmpty && !isLoading)
                        IconButton(
                          onPressed: onSendMessage,
                          icon: const Icon(Icons.send),
                          color: Colors.orange[500],
                          iconSize: 20,
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                        ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          // Audio wave indicator when listening
          if (isListening)
            Padding(
              padding: const EdgeInsets.only(top: 8.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(5, (index) {
                  return Container(
                    width: 4,
                    height: 16,
                    margin: const EdgeInsets.symmetric(horizontal: 2),
                    decoration: BoxDecoration(
                      color: Colors.blue[500],
                      borderRadius: BorderRadius.circular(2),
                    ),
                  )
                      .animate(
                        onPlay: (controller) => controller.repeat(),
                      )
                      .scaleY(
                        duration: 800.ms,
                        delay: Duration(milliseconds: index * 100),
                        curve: Curves.easeInOut,
                        begin: 0.3,
                        end: 1.0,
                      )
                      .then()
                      .scaleY(
                        duration: 800.ms,
                        curve: Curves.easeInOut,
                        begin: 1.0,
                        end: 0.3,
                      );
                }),
              ),
            ),
        ],
      ),
    );
  }

  // Helper method to get the display text
  String _getDisplayText() {
    if (transcript.isNotEmpty) {
      return transcript;
    }

    if (isLoading) {
      return 'Procesando respuesta...';
    }

    if (isListening) {
      return 'Escuchando... Habla en español';
    }

    return 'Presiona el micrófono para hablar';
  }

  // Helper method to get the text color
  Color _getTextColor(bool isDark) {
    if (transcript.isNotEmpty) {
      return isDark ? Colors.white : Colors.black87;
    }

    if (isLoading) {
      return Colors.orange[500]!;
    }

    if (isListening) {
      return Colors.green[500]!;
    }

    return isDark ? Colors.grey[400]! : Colors.grey[600]!;
  }
}
