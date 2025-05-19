import 'package:flutter/material.dart';
import '../widgets/app_bar.dart';
import '../widgets/conversation_area.dart';
import '../widgets/difficulty_selector.dart';
import '../widgets/footer.dart';
import '../widgets/topic_selector.dart';
import '../widgets/voice_controls.dart';

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(),
      body: Column(
        children: [
          DifficultySelector(),
          TopicSelector(),
          Expanded(child: ConversationArea()),
          VoiceControls(),
          Footer(),
        ],
      ),
    );
  }
}