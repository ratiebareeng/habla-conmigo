import 'package:flutter/material.dart';

class Footer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16.0),
      color: Colors.grey[200],
      child: Center(
        child: Text(
          'Footer Content',
          style: TextStyle(fontSize: 16.0, color: Colors.black54),
        ),
      ),
    );
  }
}