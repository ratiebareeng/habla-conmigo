import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:habla_conmigo/models/chat.dart';
import 'package:intl/intl.dart';

import 'voice_message.dart';

class MessageBubble extends StatelessWidget {
  final Message message;
  final VoidCallback? onRetryAiSpeech;

  const MessageBubble({
    super.key,
    required this.message,
    this.onRetryAiSpeech,
  });

  @override
  Widget build(BuildContext context) {
    final bool isAi = message.sender == MessageSender.ai;

    // For demo purposes, all AI messages are treated as voice messages
    // In a real app, you'd use the type property in the message object
    final bool isVoiceMessage = isAi;

    // Calculate a mock duration based on message length (just for demo)
    final double estimatedDuration =
        message.audioDuration ?? math.max(5, (message.text.length / 10));

    if (isVoiceMessage) {
      return Align(
        alignment: isAi ? Alignment.centerLeft : Alignment.centerRight,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 8.0),
          child: VoiceMessage(
            text: message.text,
            duration: estimatedDuration,
            isAi: isAi,
            onRetryPlayback: onRetryAiSpeech,
          ),
        ),
      );
    }

    // Regular text message bubble (for user messages)
    return Align(
      alignment: isAi ? Alignment.centerLeft : Alignment.centerRight,
      child: Container(
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.8,
        ),
        margin: const EdgeInsets.symmetric(vertical: 8),
        padding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 10,
        ),
        decoration: BoxDecoration(
          color: isAi ? Colors.orange[100] : Colors.blue[600],
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomLeft: isAi ? Radius.zero : const Radius.circular(16),
            bottomRight: isAi ? const Radius.circular(16) : Radius.zero,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Sender info
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  isAi ? Icons.volume_up : Icons.person,
                  size: 16,
                  color: isAi ? Colors.grey[700] : Colors.white70,
                ),
                const SizedBox(width: 8),
                Text(
                  isAi ? 'Tutor' : 'Tú',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: isAi ? Colors.grey[700] : Colors.white,
                  ),
                ),
                if (isAi && onRetryAiSpeech != null)
                  IconButton(
                    onPressed: onRetryAiSpeech,
                    icon: Icon(
                      Icons.refresh,
                      size: 14,
                      color: Colors.orange[500],
                    ),
                    tooltip: 'Retry speech',
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                    iconSize: 14,
                  ),
              ],
            ),

            // Message text
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 4.0),
              child: Text(
                message.text,
                style: TextStyle(
                  color: isAi ? Colors.grey[800] : Colors.white,
                ),
              ),
            ),

            // Timestamp
            Align(
              alignment: Alignment.centerRight,
              child: Text(
                DateFormat.jm().format(message.timestamp),
                style: TextStyle(
                  fontSize: 10,
                  color: isAi ? Colors.grey[500] : Colors.blue[100],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
