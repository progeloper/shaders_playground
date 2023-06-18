import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_shaders/flutter_shaders.dart';

class MandelbrotZoom extends StatefulWidget {
  const MandelbrotZoom({Key? key}) : super(key: key);

  @override
  State<MandelbrotZoom> createState() => _MandelbrotZoomState();
}

class _MandelbrotZoomState extends State<MandelbrotZoom>
    with SingleTickerProviderStateMixin {
  double time = 0;
  late Ticker _ticker;

  @override
  void initState() {
    super.initState();
    _ticker = Ticker((elapsed) {
      time += 0.05;
      setState(() {});
    });
    _ticker.start();
  }

  @override
  void dispose() {
    _ticker.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: Colors.black,
      body: ShaderBuilder(
        (context, shader, child) {
          return AnimatedSampler(
            (image, size, canvas) {
              shader.setFloat(0, time);
              shader.setFloat(1, size.width);
              shader.setFloat(2, size.height);
              canvas.drawPaint(Paint()..shader = shader);
            },
            child: child!,
          );
        },
        assetKey: 'shaders/mandelbrot_zoom.frag',
        child: SizedBox(
          height: size.height,
          width: size.width,
        ),
      ),
    );
  }
}
