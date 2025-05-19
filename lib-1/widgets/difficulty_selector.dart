import 'package:flutter/material.dart';

class DifficultySelector extends StatefulWidget {
  final Function(String) onDifficultySelected;

  DifficultySelector({required this.onDifficultySelected});

  @override
  _DifficultySelectorState createState() => _DifficultySelectorState();
}

class _DifficultySelectorState extends State<DifficultySelector> {
  String _selectedDifficulty = 'Easy';

  void _onDifficultyChange(String? newValue) {
    if (newValue != null) {
      setState(() {
        _selectedDifficulty = newValue;
      });
      widget.onDifficultySelected(newValue);
    }
  }

  @override
  Widget build(BuildContext context) {
    return DropdownButton<String>(
      value: _selectedDifficulty,
      onChanged: _onDifficultyChange,
      items: <String>['Easy', 'Medium', 'Hard']
          .map<DropdownMenuItem<String>>((String value) {
        return DropdownMenuItem<String>(
          value: value,
          child: Text(value),
        );
      }).toList(),
    );
  }
}