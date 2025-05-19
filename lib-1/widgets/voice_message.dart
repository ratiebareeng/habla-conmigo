import 'dart:async';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import 'wave_form_widget.dart';

class VoiceMessage extends StatefulWidget {
  final String text;
  final double duration;
  final bool isAi;
  final VoidCallback? onRetryPlayback;

  const VoiceMessage({
    super.key,
    required this.text,
    required this.duration,
    required this.isAi,
    this.onRetryPlayback,
  });

  @override
  State<VoiceMessage> createState() => _VoiceMessageState();
}

class _VoiceMessageState extends State<VoiceMessage> {
  bool _isPlaying = false;
  bool _showText = false;
  int _playbackProgress = 0;
  Timer? _timer;

  @override
  Widget build(BuildContext context) {
    final currentProgress = widget.duration * _playbackProgress / 100;

    return Container(
      constraints: BoxConstraints(
        maxWidth: MediaQuery.of(context).size.width * 0.8,
      ),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: widget.isAi ? Colors.orange[100] : Colors.blue[600],
        borderRadius: BorderRadius.only(
          topLeft: const Radius.circular(12),
          topRight: const Radius.circular(12),
          bottomLeft: widget.isAi ? Radius.zero : const Radius.circular(12),
          bottomRight: widget.isAi ? const Radius.circular(12) : Radius.zero,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Speaker info
          Row(
            children: [
              Text(
                widget.isAi ? 'Tutor' : 'Tú',
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  color: widget.isAi ? Colors.grey[800] : Colors.white,
                ),
              ),
              if (widget.isAi && widget.onRetryPlayback != null)
                TextButton.icon(
                  onPressed: () {
                    _stopPlayback();
                    widget.onRetryPlayback!();

                    // Reset and start progress animation
                    setState(() {
                      _playbackProgress = 0;
                      _isPlaying = true;
                    });

                    // Simulate progress
                    const totalSteps = 100;
                    final interval = (widget.duration * 1000 ~/ totalSteps);

                    _timer = Timer.periodic(Duration(milliseconds: interval),
                        (timer) {
                      setState(() {
                        _playbackProgress += 1;
                        if (_playbackProgress >= 100) {
                          _stopPlayback();
                        }
                      });
                    });
                  },
                  icon: Icon(
                    Icons.refresh,
                    size: 12,
                    color: Colors.orange[600],
                  ),
                  label: Text(
                    'Speak',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.orange[600],
                    ),
                  ),
                  style: TextButton.styleFrom(
                    padding: EdgeInsets.zero,
                    minimumSize: Size.zero,
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                ),
            ],
          ),

          // Playback controls and waveform
          Row(
            children: [
              // Play/Pause button
              IconButton(
                onPressed: _togglePlayback,
                icon: Icon(_isPlaying ? Icons.pause : Icons.play_arrow),
                color: widget.isAi ? Colors.orange[400] : Colors.blue[400],
                style: IconButton.styleFrom(
                  backgroundColor:
                      widget.isAi ? Colors.orange[200] : Colors.blue[500],
                  padding: const EdgeInsets.all(8),
                ),
              ),

              // Audio waveform visualization
              Expanded(
                child: VoiceWaveform(
                  progress: _playbackProgress,
                  isAi: widget.isAi,
                  isPlaying: _isPlaying,
                ),
              ),

              // Time display
              Text(
                '${_formatTime(currentProgress)} / ${_formatTime(widget.duration)}',
                style: TextStyle(
                  fontSize: 10,
                  color: widget.isAi ? Colors.grey[600] : Colors.white70,
                ),
              ),
            ],
          ),

          // Show/hide text controls
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              TextButton.icon(
                onPressed: () {
                  setState(() {
                    _showText = !_showText;
                  });
                },
                icon: Icon(
                  _showText
                      ? Icons.keyboard_arrow_up
                      : Icons.keyboard_arrow_down,
                  size: 14,
                  color: widget.isAi ? Colors.orange[600] : Colors.blue[200],
                ),
                label: Text(
                  _showText ? 'Hide text' : 'Show text',
                  style: TextStyle(
                    fontSize: 12,
                    color: widget.isAi ? Colors.orange[600] : Colors.blue[200],
                  ),
                ),
                style: TextButton.styleFrom(
                  padding: EdgeInsets.zero,
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
              ),
              Text(
                DateFormat.jm().format(DateTime.now()),
                style: TextStyle(
                  fontSize: 10,
                  color: widget.isAi ? Colors.grey[500] : Colors.blue[100],
                ),
              ),
            ],
          ),

          // Text content (if shown)
          if (_showText)
            Padding(
              padding: const EdgeInsets.only(top: 8.0),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  border: Border(
                    top: BorderSide(
                      color:
                          widget.isAi ? Colors.orange[200]! : Colors.blue[500]!,
                    ),
                  ),
                ),
                child: Text(
                  widget.text,
                  style: TextStyle(
                    color: widget.isAi ? Colors.grey[800] : Colors.white,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _stopPlayback();
    super.dispose();
  }

  // Convert seconds to MM:SS format
  String _formatTime(double seconds) {
    final mins = (seconds ~/ 60);
    final secs = (seconds % 60).floor();
    return '${mins.toString()}:${secs.toString().padLeft(2, '0')}';
  }

  void _stopPlayback() {
    _timer?.cancel();
    _timer = null;
    setState(() {
      _isPlaying = false;
    });
  }

  // Handle play/pause toggle
  void _togglePlayback() {
    if (_isPlaying) {
      _stopPlayback();
      return;
    }

    // Start playback
    setState(() {
      _isPlaying = true;
      _playbackProgress = 0;
    });

    // Try to use actual TTS if onRetryPlayback is provided
    if (widget.onRetryPlayback != null) {
      widget.onRetryPlayback!();
    }

    // Simulate progress for visual feedback (100 steps)
    const totalSteps = 100;
    final interval = (widget.duration * 1000 ~/ totalSteps);

    _timer = Timer.periodic(Duration(milliseconds: interval), (timer) {
      setState(() {
        _playbackProgress += 1;
        if (_playbackProgress >= 100) {
          _stopPlayback();
        }
      });
    });
  }
}
