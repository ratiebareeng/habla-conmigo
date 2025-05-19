enum Difficulty { beginner, intermediate, advanced }

// Difficulty data for toggles
class DifficultyData {
  static List<DifficultyData> allLevels = [
    DifficultyData(value: Difficulty.beginner, label: 'Beginner'),
    DifficultyData(value: Difficulty.intermediate, label: 'Intermediate'),
    DifficultyData(value: Difficulty.advanced, label: 'Advanced'),
  ];
  final Difficulty value;

  final String label;

  DifficultyData({
    required this.value,
    required this.label,
  });
}

class Message {
  final String id;
  final String text;
  final MessageSender sender;
  final DateTime timestamp;
  final MessageType type;
  final double? audioDuration; // Duration in seconds for voice messages
  final String? audioUrl; // URL to audio file (for actual implementation)

  Message({
    required this.id,
    required this.text,
    required this.sender,
    required this.timestamp,
    this.type = MessageType.text,
    this.audioDuration,
    this.audioUrl,
  });

  // Create a message from a map
  factory Message.fromMap(Map<String, dynamic> map) {
    return Message(
      id: map['id'],
      text: map['text'],
      sender: map['sender'] == 'MessageSender.ai'
          ? MessageSender.ai
          : MessageSender.user,
      timestamp: DateTime.parse(map['timestamp']),
      type: map['type'] == 'MessageType.voice'
          ? MessageType.voice
          : MessageType.text,
      audioDuration: map['audioDuration'],
      audioUrl: map['audioUrl'],
    );
  }

  // Convert message to a map for future storage
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'text': text,
      'sender': sender.toString(),
      'timestamp': timestamp.toIso8601String(),
      'type': type.toString(),
      'audioDuration': audioDuration,
      'audioUrl': audioUrl,
    };
  }
}

enum MessageSender { user, ai }

enum MessageType { text, voice }

enum Topic { general, travel, restaurant, shopping, emergency }

// Topic data for dropdowns
class TopicData {
  static List<TopicData> allTopics = [
    TopicData(
      value: Topic.general,
      label: 'General',
      description: 'Basic conversation practice',
    ),
    TopicData(
      value: Topic.travel,
      label: 'Travel',
      description: 'Asking for directions, booking hotels',
    ),
    TopicData(
      value: Topic.restaurant,
      label: 'Restaurant',
      description: 'Ordering food, making reservations',
    ),
    TopicData(
      value: Topic.shopping,
      label: 'Shopping',
      description: 'Buying clothes, asking about prices',
    ),
    TopicData(
      value: Topic.emergency,
      label: 'Emergency',
      description: 'Getting help, medical situations',
    ),
  ];
  final Topic value;
  final String label;

  final String description;

  TopicData({
    required this.value,
    required this.label,
    required this.description,
  });
}
