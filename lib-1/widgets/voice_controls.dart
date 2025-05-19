import 'package:flutter/material.dart';

class VoiceControls extends StatelessWidget {
  final Function onRecord;
  final Function onStop;
  final Function onPlay;

  VoiceControls({required this.onRecord, required this.onStop, required this.onPlay});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        IconButton(
          icon: Icon(Icons.mic),
          onPressed: () => onRecord(),
          tooltip: 'Record',
        ),
        IconButton(
          icon: Icon(Icons.stop),
          onPressed: () => onStop(),
          tooltip: 'Stop',
        ),
        IconButton(
          icon: Icon(Icons.play_arrow),
          onPressed: () => onPlay(),
          tooltip: 'Play',
        ),
      ],
    );
  }
}