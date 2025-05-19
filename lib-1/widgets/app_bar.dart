import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/theme_provider.dart';

class CustomAppBar extends StatefulWidget implements PreferredSizeWidget {
  const CustomAppBar({super.key});

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  State<CustomAppBar> createState() => _CustomAppBarState();
}

class _CustomAppBarState extends State<CustomAppBar> {
  bool _isMenuOpen = false;

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDark = themeProvider.isDarkMode;

    return AppBar(
      elevation: 2,
      backgroundColor: isDark
          ? const Color(0xFF1E293B) // slate-800
          : Colors.white.withOpacity(0.9),
      scrolledUnderElevation: 3,
      shadowColor: Colors.black26,
      title: Row(
        children: [
          Icon(
            Icons.language,
            color: Theme.of(context).colorScheme.primary,
            size: 28,
          ),
          const SizedBox(width: 8),
          ShaderMask(
            shaderCallback: (bounds) => LinearGradient(
              colors: [
                Theme.of(context).colorScheme.primary,
                Colors.orange[700]!
              ],
            ).createShader(bounds),
            child: const Text(
              'HablaConmigo',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
      actions: [
        // Desktop Navigation
        if (MediaQuery.of(context).size.width > 640) ...[
          TextButton(
            onPressed: () {},
            child: const Text('Home'),
          ),
          TextButton(
            onPressed: () {},
            child: const Text('Topics'),
          ),
          TextButton(
            onPressed: () {},
            child: const Text('Progress'),
          ),
          TextButton(
            onPressed: () {},
            child: const Text('About'),
          ),
          IconButton(
            onPressed: themeProvider.toggleTheme,
            icon: Icon(
              isDark ? Icons.wb_sunny_outlined : Icons.dark_mode_outlined,
            ),
            tooltip: 'Toggle theme',
          ),
          const SizedBox(width: 8),
        ] else
          IconButton(
            onPressed: () {
              setState(() {
                _isMenuOpen = !_isMenuOpen;
              });
            },
            icon: Icon(_isMenuOpen ? Icons.close : Icons.menu),
          ),
      ],
      bottom: _isMenuOpen && MediaQuery.of(context).size.width <= 640
          ? PreferredSize(
              preferredSize: const Size.fromHeight(240),
              child: Container(
                color: isDark
                    ? const Color(0xFF1E293B) // slate-800
                    : Colors.white,
                child: Column(
                  children: [
                    ListTile(
                      title: const Text('Home'),
                      onTap: () {
                        setState(() {
                          _isMenuOpen = false;
                        });
                      },
                    ),
                    ListTile(
                      title: const Text('Topics'),
                      onTap: () {
                        setState(() {
                          _isMenuOpen = false;
                        });
                      },
                    ),
                    ListTile(
                      title: const Text('Progress'),
                      onTap: () {
                        setState(() {
                          _isMenuOpen = false;
                        });
                      },
                    ),
                    ListTile(
                      title: const Text('About'),
                      onTap: () {
                        setState(() {
                          _isMenuOpen = false;
                        });
                      },
                    ),
                    ListTile(
                      leading: Icon(
                        isDark
                            ? Icons.wb_sunny_outlined
                            : Icons.dark_mode_outlined,
                      ),
                      title: Text(isDark ? 'Light Mode' : 'Dark Mode'),
                      onTap: () {
                        themeProvider.toggleTheme();
                        setState(() {
                          _isMenuOpen = false;
                        });
                      },
                    ),
                  ],
                ),
              ),
            )
          : null,
    );
  }
}
