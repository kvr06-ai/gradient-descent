/**
 * Optimizer implementations for gradient descent visualizations
 */

// Basic Gradient Descent optimizer
function gradientDescent(gradientFunc, initialParams, learningRate = 0.1, numIterations = 100) {
    const trajectory = [initialParams.slice()]; // Copy initial parameters
    let currentParams = initialParams.slice();
    
    for (let i = 0; i < numIterations; i++) {
        // Calculate gradient at current parameters
        const gradient = gradientFunc(currentParams);
        
        // Update parameters in the negative gradient direction
        currentParams = currentParams.map((param, idx) => param - learningRate * gradient[idx]);
        
        // Store current parameters for visualization
        trajectory.push(currentParams.slice());
    }
    
    return trajectory;
}

// Gradient Descent with Momentum
function momentum(gradientFunc, initialParams, learningRate = 0.1, momentumCoef = 0.9, numIterations = 100) {
    const trajectory = [initialParams.slice()];
    let currentParams = initialParams.slice();
    let velocity = Array(initialParams.length).fill(0);
    
    for (let i = 0; i < numIterations; i++) {
        // Calculate gradient at current parameters
        const gradient = gradientFunc(currentParams);
        
        // Update velocity (momentum term)
        velocity = velocity.map((v, idx) => momentumCoef * v - learningRate * gradient[idx]);
        
        // Update parameters using velocity
        currentParams = currentParams.map((param, idx) => param + velocity[idx]);
        
        // Store current parameters for visualization
        trajectory.push(currentParams.slice());
    }
    
    return trajectory;
}

// AdaGrad optimizer (adaptive learning rates per parameter)
function adaGrad(gradientFunc, initialParams, learningRate = 0.1, epsilon = 1e-8, numIterations = 100) {
    const trajectory = [initialParams.slice()];
    let currentParams = initialParams.slice();
    const accumulatedGradSq = Array(initialParams.length).fill(0); // Accumulated squared gradients
    
    for (let i = 0; i < numIterations; i++) {
        // Calculate gradient at current parameters
        const gradient = gradientFunc(currentParams);
        
        // Update accumulated squared gradients
        for (let j = 0; j < accumulatedGradSq.length; j++) {
            accumulatedGradSq[j] += gradient[j] * gradient[j];
        }
        
        // Update parameters with adaptive learning rates
        currentParams = currentParams.map((param, idx) => 
            param - (learningRate / (Math.sqrt(accumulatedGradSq[idx]) + epsilon)) * gradient[idx]
        );
        
        // Store current parameters for visualization
        trajectory.push(currentParams.slice());
    }
    
    return trajectory;
}

// RMSProp optimizer (similar to AdaGrad but with decay)
function rmsProp(gradientFunc, initialParams, learningRate = 0.01, decayRate = 0.9, epsilon = 1e-8, numIterations = 100) {
    const trajectory = [initialParams.slice()];
    let currentParams = initialParams.slice();
    const accumulatedGradSq = Array(initialParams.length).fill(0);
    
    for (let i = 0; i < numIterations; i++) {
        // Calculate gradient at current parameters
        const gradient = gradientFunc(currentParams);
        
        // Update accumulated squared gradients with decay
        for (let j = 0; j < accumulatedGradSq.length; j++) {
            accumulatedGradSq[j] = decayRate * accumulatedGradSq[j] + (1 - decayRate) * gradient[j] * gradient[j];
        }
        
        // Update parameters with adaptive learning rates
        currentParams = currentParams.map((param, idx) => 
            param - (learningRate / (Math.sqrt(accumulatedGradSq[idx]) + epsilon)) * gradient[idx]
        );
        
        // Store current parameters for visualization
        trajectory.push(currentParams.slice());
    }
    
    return trajectory;
}

