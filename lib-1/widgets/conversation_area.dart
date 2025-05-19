import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/chat.dart';
import '../providers/theme_provider.dart';
import 'message_bubble.dart';

class ConversationArea extends StatefulWidget {
  final List<Message> messages;
  final String currentTranscript;
  final Function(String)? onRetryAiSpeech;

  const ConversationArea({
    super.key,
    required this.messages,
    required this.currentTranscript,
    this.onRetryAiSpeech,
  });

  @override
  State<ConversationArea> createState() => _ConversationAreaState();
}

class _ConversationAreaState extends State<ConversationArea> {
  final ScrollController _scrollController = ScrollController();

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDark = themeProvider.isDarkMode;

    return Container(
      decoration: BoxDecoration(
        color: isDark
            ? const Color(0xFF1E293B) // slate-800
            : Colors.white.withOpacity(0.8),
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      margin: const EdgeInsets.symmetric(horizontal: 16),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: widget.messages.isEmpty
            // Empty state
            ? Center(
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Text(
                    'Presiona el micrófono y comienza a hablar en español para iniciar la conversación',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: isDark ? Colors.grey[400] : Colors.grey[600],
                    ),
                  ),
                ),
              )
            // Message list
            : Column(
                children: [
                  Expanded(
                    child: ListView.builder(
                      controller: _scrollController,
                      padding: const EdgeInsets.all(16),
                      itemCount: widget.messages.length +
                          (widget.currentTranscript.isNotEmpty ? 1 : 0),
                      itemBuilder: (context, index) {
                        // Current transcript indicator
                        if (index == widget.messages.length &&
                            widget.currentTranscript.isNotEmpty) {
                          return Align(
                            alignment: Alignment.centerRight,
                            child: Container(
                              constraints: BoxConstraints(
                                maxWidth:
                                    MediaQuery.of(context).size.width * 0.8,
                              ),
                              margin: const EdgeInsets.only(top: 8),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 10,
                              ),
                              decoration: BoxDecoration(
                                color: isDark
                                    ? Colors.grey[700]
                                    : Colors.grey[200],
                                borderRadius: const BorderRadius.only(
                                  topLeft: Radius.circular(16),
                                  topRight: Radius.circular(16),
                                  bottomLeft: Radius.circular(16),
                                ),
                              ),
                              child: Text(
                                widget.currentTranscript,
                                style: TextStyle(
                                  color: isDark ? Colors.white : Colors.black87,
                                ),
                              ),
                            ),
                          );
                        }

                        // Regular message
                        final message = widget.messages[index];
                        return MessageBubble(
                          message: message,
                          onRetryAiSpeech: message.sender == MessageSender.ai
                              ? () => widget.onRetryAiSpeech?.call(message.id)
                              : null,
                        );
                      },
                    ),
                  ),
                ],
              ),
      ),
    );
  }

  @override
  void didUpdateWidget(ConversationArea oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Auto-scroll to the bottom when new messages arrive
    if (widget.messages.length > oldWidget.messages.length ||
        widget.currentTranscript != oldWidget.currentTranscript) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (_scrollController.hasClients) {
          _scrollController.animateTo(
            _scrollController.position.maxScrollExtent,
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeOut,
          );
        }
      });
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }
}
