/**
 * Visualization implementations for the gradient descent article.
 * This module sets up and handles interactions for all visualizations.
 */

// Visualization 1: Interactive 2D Loss Function with draggable starting point
function setupSimple2DDemo() {
    const divId = 'simple-2d-demo';
    const lossFunction = lossFunctions.quadratic;
    const grid = createGrid([-5, 5], [-5, 5], 50);
    const computedGrid = computeGridValues(grid, lossFunction.value);
    
    // Create the initial contour plot
    createContourPlot(divId, computedGrid, 'Quadratic Loss Function');
    
    // Add a draggable point for the starting position
    let startPos = [3, 3]; // Default starting position
    
    // Add a single point trace for the starting position
    Plotly.addTraces(divId, {
        x: [startPos[0]],
        y: [startPos[1]],
        mode: 'markers',
        marker: { size: 12, color: 'red' },
        name: 'Starting Point'
    });
    
    // Make the point draggable
    let isDragging = false;
    
    document.getElementById(divId).on('plotly_click', function(data) {
        if (data.points.length > 0) {
            startPos = [data.points[0].x, data.points[0].y];
            Plotly.restyle(divId, {
                x: [[startPos[0]]],
                y: [[startPos[1]]]
            }, 1);
        }
    });
    
    // Setup run button to execute gradient descent from selected point
    document.getElementById('run-2d-descent').addEventListener('click', function() {
        const learningRate = parseFloat(document.getElementById('learning-rate-2d').value);
        
        // Run gradient descent
        const trajectory = gradientDescent(
            lossFunction.gradient,
            startPos,
            learningRate,
            50 // Number of iterations
        );
        
        // Clear any previous trajectories
        try {
            clearTrajectory(divId);
        } catch (e) {
            // No trajectory to clear yet
        }
        
        // Animate the trajectory
        animateTrajectory(divId, trajectory, 50);
    });
    
    // Setup reset button
    document.getElementById('reset-2d-descent').addEventListener('click', function() {
        // Clear trajectory if exists
        try {
            clearTrajectory(divId);
        } catch (e) {
            // No trajectory to clear
        }
        
        // Reset starting point to default
        startPos = [3, 3];
        Plotly.restyle(divId, {
            x: [[startPos[0]]],
            y: [[startPos[1]]]
        }, 1);
    });
    
    // Update learning rate display when slider changes
    document.getElementById('learning-rate-2d').addEventListener('input', function() {
        document.getElementById('learning-rate-2d-value').textContent = this.value;
    });
}

// Visualization 2: 3D Loss Landscape
function setup3DLandscape() {
    const divId = '3d-landscape';
    
    // Start with a default loss function (convex)
    updateSurface('convex');
    
    // Setup the surface selection dropdown
    document.getElementById('surface-select').addEventListener('change', function() {
        updateSurface(this.value);
    });
    
    // Function to update the 3D surface based on selected function
    function updateSurface(surfaceType) {
        let lossFunction;
        let title;
        let range;
        
        switch(surfaceType) {
            case 'convex':
                lossFunction = lossFunctions.quadratic;
                title = 'Convex Quadratic Function';
                range = [-5, 5];
                break;
            case 'nonconvex':
                lossFunction = lossFunctions.rastrigin;
                title = 'Non-Convex Rastrigin Function';
                range = [-5.12, 5.12];
                break;
            case 'saddle':
                lossFunction = lossFunctions.saddle;
                title = 'Saddle Point Function';
                range = [-3, 3];
                break;
            case 'ravine':
                lossFunction = lossFunctions.ravine;
                title = 'Ravine (Rosenbrock Function)';
                range = [-1.5, 1.5];
                break;
        }
        
        const grid = createGrid([range[0], range[1]], [range[0], range[1]], 50);
        const computedGrid = computeGridValues(grid, lossFunction.value);
        
        create3DSurfacePlot(divId, computedGrid, title);
    }
}

