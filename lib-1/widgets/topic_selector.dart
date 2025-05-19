import 'package:flutter/material.dart';

class TopicSelector extends StatefulWidget {
  final List<String> topics;
  final ValueChanged<String> onTopicSelected;

  TopicSelector({required this.topics, required this.onTopicSelected});

  @override
  _TopicSelectorState createState() => _TopicSelectorState();
}

class _TopicSelectorState extends State<TopicSelector> {
  String? selectedTopic;

  @override
  Widget build(BuildContext context) {
    return DropdownButton<String>(
      value: selectedTopic,
      hint: Text('Select a topic'),
      items: widget.topics.map((String topic) {
        return DropdownMenuItem<String>(
          value: topic,
          child: Text(topic),
        );
      }).toList(),
      onChanged: (String? newValue) {
        setState(() {
          selectedTopic = newValue;
        });
        if (newValue != null) {
          widget.onTopicSelected(newValue);
        }
      },
    );
  }
}