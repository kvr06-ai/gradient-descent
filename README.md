# Visualizing Gradient Descent Optimization

An interactive article that allows you to explore optimization algorithms used in machine learning through visual demonstrations and interactive examples.

## Overview

This article provides a comprehensive exploration of gradient descent and its variants through interactive visualizations. You'll gain intuition about how these algorithms navigate loss landscapes and why certain modifications like momentum and adaptive learning rates make them more effective.

## Features

- Interactive 2D and 3D visualizations of loss landscapes
- Real-time demonstrations of various optimization algorithms:
  - Vanilla Gradient Descent
  - Momentum
  - AdaGrad, RMSProp
  - Adam and variants
- Compare multiple optimization algorithms side-by-side
- Experiment with hyperparameters like learning rate and momentum
- Final challenge: can you optimize better than Adam?

## Running Locally

### Option 1: Using Node.js (recommended)

1. Make sure you have [Node.js](https://nodejs.org/) installed
2. Navigate to this directory in your terminal
3. Run the server with:
   ```
   node serve.js
   ```
4. Open your browser to http://localhost:3000

### Option 2: Using Python

If you have Python installed, you can start a simple HTTP server:

For Python 3:
```
python -m http.server 3000
```

For Python 2:
```
python -m SimpleHTTPServer 3000
```

Then open your browser to http://localhost:3000

### Option 3: Any HTTP Server

You can use any HTTP server to serve the contents of this directory. The article uses only client-side JavaScript with no backend dependencies.

## Browser Compatibility

The visualizations work best in modern browsers like:
- Chrome (recommended)
- Firefox
- Safari
- Edge

For the best experience, ensure your browser is up to date.

## Libraries Used

This article uses the following libraries:
- [Plotly.js](https://plotly.com/javascript/) - For interactive visualizations
- [Math.js](https://mathjs.org/) - For mathematical operations
- [Chart.js](https://www.chartjs.org/) - For some of the simpler charts

## Acknowledgements

This article was created based on the outline in `article_outline.md` and inspired by various papers and resources on optimization algorithms in machine learning.

## License

This project is open source and available under the MIT License. 