// Visualization 3: Gradient Descent with Learning Rate Variations
function setupGDDemo() {
    const divId = 'gd-demo';
    const lossFunction = lossFunctions.quadratic;
    const grid = createGrid([-5, 5], [-5, 5], 50);
    const computedGrid = computeGridValues(grid, lossFunction.value);
    
    // Create the contour plot
    createContourPlot(divId, computedGrid, 'Gradient Descent with Adjustable Learning Rate');
    
    let startPos = [3, 3]; // Default starting position
    let animationInterval = null;
    
    // Add a single point trace for the starting position
    Plotly.addTraces(divId, {
        x: [startPos[0]],
        y: [startPos[1]],
        mode: 'markers',
        marker: { size: 12, color: 'red' },
        name: 'Starting Point'
    });
    
    // Setup run button
    document.getElementById('run-gd').addEventListener('click', function() {
        // Clear any previous trajectories and animations
        if (animationInterval) clearInterval(animationInterval);
        try {
            clearTrajectory(divId);
        } catch (e) {
            // No trajectory to clear
        }
        
        const learningRate = parseFloat(document.getElementById('learning-rate-gd').value);
        
        // Run gradient descent
        const trajectory = gradientDescent(
            lossFunction.gradient,
            startPos,
            learningRate,
            50 // Number of iterations
        );
        
        // Animate the trajectory
        animationInterval = animateTrajectory(divId, trajectory, 50);
    });
    
    // Setup reset button
    document.getElementById('reset-gd').addEventListener('click', function() {
        // Clear trajectory and animation if exists
        if (animationInterval) clearInterval(animationInterval);
        try {
            clearTrajectory(divId);
        } catch (e) {
            // No trajectory to clear
        }
    });
    
    // Update learning rate display when slider changes
    document.getElementById('learning-rate-gd').addEventListener('input', function() {
        document.getElementById('learning-rate-gd-value').textContent = this.value;
    });
    
    // Setup the three fixed examples (too small, too large, optimal)
    setupFixedLearningRateExamples();
}

// Helper function to set up the three fixed learning rate examples
function setupFixedLearningRateExamples() {
    const lossFunction = lossFunctions.quadratic;
    const startPos = [3, 3];
    
    // Small learning rate example
    const smallDivId = 'gd-small';
    const smallGrid = createGrid([-5, 5], [-5, 5], 30);
    const smallComputedGrid = computeGridValues(smallGrid, lossFunction.value);
    createContourPlot(smallDivId, smallComputedGrid);
    
    const smallTrajectory = gradientDescent(
        lossFunction.gradient,
        startPos,
        0.02, // Very small learning rate
        50
    );
    plotTrajectory(smallDivId, smallTrajectory);
    
    // Large learning rate example
    const largeDivId = 'gd-large';
    const largeGrid = createGrid([-5, 5], [-5, 5], 30);
    const largeComputedGrid = computeGridValues(largeGrid, lossFunction.value);
    createContourPlot(largeDivId, largeComputedGrid);
    
    const largeTrajectory = gradientDescent(
        lossFunction.gradient,
        startPos,
        1.8, // Very large learning rate (causes oscillation)
        50
    );
    plotTrajectory(largeDivId, largeTrajectory);
    
    // Optimal learning rate example
    const optimalDivId = 'gd-optimal';
    const optimalGrid = createGrid([-5, 5], [-5, 5], 30);
    const optimalComputedGrid = computeGridValues(optimalGrid, lossFunction.value);
    createContourPlot(optimalDivId, optimalComputedGrid);
    
    const optimalTrajectory = gradientDescent(
        lossFunction.gradient,
        startPos,
        0.5, // Good learning rate
        50
    );
    plotTrajectory(optimalDivId, optimalTrajectory);
}

