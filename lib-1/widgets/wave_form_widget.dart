import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

class VoiceWaveform extends StatefulWidget {
  final int progress;
  final bool isAi;
  final bool isPlaying;

  const VoiceWaveform({
    super.key,
    required this.progress,
    required this.isAi,
    required this.isPlaying,
  });

  @override
  State<VoiceWaveform> createState() => _VoiceWaveformState();
}

class _VoiceWaveformState extends State<VoiceWaveform> {
  // Generate bars for the waveform visualization
  final int numBars = 30;
  late List<double> barHeights;

  @override
  Widget build(BuildContext context) {
    // Calculate which bars should be highlighted based on progress
    final progressIndex = (widget.progress / 100 * numBars).floor();

    return SizedBox(
      height: 32,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: List.generate(numBars, (index) {
          final active = index <= progressIndex;
          final barColor = active
              ? widget.isAi
                  ? Colors.orange[500]
                  : Colors.blue[300]
              : Colors.grey[300];

          // Create the bar
          Widget bar = Container(
            width: 2,
            height: barHeights[index] * 32,
            decoration: BoxDecoration(
              color: barColor,
              borderRadius: BorderRadius.circular(1),
            ),
          );

          // Add animation if playing
          if (widget.isPlaying) {
            // Add a slightly different delay for each bar
            final delay = Duration(milliseconds: (index * 50) % 400);

            bar = bar
                .animate(
                  onPlay: (controller) => controller.repeat(),
                  delay: delay,
                )
                .scaleY(
                  duration: 800.ms,
                  curve: Curves.easeInOut,
                  begin: 0.7,
                  end: 1.3,
                )
                .then()
                .scaleY(
                  duration: 800.ms,
                  curve: Curves.easeInOut,
                  begin: 1.3,
                  end: 0.7,
                );
          }

          return bar;
        }),
      ),
    );
  }

  @override
  void initState() {
    super.initState();
    barHeights = _generateBars();
  }

  // Generate random but consistent heights for the bars
  List<double> _generateBars() {
    final random = math.Random(12345); // Fixed seed for consistency
    final bars = <double>[];

    for (int i = 0; i < numBars; i++) {
      // Create pattern-based heights with some randomness to make it look like speech
      // Using sine functions with different frequencies creates a natural wave pattern
      final height = 30 +
          (math.sin(i * 0.5) * 25) +
          (math.sin(i * 0.2) * 15) +
          (random.nextDouble() * 15);

      // Clamp between 15% and 90%
      bars.add(height.clamp(15, 90) / 100);
    }

    return bars;
  }
}
