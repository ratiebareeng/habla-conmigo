import 'package:flutter/material.dart';
import 'package:your_project_name/models/chat.dart'; // Update with your actual project name

class ConversationArea extends StatelessWidget {
  final List<ChatMessage> messages;

  ConversationArea({required this.messages});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: messages.length,
      itemBuilder: (context, index) {
        final message = messages[index];
        return MessageBubble(
          sender: message.sender,
          content: message.content,
          timestamp: message.timestamp,
        );
      },
    );
  }
}