// Visualization 4: Momentum vs Vanilla GD
function setupMomentumComparison() {
    // Setup for vanilla GD visualization
    const vanillaDivId = 'vanilla-gd-viz';
    const lossFunction = lossFunctions.ravine; // Use Rosenbrock (ravine) to show momentum benefits
    const grid = createGrid([-1.5, 1.5], [-1, 3], 50);
    const computedGrid = computeGridValues(grid, lossFunction.value);
    
    createContourPlot(vanillaDivId, computedGrid, 'Vanilla Gradient Descent');
    
    // Setup for momentum visualization (same loss function)
    const momentumDivId = 'momentum-viz';
    createContourPlot(momentumDivId, computedGrid, 'Gradient Descent with Momentum');
    
    let startPos = [-1, 2]; // Starting position that shows the difference well
    let animationInterval = { vanilla: null, momentum: null };
    
    // Setup run button
    document.getElementById('run-momentum').addEventListener('click', function() {
        // Clear any previous trajectories and animations
        if (animationInterval.vanilla) clearInterval(animationInterval.vanilla);
        if (animationInterval.momentum) clearInterval(animationInterval.momentum);
        
        try {
            clearTrajectory(vanillaDivId);
            clearTrajectory(momentumDivId);
        } catch (e) {
            // No trajectories to clear
        }
        
        const momentumValue = parseFloat(document.getElementById('momentum-value').value);
        
        // Run vanilla gradient descent
        const vanillaTrajectory = gradientDescent(
            lossFunction.gradient,
            startPos,
            0.001, // Small learning rate to show slow progress
            100
        );
        
        // Run momentum gradient descent
        const momentumTrajectory = momentum(
            lossFunction.gradient,
            startPos,
            0.001, // Same learning rate
            momentumValue,
            100
        );
        
        // Animate both trajectories
        animationInterval.vanilla = animateTrajectory(vanillaDivId, vanillaTrajectory, 50);
        animationInterval.momentum = animateTrajectory(momentumDivId, momentumTrajectory, 50);
    });
    
    // Setup reset button
    document.getElementById('reset-momentum').addEventListener('click', function() {
        // Clear trajectories and animations if exist
        if (animationInterval.vanilla) clearInterval(animationInterval.vanilla);
        if (animationInterval.momentum) clearInterval(animationInterval.momentum);
        
        try {
            clearTrajectory(vanillaDivId);
            clearTrajectory(momentumDivId);
        } catch (e) {
            // No trajectories to clear
        }
    });
    
    // Update momentum value display when slider changes
    document.getElementById('momentum-value').addEventListener('input', function() {
        document.getElementById('momentum-value-display').textContent = this.value;
    });
}

// Visualization 5: Learning Rate Schedules
function setupLRSchedules() {
    const divId = 'lr-schedule-viz';
    const lossFunction = lossFunctions.quadratic;
    const grid = createGrid([-5, 5], [-5, 5], 50);
    const computedGrid = computeGridValues(grid, lossFunction.value);
    
    createContourPlot(divId, computedGrid, 'Learning Rate Schedules');
    
    let startPos = [4, 4];
    let animationInterval = null;
    
    // Setup run button
    document.getElementById('run-schedule').addEventListener('click', function() {
        // Clear any previous trajectory and animation
        if (animationInterval) clearInterval(animationInterval);
        try {
            clearTrajectory(divId);
        } catch (e) {
            // No trajectory to clear
        }
        
        const scheduleType = document.getElementById('schedule-select').value;
        let scheduler;
        let schedulerArgs = {};
        
        switch(scheduleType) {
            case 'constant':
                scheduler = schedulers.constant;
                break;
            case 'step':
                scheduler = schedulers.step;
                schedulerArgs = { stepSize: 10, gamma: 0.5 };
                break;
            case 'exponential':
                scheduler = schedulers.exponential;
                schedulerArgs = { gamma: 0.95 };
                break;
            case 'cosine':
                scheduler = schedulers.cosine;
                break;
        }
        
        // Run gradient descent with selected schedule
        const trajectory = scheduledGD(
            lossFunction.gradient,
            startPos,
            scheduler,
            0.3, // Initial learning rate
            80,  // More iterations to see effect
            schedulerArgs
        );
        
        // Animate the trajectory
        animationInterval = animateTrajectory(divId, trajectory, 50);
    });
    
    // Setup reset button
    document.getElementById('reset-schedule').addEventListener('click', function() {
        // Clear trajectory and animation if exists
        if (animationInterval) clearInterval(animationInterval);
        try {
            clearTrajectory(divId);
        } catch (e) {
            // No trajectory to clear
        }
    });
}