// Adam optimizer (combines momentum and RMSProp)
function adam(gradientFunc, initialParams, 
             learningRate = 0.001, beta1 = 0.9, beta2 = 0.999, 
             epsilon = 1e-8, numIterations = 100) {
    const trajectory = [initialParams.slice()];
    let currentParams = initialParams.slice();
    const m = Array(initialParams.length).fill(0); // First moment estimate (momentum)
    const v = Array(initialParams.length).fill(0); // Second moment estimate (RMSProp)
    
    for (let t = 1; t <= numIterations; t++) {
        // Calculate gradient at current parameters
        const gradient = gradientFunc(currentParams);
        
        // Update biased first and second moment estimates
        for (let j = 0; j < m.length; j++) {
            m[j] = beta1 * m[j] + (1 - beta1) * gradient[j];
            v[j] = beta2 * v[j] + (1 - beta2) * gradient[j] * gradient[j];
        }
        
        // Compute bias-corrected moment estimates
        const mCorrected = m.map(val => val / (1 - Math.pow(beta1, t)));
        const vCorrected = v.map(val => val / (1 - Math.pow(beta2, t)));
        
        // Update parameters
        currentParams = currentParams.map((param, idx) => 
            param - learningRate * mCorrected[idx] / (Math.sqrt(vCorrected[idx]) + epsilon)
        );
        
        // Store current parameters for visualization
        trajectory.push(currentParams.slice());
    }
    
    return trajectory;
}

// RAdam (Rectified Adam) optimizer
function radam(gradientFunc, initialParams, 
             learningRate = 0.001, beta1 = 0.9, beta2 = 0.999, 
             epsilon = 1e-8, numIterations = 100) {
    const trajectory = [initialParams.slice()];
    let currentParams = initialParams.slice();
    const m = Array(initialParams.length).fill(0); // First moment estimate
    const v = Array(initialParams.length).fill(0); // Second moment estimate
    const rho_inf = 2 / (1 - beta2) - 1;
    
    for (let t = 1; t <= numIterations; t++) {
        // Calculate gradient at current parameters
        const gradient = gradientFunc(currentParams);
        
        // Update biased first and second moment estimates
        for (let j = 0; j < m.length; j++) {
            m[j] = beta1 * m[j] + (1 - beta1) * gradient[j];
            v[j] = beta2 * v[j] + (1 - beta2) * gradient[j] * gradient[j];
        }
        
        // Compute bias-corrected second moment estimate
        const vCorrected = v.map(val => val / (1 - Math.pow(beta2, t)));
        
        // Compute length of the approximated SMA
        const rho_t = rho_inf - 2 * t * Math.pow(beta2, t) / (1 - Math.pow(beta2, t));
        
        // Update parameters
        for (let j = 0; j < currentParams.length; j++) {
            let update;
            if (rho_t > 4) {
                // Variance is tractable
                const r_t = Math.sqrt((rho_t - 4) * (rho_t - 2) * rho_inf / ((rho_inf - 4) * (rho_inf - 2) * rho_t));
                const mCorrected = m[j] / (1 - Math.pow(beta1, t));
                update = r_t * mCorrected / (Math.sqrt(vCorrected[j]) + epsilon);
            } else {
                // Variance is not tractable, default to SGD
                update = m[j] / (1 - Math.pow(beta1, t));
            }
            currentParams[j] -= learningRate * update;
        }
        
        // Store current parameters for visualization
        trajectory.push(currentParams.slice());
    }
    
    return trajectory;
}

