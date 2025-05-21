import 'dart:async';

import 'package:flutter/material.dart';
import 'package:habla_conmigo/services/vapi_api_service.dart';
import 'package:vapinew/vapinew.dart';

class CallPage extends StatefulWidget {
  const CallPage({super.key});

  @override
  State<CallPage> createState() => _CallPageState();
}

class _CallPageState extends State<CallPage>
    with SingleTickerProviderStateMixin {
  bool isCallActive = false;
  bool isLoading = false;
  String statusMessage = 'Ready to call';
  String lastMessage = '';

  // For the ripple animation effect
  late AnimationController _animationController;
  late Animation<double> _animation;

  // Stream subscription for Vapi events
  StreamSubscription<VapiEvent>? _eventSubscription;

  @override
  void initState() {
    super.initState();

    // Setup animation controller for call button ripple effect
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    _animation = Tween<double>(begin: 1.0, end: 1.2).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );

    // Listen to Vapi events
    _listenToVapiEvents();
  }

  void _listenToVapiEvents() {
    _eventSubscription = VapiApiService.instance.listen().listen((event) {
      if (event.label == "call-start") {
        setState(() {
          isCallActive = true;
          isLoading = false;
          statusMessage = 'Call in progress';
        });
      } else if (event.label == "call-end") {
        setState(() {
          isCallActive = false;
          isLoading = false;
          statusMessage = 'Call ended';
        });
        // Reset status message after a delay
        Future.delayed(const Duration(seconds: 2), () {
          if (mounted) {
            setState(() {
              statusMessage = 'Ready to call';
            });
          }
        });
      } else if (event.label == "message") {
        setState(() {
          lastMessage = event.value;
        });
      }
    });
  }

  Future<void> _handleCallButton() async {
    if (isLoading) return;

    setState(() {
      isLoading = true;
      statusMessage = isCallActive ? 'Ending call...' : 'Starting call...';
    });

    try {
      if (isCallActive) {
        await VapiApiService.instance.stop();
      } else {
        await VapiApiService.instance.start();
      }
    } catch (e) {
      setState(() {
        isLoading = false;
        statusMessage = 'Error: ${e.toString()}';
      });
    }
  }

  @override
  void dispose() {
    _eventSubscription?.cancel();
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1E1E2C),
      body: SafeArea(
        child: Column(
          children: [
            _buildAppBar(),
            const Spacer(),
            _buildCallingStatus(),
            const SizedBox(height: 60),
            _buildCallButton(),
            const Spacer(),
          ],
        ),
      ),
    );
  }

  Widget _buildAppBar() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
            onPressed: () => Navigator.of(context).pop(),
          ),
          const Expanded(
            child: Text(
              'AI Assistant Call',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          IconButton(
            icon: Icon(
              isCallActive ? Icons.mic_off : Icons.mic,
              color: Colors.white,
            ),
            onPressed: isCallActive
                ? () => VapiApiService.instance.muteMic(true)
                : null,
          ),
        ],
      ),
    );
  }

  Widget _buildCallingStatus() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 120,
          height: 120,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: const Color(0xFF2A2A3C),
            boxShadow: [
              BoxShadow(
                color: isCallActive
                    ? Colors.blue.withValues(alpha: 0.3)
                    : Colors.transparent,
                blurRadius: 15,
                spreadRadius: 5,
              ),
            ],
          ),
          child: Icon(
            isCallActive ? Icons.headset_mic : Icons.headset,
            size: 50,
            color: isCallActive ? Colors.blue : Colors.white70,
          ),
        ),
        const SizedBox(height: 24),
        Text(
          statusMessage,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.w500,
          ),
        ),
        if (isCallActive && lastMessage.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 8.0, left: 32.0, right: 32.0),
            child: Text(
              lastMessage,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.7),
                fontSize: 14,
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildCallButton() {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Transform.scale(
          scale: isCallActive ? 1.0 : _animation.value,
          child: GestureDetector(
            onTap: _handleCallButton,
            child: Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isCallActive ? Colors.red : Colors.green,
                boxShadow: [
                  BoxShadow(
                    color: (isCallActive ? Colors.red : Colors.green)
                        .withValues(alpha: 0.4),
                    blurRadius: 12,
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: isLoading
                  ? const CircularProgressIndicator(color: Colors.white)
                  : Icon(
                      isCallActive ? Icons.call_end : Icons.call,
                      color: Colors.white,
                      size: 32,
                    ),
            ),
          ),
        );
      },
    );
  }
}