// Visualization 6: Adaptive Methods Comparison (AdaGrad and RMSProp)
function setupAdaptiveMethods() {
    // Setup for AdaGrad visualization
    const adagradDivId = 'adagrad-viz';
    const lossFunction = lossFunctions.ravine; // Use challenging function
    const grid = createGrid([-1.5, 1.5], [-1, 3], 50);
    const computedGrid = computeGridValues(grid, lossFunction.value);
    
    createContourPlot(adagradDivId, computedGrid, 'AdaGrad');
    
    // Setup for RMSProp visualization (same loss function)
    const rmspropDivId = 'rmsprop-viz';
    createContourPlot(rmspropDivId, computedGrid, 'RMSProp');
    
    let startPos = [-1, 2];
    let animationInterval = { adagrad: null, rmsprop: null };
    
    // Setup run button
    document.getElementById('run-adaptive').addEventListener('click', function() {
        // Clear any previous trajectories and animations
        if (animationInterval.adagrad) clearInterval(animationInterval.adagrad);
        if (animationInterval.rmsprop) clearInterval(animationInterval.rmsprop);
        
        try {
            clearTrajectory(adagradDivId);
            clearTrajectory(rmspropDivId);
        } catch (e) {
            // No trajectories to clear
        }
        
        // Run AdaGrad
        const adagradTrajectory = adaGrad(
            lossFunction.gradient,
            startPos,
            0.1,
            1e-8,
            100
        );
        
        // Run RMSProp
        const rmspropTrajectory = rmsProp(
            lossFunction.gradient,
            startPos,
            0.01,
            0.9,
            1e-8,
            100
        );
        
        // Animate both trajectories
        animationInterval.adagrad = animateTrajectory(adagradDivId, adagradTrajectory, 50);
        animationInterval.rmsprop = animateTrajectory(rmspropDivId, rmspropTrajectory, 50);
    });
    
    // Setup reset button
    document.getElementById('reset-adaptive').addEventListener('click', function() {
        // Clear trajectories and animations if exist
        if (animationInterval.adagrad) clearInterval(animationInterval.adagrad);
        if (animationInterval.rmsprop) clearInterval(animationInterval.rmsprop);
        
        try {
            clearTrajectory(adagradDivId);
            clearTrajectory(rmspropDivId);
        } catch (e) {
            // No trajectories to clear
        }
    });
}

// Visualization 7: Four-way Optimizer Comparison
function setupOptimizerComparison() {
    const gdDivId = 'gd-compare';
    const momentumDivId = 'momentum-compare';
    const rmspropDivId = 'rmsprop-compare';
    const adamDivId = 'adam-compare';
    
    // Default loss function
    let lossFunction = lossFunctions.rosenbrock;
    
    // Setup the initial plots
    setupComparisonPlots(lossFunction);
    
    let animationIntervals = { gd: null, momentum: null, rmsprop: null, adam: null };
    
    // Setup run button
    document.getElementById('run-comparison').addEventListener('click', function() {
        // Get selected loss function
        const functionType = document.getElementById('comparison-function').value;
        switch(functionType) {
            case 'rosenbrock':
                lossFunction = lossFunctions.rosenbrock;
                break;
            case 'beale':
                lossFunction = lossFunctions.beale;
                break;
            case 'himmelblau':
                lossFunction = lossFunctions.himmelblau;
                break;
        }
        
        // Clear previous trajectories and animations
        for (const key in animationIntervals) {
            if (animationIntervals[key]) clearInterval(animationIntervals[key]);
        }
        
        // Recreate plots with the selected function
        setupComparisonPlots(lossFunction);
        
        // Starting position that's challenging for all functions
        let startPos;
        if (functionType === 'rosenbrock') {
            startPos = [-1, 2];
        } else if (functionType === 'beale') {
            startPos = [3, 0.5];
        } else {
            startPos = [-3, -3];
        }
        
        // Run all optimizers
        const gdTrajectory = gradientDescent(lossFunction.gradient, startPos, 0.01, 100);
        const momentumTrajectory = momentum(lossFunction.gradient, startPos, 0.01, 0.9, 100);
        const rmspropTrajectory = rmsProp(lossFunction.gradient, startPos, 0.01, 0.9, 1e-8, 100);
        const adamTrajectory = adam(lossFunction.gradient, startPos, 0.01, 0.9, 0.999, 1e-8, 100);
        
        // Animate all trajectories
        animationIntervals.gd = animateTrajectory(gdDivId, gdTrajectory, 30);
        animationIntervals.momentum = animateTrajectory(momentumDivId, momentumTrajectory, 30);
        animationIntervals.rmsprop = animateTrajectory(rmspropDivId, rmspropTrajectory, 30);
        animationIntervals.adam = animateTrajectory(adamDivId, adamTrajectory, 30);
    });
    
    // Setup reset button
    document.getElementById('reset-comparison').addEventListener('click', function() {
        // Clear all trajectories and animations
        for (const key in animationIntervals) {
            if (animationIntervals[key]) clearInterval(animationIntervals[key]);
        }
        
        // Get current function and recreate plots
        const functionType = document.getElementById('comparison-function').value;
        switch(functionType) {
            case 'rosenbrock':
                lossFunction = lossFunctions.rosenbrock;
                break;
            case 'beale':
                lossFunction = lossFunctions.beale;
                break;
            case 'himmelblau':
                lossFunction = lossFunctions.himmelblau;
                break;
        }
        
        setupComparisonPlots(lossFunction);
    });
    
    // Helper function to setup comparison plots
    function setupComparisonPlots(lossFunction) {
        // Determine appropriate range based on function
        let range;
        if (lossFunction === lossFunctions.rosenbrock) {
            range = [-2, 2];
        } else if (lossFunction === lossFunctions.beale) {
            range = [-4.5, 4.5];
        } else {
            range = [-5, 5];
        }
        
        const grid = createGrid([range[0], range[1]], [range[0], range[1]], 30);
        const computedGrid = computeGridValues(grid, lossFunction.value);
        
        createContourPlot(gdDivId, computedGrid, 'GD');
        createContourPlot(momentumDivId, computedGrid, 'Momentum');
        createContourPlot(rmspropDivId, computedGrid, 'RMSProp');
        createContourPlot(adamDivId, computedGrid, 'Adam');
    }
}

