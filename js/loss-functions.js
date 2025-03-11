/**
 * Loss functions and their gradients for optimization visualization
 */

// Simple quadratic function (bowl shape)
const quadratic = {
    // f(x, y) = x^2 + y^2
    value: (params) => {
        const [x, y] = params;
        return x*x + y*y;
    },
    // ∇f = [2x, 2y]
    gradient: (params) => {
        const [x, y] = params;
        return [2*x, 2*y];
    },
    // Default range for visualization
    range: [-5, 5]
};

// Rosenbrock function (banana shape) - challenging non-convex function
const rosenbrock = {
    // f(x, y) = (1-x)^2 + 100(y-x^2)^2
    value: (params) => {
        const [x, y] = params;
        return Math.pow(1 - x, 2) + 100 * Math.pow(y - x*x, 2);
    },
    // ∇f = [-2(1-x) - 400x(y-x^2), 200(y-x^2)]
    gradient: (params) => {
        const [x, y] = params;
        return [
            -2 * (1 - x) - 400 * x * (y - x*x),
            200 * (y - x*x)
        ];
    },
    // Default range for visualization
    range: [-2, 2]
};

// Beale function - another challenging non-convex function
const beale = {
    // f(x, y) = (1.5 - x + xy)^2 + (2.25 - x + xy^2)^2 + (2.625 - x + xy^3)^2
    value: (params) => {
        const [x, y] = params;
        return Math.pow(1.5 - x + x*y, 2) + 
               Math.pow(2.25 - x + x*y*y, 2) + 
               Math.pow(2.625 - x + x*y*y*y, 2);
    },
    // Gradient calculated using partial derivatives
    gradient: (params) => {
        const [x, y] = params;
        const term1 = 1.5 - x + x*y;
        const term2 = 2.25 - x + x*y*y;
        const term3 = 2.625 - x + x*y*y*y;
        
        const dx = -2*term1 + 2*y*term1 - 2*term2 + 2*y*y*term2 - 2*term3 + 2*y*y*y*term3;
        const dy = 2*x*term1 + 4*x*y*term2 + 6*x*y*y*term3;
        
        return [dx, dy];
    },
    // Default range for visualization
    range: [-4.5, 4.5]
};

// Himmelblau's function - has 4 identical local minima
const himmelblau = {
    // f(x, y) = (x^2 + y - 11)^2 + (x + y^2 - 7)^2
    value: (params) => {
        const [x, y] = params;
        return Math.pow(x*x + y - 11, 2) + Math.pow(x + y*y - 7, 2);
    },
    // Gradient calculated using partial derivatives
    gradient: (params) => {
        const [x, y] = params;
        const term1 = x*x + y - 11;
        const term2 = x + y*y - 7;
        
        const dx = 4*x*term1 + 2*term2;
        const dy = 2*term1 + 4*y*term2;
        
        return [dx, dy];
    },
    // Default range for visualization
    range: [-5, 5]
};

// Rastrigin function - highly multimodal with many local minima
const rastrigin = {
    // f(x, y) = 20 + x^2 - 10*cos(2π*x) + y^2 - 10*cos(2π*y)
    value: (params) => {
        const [x, y] = params;
        return 20 + x*x - 10*Math.cos(2*Math.PI*x) + y*y - 10*Math.cos(2*Math.PI*y);
    },
    // Gradient calculated using partial derivatives
    gradient: (params) => {
        const [x, y] = params;
        const dx = 2*x + 20*Math.PI*Math.sin(2*Math.PI*x);
        const dy = 2*y + 20*Math.PI*Math.sin(2*Math.PI*y);
        return [dx, dy];
    },
    // Default range for visualization
    range: [-5.12, 5.12]
};

// Saddle function - has a saddle point at origin
const saddle = {
    // f(x, y) = x^2 - y^2
    value: (params) => {
        const [x, y] = params;
        return x*x - y*y;
    },
    // ∇f = [2x, -2y]
    gradient: (params) => {
        const [x, y] = params;
        return [2*x, -2*y];
    },
    // Default range for visualization
    range: [-3, 3]
};

// Ravine function (pathological curvature) - challenges optimizers
const ravine = {
    // f(x, y) = (1-x)^2 + 100(y-x^2)^2
    // This is the same as Rosenbrock but we define it separately to control visualization
    value: (params) => {
        const [x, y] = params;
        return Math.pow(1 - x, 2) + 100 * Math.pow(y - x*x, 2);
    },
    // Same gradient as Rosenbrock
    gradient: (params) => {
        const [x, y] = params;
        return [
            -2 * (1 - x) - 400 * x * (y - x*x),
            200 * (y - x*x)
        ];
    },
    // Different default range for visualization
    range: [-1.5, 1.5]
};

// Ackley function - looks simple from a distance but has many local minima
const ackley = {
    // Complex formula with exponentials
    value: (params) => {
        const [x, y] = params;
        const term1 = -20 * Math.exp(-0.2 * Math.sqrt(0.5 * (x*x + y*y)));
        const term2 = -Math.exp(0.5 * (Math.cos(2*Math.PI*x) + Math.cos(2*Math.PI*y)));
        return term1 + term2 + Math.E + 20;
    },
    // Gradient calculated using partial derivatives
    gradient: (params) => {
        const [x, y] = params;
        const expTerm1 = Math.exp(-0.2 * Math.sqrt(0.5 * (x*x + y*y)));
        const expTerm2 = Math.exp(0.5 * (Math.cos(2*Math.PI*x) + Math.cos(2*Math.PI*y)));
        
        // Handle the case where we're very close to the origin to avoid division by zero
        if (Math.abs(x) < 1e-10 && Math.abs(y) < 1e-10) {
            return [0, 0];
        }
        
        const sqrtTerm = Math.sqrt(0.5 * (x*x + y*y));
        
        const dx = (2 * Math.PI * expTerm2 * Math.sin(2*Math.PI*x)) / 2 + 
                   (20 * expTerm1 * 0.2 * 0.5 * 2 * x) / (2 * sqrtTerm);
        const dy = (2 * Math.PI * expTerm2 * Math.sin(2*Math.PI*y)) / 2 + 
                   (20 * expTerm1 * 0.2 * 0.5 * 2 * y) / (2 * sqrtTerm);
        
        return [dx, dy];
    },
    // Default range for visualization
    range: [-5, 5]
};

// Function to add noise to a gradient (for stochastic gradient visualization)
function addNoiseToGradient(gradient, noiseMagnitude = 0.5) {
    return gradient.map(component => 
        component + (Math.random() * 2 - 1) * noiseMagnitude
    );
}

// Function to compute batch gradient (average of multiple gradient computations with noise)
function computeBatchGradient(gradientFunc, params, batchSize = 10, noiseMagnitude = 1.0) {
    let sumGradient = [0, 0];
    
    for (let i = 0; i < batchSize; i++) {
        const noisyGradient = addNoiseToGradient(gradientFunc(params), noiseMagnitude);
        sumGradient[0] += noisyGradient[0];
        sumGradient[1] += noisyGradient[1];
    }
    
    return sumGradient.map(sum => sum / batchSize);
}

// Export loss functions for use in other modules
const lossFunctions = {
    quadratic,
    rosenbrock,
    beale,
    himmelblau,
    rastrigin,
    saddle,
    ravine,
    ackley
}; 