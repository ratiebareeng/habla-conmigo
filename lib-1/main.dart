import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'providers/theme_provider.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => ThemeProvider(),
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, _) => MaterialApp(
          title: 'HablaConmigo',
          debugShowCheckedModeBanner: false,
          theme: ThemeData(
            useMaterial3: true,
            colorScheme: ColorScheme.light(
              primary: Colors.orange[500]!,
              secondary: Colors.blue[600]!,
              surface: Colors.white,
            ),
            fontFamily: 'Inter',
            appBarTheme: AppBarTheme(
              backgroundColor: Colors.white.withValues(alpha: 90),
              elevation: 1,
            ),
          ),
          darkTheme: ThemeData(
            useMaterial3: true,
            brightness: Brightness.dark,
            colorScheme: ColorScheme.dark(
              primary: Colors.orange[500]!,
              secondary: Colors.blue[600]!, // slate-900
              surface: const Color(0xFF1E293B), // slate-800
            ),
            fontFamily: 'Inter',
            appBarTheme: const AppBarTheme(
              backgroundColor: Color(0xFF1E293B), // slate-800
              elevation: 1,
            ),
          ),
          // themeMode: themeProvider.themeMode,
          // home: const HomeScreen(),
          home: Text('home'),
        ),
      ),
    );
  }
}