// Visualization 8: Batch Size Effects
function setupBatchSizeDemo() {
    const divId = 'batch-size-viz';
    const lossFunction = lossFunctions.quadratic;
    const grid = createGrid([-5, 5], [-5, 5], 50);
    const computedGrid = computeGridValues(grid, lossFunction.value);
    
    createContourPlot(divId, computedGrid, 'Batch Size Effects on Optimization');
    
    let startPos = [4, 4];
    let animationInterval = null;
    
    // Setup run button
    document.getElementById('run-batch').addEventListener('click', function() {
        // Clear any previous trajectory and animation
        if (animationInterval) clearInterval(animationInterval);
        try {
            clearTrajectory(divId);
        } catch (e) {
            // No trajectory to clear
        }
        
        const batchSize = parseInt(document.getElementById('batch-size').value);
        
        // Run mini-batch gradient descent
        const trajectory = miniBatchGD(
            lossFunction.gradient,
            startPos,
            batchSize,
            0.1,  // Learning rate
            1.0,  // Noise magnitude
            50    // Iterations
        );
        
        // Animate the trajectory
        animationInterval = animateTrajectory(divId, trajectory, 50);
    });
    
    // Setup reset button
    document.getElementById('reset-batch').addEventListener('click', function() {
        // Clear trajectory and animation if exists
        if (animationInterval) clearInterval(animationInterval);
        try {
            clearTrajectory(divId);
        } catch (e) {
            // No trajectory to clear
        }
    });
    
    // Update batch size display when slider changes
    document.getElementById('batch-size').addEventListener('input', function() {
        document.getElementById('batch-size-value').textContent = this.value;
    });
}

