import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_shaders/flutter_shaders.dart';

class PyramidFractal extends StatefulWidget {
  const PyramidFractal({Key? key}) : super(key: key);

  @override
  State<PyramidFractal> createState() => _PyramidFractalState();
}

class _PyramidFractalState extends State<PyramidFractal> with SingleTickerProviderStateMixin {
  double time = 0;
  late Ticker _ticker;


  @override
  void initState() {
    super.initState();
    _ticker = createTicker((elapsed) {
      time += 0.05;
      setState(() {
      });
    });
    _ticker.start();
  }


  @override
  void dispose() {
    super.dispose();
    _ticker.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    return Scaffold(
      backgroundColor: Colors.black,
      body: ShaderBuilder(
        (context, shader, child) {
          return AnimatedSampler((image, size, canvas) {
            shader.setFloat(0, time);
            shader.setFloat(1, size.width);
            shader.setFloat(2, size.height);
            canvas.drawPaint(Paint()..shader = shader);
          }, child: child!);
        },
        assetKey: 'shaders/pyramid_fractal.frag',
        child: SizedBox(
          height: size.height,
          width: size.width,
        ),
      ),
    );
  }
}
