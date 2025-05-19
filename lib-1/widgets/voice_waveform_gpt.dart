import 'package:flutter/material.dart';

class VoiceWaveformGpt extends StatelessWidget {
  final List<double> waveformData;

  const VoiceWaveformGpt({super.key, required this.waveformData});

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: WaveformPainter(waveformData),
      size: Size(double.infinity, 100), // Adjust height as needed
    );
  }
}

class WaveformPainter extends CustomPainter {
  final List<double> waveformData;

  WaveformPainter(this.waveformData);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.blue
      ..style = PaintingStyle.fill;

    final path = Path();
    for (int i = 0; i < waveformData.length; i++) {
      final x = (i / waveformData.length) * size.width;
      final y = (1 - waveformData[i]) * size.height; // Invert Y-axis
      if (i == 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }
    path.lineTo(size.width, size.height);
    path.lineTo(0, size.height);
    path.close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}