// Visualization 9: Initialization Sensitivity
function setupInitializationDemo() {
    const divId = 'initialization-viz';
    const lossFunction = lossFunctions.rastrigin;  // Function with many local minima
    const grid = createGrid([-5, 5], [-5, 5], 50);
    const computedGrid = computeGridValues(grid, lossFunction.value);
    
    createContourPlot(divId, computedGrid, 'Initialization Sensitivity');
    
    let startPos = [3, 3];
    let animationInterval = null;
    
    // Add a point for the current initialization
    Plotly.addTraces(divId, {
        x: [startPos[0]],
        y: [startPos[1]],
        mode: 'markers',
        marker: { size: 12, color: 'red' },
        name: 'Starting Point'
    });
    
    // Setup randomize initialization button
    document.getElementById('randomize-init').addEventListener('click', function() {
        startPos = [
            randomInRange(-5, 5),
            randomInRange(-5, 5)
        ];
        
        Plotly.restyle(divId, {
            x: [[startPos[0]]],
            y: [[startPos[1]]]
        }, 1);
        
        // Clear any previous trajectory
        try {
            clearTrajectory(divId);
        } catch (e) {
            // No trajectory to clear
        }
    });
    
    // Setup run button
    document.getElementById('run-init').addEventListener('click', function() {
        // Clear any previous trajectory and animation
        if (animationInterval) clearInterval(animationInterval);
        try {
            clearTrajectory(divId);
        } catch (e) {
            // No trajectory to clear
        }
        
        const optimizerType = document.getElementById('init-optimizer').value;
        let trajectory;
        
        // Run selected optimizer
        switch(optimizerType) {
            case 'gd':
                trajectory = gradientDescent(lossFunction.gradient, startPos, 0.01, 100);
                break;
            case 'momentum':
                trajectory = momentum(lossFunction.gradient, startPos, 0.01, 0.9, 100);
                break;
            case 'adam':
                trajectory = adam(lossFunction.gradient, startPos, 0.01, 0.9, 0.999, 1e-8, 100);
                break;
        }
        
        // Animate the trajectory
        animationInterval = animateTrajectory(divId, trajectory, 50);
    });
    
    // Setup reset button
    document.getElementById('reset-init').addEventListener('click', function() {
        // Clear trajectory and animation if exists
        if (animationInterval) clearInterval(animationInterval);
        try {
            clearTrajectory(divId);
        } catch (e) {
            // No trajectory to clear
        }
        
        // Reset starting point
        startPos = [3, 3];
        Plotly.restyle(divId, {
            x: [[startPos[0]]],
            y: [[startPos[1]]]
        }, 1);
    });
}

// Visualization 10: Advanced Optimizers
function setupAdvancedOptimizers() {
    const divId = 'advanced-viz';
    const lossFunction = lossFunctions.ravine;
    const grid = createGrid([-1.5, 1.5], [-1, 3], 50);
    const computedGrid = computeGridValues(grid, lossFunction.value);
    
    createContourPlot(divId, computedGrid, 'Advanced Optimization Techniques');
    
    let startPos = [-1, 2];
    let animationInterval = null;
    
    // Setup run button
    document.getElementById('run-advanced').addEventListener('click', function() {
        // Clear any previous trajectory and animation
        if (animationInterval) clearInterval(animationInterval);
        try {
            clearTrajectory(divId);
        } catch (e) {
            // No trajectory to clear
        }
        
        const optimizerType = document.getElementById('advanced-optimizer').value;
        let trajectory;
        
        // Run selected optimizer
        switch(optimizerType) {
            case 'sgd':
                trajectory = sgd(lossFunction.gradient, startPos, 0.001, 0.2, 100);
                break;
            case 'adam':
                trajectory = adam(lossFunction.gradient, startPos, 0.01, 0.9, 0.999, 1e-8, 100);
                break;
            case 'radam':
                trajectory = radam(lossFunction.gradient, startPos, 0.01, 0.9, 0.999, 1e-8, 100);
                break;
            case 'lookahead':
                trajectory = lookahead(
                    adam, // Use Adam as the base optimizer
                    lossFunction.gradient,
                    startPos,
                    5,   // k - number of inner steps
                    0.5, // alpha - slow weights update rate
                    {    // Base optimizer args
                        learningRate: 0.01,
                        beta1: 0.9,
                        beta2: 0.999,
                        epsilon: 1e-8
                    },
                    100  // Total iterations
                );
                break;
        }
        
        // Animate the trajectory
        animationInterval = animateTrajectory(divId, trajectory, 50);
    });
    
    // Setup reset button
    document.getElementById('reset-advanced').addEventListener('click', function() {
        // Clear trajectory and animation if exists
        if (animationInterval) clearInterval(animationInterval);
        try {
            clearTrajectory(divId);
        } catch (e) {
            // No trajectory to clear
        }
    });
}