// Lookahead optimizer (meta-optimizer that can work with any base optimizer)
function lookahead(baseOptimizer, gradientFunc, initialParams, 
                  k = 5, alpha = 0.5, baseOptimizerArgs = {}, numIterations = 100) {
    const trajectory = [initialParams.slice()];
    let slowParams = initialParams.slice(); // Slow weights
    let fastParams; // Fast weights
    
    const totalSteps = Math.floor(numIterations / k) * k;
    
    for (let i = 0; i < totalSteps; i += k) {
        // Reset fast parameters to current slow parameters
        fastParams = slowParams.slice();
        
        // Run base optimizer for k steps
        const fastTrajectory = baseOptimizer(
            gradientFunc, 
            fastParams,
            ...Object.values(baseOptimizerArgs),
            k // Only run for k iterations
        );
        
        // Record intermediate steps in the trajectory
        for (let j = 1; j < fastTrajectory.length; j++) {
            trajectory.push(fastTrajectory[j]);
        }
        
        // Update slow parameters using lookahead update rule
        const finalFastParams = fastTrajectory[fastTrajectory.length - 1];
        slowParams = slowParams.map((param, idx) => 
            param + alpha * (finalFastParams[idx] - param)
        );
        
        // Add the slow parameter update to the trajectory
        trajectory.push(slowParams.slice());
    }
    
    return trajectory;
}

// Stochastic Gradient Descent (SGD) with noise
function sgd(gradientFunc, initialParams, learningRate = 0.1, noiseMagnitude = 0.5, numIterations = 100) {
    const trajectory = [initialParams.slice()];
    let currentParams = initialParams.slice();
    
    for (let i = 0; i < numIterations; i++) {
        // Calculate gradient at current parameters with added noise
        const gradient = addNoiseToGradient(gradientFunc(currentParams), noiseMagnitude);
        
        // Update parameters in the negative gradient direction
        currentParams = currentParams.map((param, idx) => param - learningRate * gradient[idx]);
        
        // Store current parameters for visualization
        trajectory.push(currentParams.slice());
    }
    
    return trajectory;
}

// Mini-batch Gradient Descent
function miniBatchGD(gradientFunc, initialParams, batchSize = 10, learningRate = 0.1, noiseMagnitude = 1.0, numIterations = 100) {
    const trajectory = [initialParams.slice()];
    let currentParams = initialParams.slice();
    
    for (let i = 0; i < numIterations; i++) {
        // Calculate batch gradient
        const batchGradient = computeBatchGradient(gradientFunc, currentParams, batchSize, noiseMagnitude);
        
        // Update parameters in the negative gradient direction
        currentParams = currentParams.map((param, idx) => param - learningRate * batchGradient[idx]);
        
        // Store current parameters for visualization
        trajectory.push(currentParams.slice());
    }
    
    return trajectory;
}

// Learning rate schedulers
const schedulers = {
    // Constant learning rate
    constant: (initialLR, iteration, totalIterations) => initialLR,
    
    // Step decay (reduce by factor every specified number of iterations)
    step: (initialLR, iteration, totalIterations, stepSize = 20, gamma = 0.5) => 
        initialLR * Math.pow(gamma, Math.floor(iteration / stepSize)),
    
    // Exponential decay
    exponential: (initialLR, iteration, totalIterations, gamma = 0.95) => 
        initialLR * Math.pow(gamma, iteration),
    
    // Cosine annealing
    cosine: (initialLR, iteration, totalIterations) => 
        initialLR * 0.5 * (1 + Math.cos(Math.PI * iteration / totalIterations))
};

// Gradient descent with learning rate scheduling
function scheduledGD(gradientFunc, initialParams, scheduler = schedulers.constant, 
                    initialLR = 0.1, numIterations = 100, schedulerArgs = {}) {
    const trajectory = [initialParams.slice()];
    let currentParams = initialParams.slice();
    
    for (let i = 0; i < numIterations; i++) {
        // Calculate gradient at current parameters
        const gradient = gradientFunc(currentParams);
        
        // Get learning rate from scheduler
        const lr = scheduler(initialLR, i, numIterations, ...Object.values(schedulerArgs));
        
        // Update parameters in the negative gradient direction
        currentParams = currentParams.map((param, idx) => param - lr * gradient[idx]);
        
        // Store current parameters for visualization
        trajectory.push(currentParams.slice());
    }
    
    return trajectory;
} 