import 'package:flutter/material.dart';
import 'package:habla_conmigo/models/chat.dart';
import 'package:habla_conmigo/providers/theme_provider.dart';
import 'package:provider/provider.dart';

class TopicSelector extends StatelessWidget {
  final Topic selectedTopic;
  final Function(Topic) onSelectTopic;

  const TopicSelector({
    super.key,
    required this.selectedTopic,
    required this.onSelectTopic,
  });

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDark = themeProvider.isDarkMode;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Conversation Topic',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: isDark ? Colors.grey[300] : Colors.grey[700],
          ),
        ),
        const SizedBox(height: 8),
        Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: isDark ? Colors.grey[700]! : Colors.grey[300]!,
            ),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<Topic>(
              value: selectedTopic,
              isExpanded: true,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              borderRadius: BorderRadius.circular(8),
              dropdownColor: isDark ? Colors.grey[800] : Colors.white,
              icon: Icon(
                Icons.arrow_drop_down,
                color: isDark ? Colors.grey[400] : Colors.grey[700],
              ),
              items: TopicData.allTopics.map((TopicData topicData) {
                return DropdownMenuItem<Topic>(
                  value: topicData.value,
                  child: Text(
                    '${topicData.label} - ${topicData.description}',
                    style: TextStyle(
                      fontSize: 14,
                      color: isDark ? Colors.grey[300] : Colors.grey[800],
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                );
              }).toList(),
              onChanged: (Topic? value) {
                if (value != null) {
                  onSelectTopic(value);
                }
              },
            ),
          ),
        ),
      ],
    );
  }
}
