import 'package:flutter/material.dart';

class MessageBubble extends StatelessWidget {
  final String sender;
  final String content;
  final bool isMe;

  const MessageBubble({
    Key? key,
    required this.sender,
    required this.content,
    required this.isMe,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Column(
        crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
        children: [
          Text(
            sender,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: isMe ? Colors.blue : Colors.black,
            ),
          ),
          Material(
            borderRadius: BorderRadius.circular(10),
            elevation: 5,
            color: isMe ? Colors.blue[200] : Colors.grey[300],
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
              child: Text(
                content,
                style: TextStyle(
                  fontSize: 15,
                  color: isMe ? Colors.black : Colors.black87,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}