// Visualization 11: Final Challenge
function setupChallenge() {
    const divId = 'challenge-viz';
    const lossFunction = lossFunctions.himmelblau;  // Function with multiple local minima
    const grid = createGrid([-5, 5], [-5, 5], 50);
    const computedGrid = computeGridValues(grid, lossFunction.value);
    
    createContourPlot(divId, computedGrid, 'Optimization Challenge');
    
    let startPos = [-4, 4];
    let animationInterval = null;
    let baselineResults = null;
    
    // Add a point for the starting position
    Plotly.addTraces(divId, {
        x: [startPos[0]],
        y: [startPos[1]],
        mode: 'markers',
        marker: { size: 12, color: 'red' },
        name: 'Starting Point'
    });
    
    // Show/hide momentum slider based on optimizer selection
    document.getElementById('challenge-optimizer').addEventListener('change', function() {
        if (this.value === 'momentum') {
            document.getElementById('momentum-slider').style.display = 'flex';
        } else {
            document.getElementById('momentum-slider').style.display = 'none';
        }
    });
    
    // Update learning rate and momentum value displays
    document.getElementById('challenge-lr').addEventListener('input', function() {
        document.getElementById('challenge-lr-value').textContent = this.value;
    });
    
    document.getElementById('challenge-momentum').addEventListener('input', function() {
        document.getElementById('challenge-momentum-value').textContent = this.value;
    });
    
    // Setup run button
    document.getElementById('run-challenge').addEventListener('click', function() {
        // Clear any previous trajectory and animation
        if (animationInterval) clearInterval(animationInterval);
        try {
            clearTrajectory(divId);
        } catch (e) {
            // No trajectory to clear
        }
        
        const optimizerType = document.getElementById('challenge-optimizer').value;
        const learningRate = parseFloat(document.getElementById('challenge-lr').value);
        let trajectory;
        let optimizerName;
        
        // Run selected optimizer
        switch(optimizerType) {
            case 'gd':
                trajectory = gradientDescent(lossFunction.gradient, startPos, learningRate, 100);
                optimizerName = 'Gradient Descent';
                break;
            case 'momentum':
                const momentumValue = parseFloat(document.getElementById('challenge-momentum').value);
                trajectory = momentum(lossFunction.gradient, startPos, learningRate, momentumValue, 100);
                optimizerName = 'Momentum';
                break;
            case 'rmsprop':
                trajectory = rmsProp(lossFunction.gradient, startPos, learningRate, 0.9, 1e-8, 100);
                optimizerName = 'RMSProp';
                break;
            case 'adam':
                trajectory = adam(lossFunction.gradient, startPos, learningRate, 0.9, 0.999, 1e-8, 100);
                optimizerName = 'Adam';
                // Save the Adam result as baseline
                baselineResults = calculateOptimizationMetrics(trajectory, lossFunction.value);
                break;
        }
        
        // Animate the trajectory
        animationInterval = animateTrajectory(divId, trajectory, 50, function() {
            // Calculate metrics after animation completes
            const metrics = calculateOptimizationMetrics(trajectory, lossFunction.value);
            
            // Display results
            let resultsHTML = `<h4>${optimizerName} Results:</h4>
                              <p>Final Loss: ${metrics.finalLoss.toFixed(6)}</p>
                              <p>Steps to Convergence: ${metrics.stepsToConvergence}</p>`;
            
            // Compare with baseline if available
            if (baselineResults && optimizerType !== 'adam') {
                const lossImprovement = ((baselineResults.finalLoss - metrics.finalLoss) / baselineResults.finalLoss) * 100;
                const speedImprovement = ((baselineResults.stepsToConvergence - metrics.stepsToConvergence) / baselineResults.stepsToConvergence) * 100;
                
                resultsHTML += `<h4>Compared to Adam:</h4>
                              <p>Loss Improvement: ${lossImprovement.toFixed(2)}%</p>
                              <p>Speed Improvement: ${speedImprovement.toFixed(2)}%</p>`;
                
                if (lossImprovement > 0 && speedImprovement > 0) {
                    resultsHTML += `<p class="success">Congratulations! You outperformed Adam!</p>`;
                }
            }
            
            document.getElementById('challenge-results').innerHTML = resultsHTML;
        });
    });
    
    // Setup reset button
    document.getElementById('reset-challenge').addEventListener('click', function() {
        // Clear trajectory and animation if exists
        if (animationInterval) clearInterval(animationInterval);
        try {
            clearTrajectory(divId);
        } catch (e) {
            // No trajectory to clear
        }
        
        // Clear results
        document.getElementById('challenge-results').innerHTML = '';
    });
}

// Initialize all visualizations when the page loads
window.addEventListener('load', function() {
    setupSimple2DDemo();
    setup3DLandscape();
    setupGDDemo();
    setupMomentumComparison();
    setupLRSchedules();
    setupAdaptiveMethods();
    setupOptimizerComparison();
    setupBatchSizeDemo();
    setupInitializationDemo();
    setupAdvancedOptimizers();
    setupChallenge();
}); 