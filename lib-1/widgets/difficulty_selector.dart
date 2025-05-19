import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/chat.dart';
import '../providers/theme_provider.dart';

class DifficultySelector extends StatelessWidget {
  final Difficulty difficulty;
  final Function(Difficulty) onSelectDifficulty;

  const DifficultySelector({
    super.key,
    required this.difficulty,
    required this.onSelectDifficulty,
  });

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDark = themeProvider.isDarkMode;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Difficulty Level',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: isDark ? Colors.grey[300] : Colors.grey[700],
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: DifficultyData.allLevels.map((level) {
            final isSelected = difficulty == level.value;

            return Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4.0),
                child: ElevatedButton(
                  onPressed: () => onSelectDifficulty(level.value),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: isSelected
                        ? Colors.orange[500]
                        : isDark
                            ? Colors.grey[800]
                            : Colors.white,
                    foregroundColor: isSelected
                        ? Colors.white
                        : isDark
                            ? Colors.grey[300]
                            : Colors.grey[700],
                    elevation: isSelected ? 1 : 0,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                      side: isSelected
                          ? BorderSide.none
                          : BorderSide(
                              color: isDark
                                  ? Colors.grey[700]!
                                  : Colors.grey[300]!,
                            ),
                    ),
                  ),
                  child: Text(level.label),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}
