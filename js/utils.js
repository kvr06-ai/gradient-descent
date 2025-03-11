/**
 * Utility functions for gradient descent visualizations
 */

// Random number generator within a range
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Create a grid of points for contour plots
function createGrid(xRange, yRange, resolution = 50) {
    const xValues = new Array(resolution);
    const yValues = new Array(resolution);
    const zValues = new Array(resolution);
    
    const xStep = (xRange[1] - xRange[0]) / (resolution - 1);
    const yStep = (yRange[1] - yRange[0]) / (resolution - 1);
    
    for (let i = 0; i < resolution; i++) {
        xValues[i] = xRange[0] + i * xStep;
        yValues[i] = yRange[0] + i * yStep;
        zValues[i] = new Array(resolution);
    }
    
    return { xValues, yValues, zValues };
}

// Compute Z values for a grid using a given function
function computeGridValues(grid, func) {
    const { xValues, yValues, zValues } = grid;
    
    for (let i = 0; i < xValues.length; i++) {
        for (let j = 0; j < yValues.length; j++) {
            zValues[i][j] = func([xValues[i], yValues[j]]);
        }
    }
    
    return { xValues, yValues, zValues };
}

// Create a contour plot using Plotly
function createContourPlot(divId, grid, title = '', colorscale = 'Viridis') {
    const { xValues, yValues, zValues } = grid;
    
    const data = [{
        x: xValues,
        y: yValues,
        z: zValues,
        type: 'contour',
        colorscale: colorscale,
        contours: {
            coloring: 'heatmap'
        }
    }];
    
    const layout = {
        title: title,
        margin: { t: 30, b: 40, l: 40, r: 40 },
        xaxis: { title: 'x' },
        yaxis: { title: 'y', scaleanchor: 'x' }
    };
    
    Plotly.newPlot(divId, data, layout);
    
    return { plot: data, layout };
}

// Create a 3D surface plot using Plotly
function create3DSurfacePlot(divId, grid, title = '', colorscale = 'Viridis') {
    const { xValues, yValues, zValues } = grid;
    
    const data = [{
        x: xValues,
        y: yValues,
        z: zValues,
        type: 'surface',
        colorscale: colorscale
    }];
    
    const layout = {
        title: title,
        scene: {
            xaxis: { title: 'x' },
            yaxis: { title: 'y' },
            zaxis: { title: 'z' },
            camera: {
                eye: { x: 1.5, y: 1.5, z: 1 }
            }
        },
        margin: { t: 30, b: 0, l: 0, r: 0 }
    };
    
    Plotly.newPlot(divId, data, layout);
    
    return { plot: data, layout };
}

// Plot optimization trajectory on a contour plot
function plotTrajectory(divId, trajectory, existingPlot = null) {
    const trajectoryX = trajectory.map(point => point[0]);
    const trajectoryY = trajectory.map(point => point[1]);
    
    const pathTrace = {
        x: trajectoryX,
        y: trajectoryY,
        mode: 'lines+markers',
        type: 'scatter',
        line: { color: 'rgba(255, 0, 0, 0.8)', width: 2 },
        marker: { size: 6, color: 'rgba(255, 0, 0, 0.8)' }
    };
    
    if (existingPlot) {
        Plotly.addTraces(divId, pathTrace);
    } else {
        Plotly.newPlot(divId, [pathTrace]);
    }
}

// Clear trajectory from plot
function clearTrajectory(divId, numberOfTraces = 1) {
    Plotly.deleteTraces(divId, Array.from({ length: numberOfTraces }, (_, i) => 1 + i));
}

// Debounce function to limit function calls
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Animate trajectory on a plot
function animateTrajectory(divId, trajectory, delay = 50, onComplete = null) {
    let i = 0;
    const x = [trajectory[0][0]];
    const y = [trajectory[0][1]];
    
    const trace = {
        x: x,
        y: y,
        mode: 'lines+markers',
        type: 'scatter',
        line: { color: 'rgba(255, 0, 0, 0.8)', width: 2 },
        marker: { size: 6, color: 'rgba(255, 0, 0, 0.8)' }
    };
    
    Plotly.addTraces(divId, trace);
    
    const interval = setInterval(() => {
        i++;
        
        if (i < trajectory.length) {
            x.push(trajectory[i][0]);
            y.push(trajectory[i][1]);
            
            Plotly.update(divId, {
                x: [x],
                y: [y]
            }, {}, [1]);
        } else {
            clearInterval(interval);
            if (onComplete) onComplete();
        }
    }, delay);
    
    return interval;
}

// Calculate optimization metrics (final loss, number of steps to convergence)
function calculateOptimizationMetrics(trajectory, lossFunction, convergenceThreshold = 1e-5) {
    const finalPosition = trajectory[trajectory.length - 1];
    const finalLoss = lossFunction(finalPosition);
    
    let stepsToConvergence = trajectory.length;
    for (let i = 1; i < trajectory.length; i++) {
        const currentLoss = lossFunction(trajectory[i]);
        const prevLoss = lossFunction(trajectory[i-1]);
        
        if (Math.abs(currentLoss - prevLoss) < convergenceThreshold) {
            stepsToConvergence = i;
            break;
        }
    }
    
    return {
        finalLoss,
        stepsToConvergence,
        totalSteps: trajectory.length - 1
    };
} 