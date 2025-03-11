/**
 * Main JavaScript file for the Gradient Descent visualization article.
 * Provides global setup and initialization.
 */

// Monitor for any resize events and update plots accordingly
window.addEventListener('resize', debounce(function() {
    // Resize all Plotly graphs to fit the new window size
    const graphs = document.querySelectorAll('.visualization-container, .small-viz, .comparison-viz');
    for (const graph of graphs) {
        if (graph.data && graph.layout) {
            Plotly.relayout(graph.id, {
                width: graph.offsetWidth,
                height: graph.offsetHeight
            });
        }
    }
}, 250));

// Add scroll reveals for sections
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    
    // Simple scroll reveal effect
    const revealSection = function() {
        for (const section of sections) {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.85) {
                section.classList.add('visible');
            }
        }
    };
    
    // Add visible class for initial view
    revealSection();
    
    // Listen for scroll events
    window.addEventListener('scroll', revealSection);
});

// Global settings for Plotly
Plotly.setPlotConfig({
    modeBarButtonsToRemove: ['sendDataToCloud', 'editInChartStudio', 'lasso2d', 'select2d'],
    displaylogo: false,
    responsive: true
});

// Helper function to get URL parameters (for potential future use)
function getUrlParameter(name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Add keyboard navigation for accessible control
document.addEventListener('keydown', function(event) {
    // Alt + arrow keys for navigation between sections
    if (event.altKey) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
            // Navigate to next section
            const currentSection = document.querySelector('section:target') || document.querySelector('section');
            const nextSection = currentSection.nextElementSibling;
            if (nextSection && nextSection.tagName === 'SECTION') {
                window.location.hash = nextSection.id;
                event.preventDefault();
            }
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
            // Navigate to previous section
            const currentSection = document.querySelector('section:target') || document.querySelector('section:last-of-type');
            const prevSection = currentSection.previousElementSibling;
            if (prevSection && prevSection.tagName === 'SECTION') {
                window.location.hash = prevSection.id;
                event.preventDefault();
            }
        }
    }
});

// Helper function to show/hide elements by ID
function toggleElementVisibility(elementId, isVisible) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = isVisible ? 'block' : 'none';
    }
}

// Add CSS class for smooth animations
document.documentElement.classList.add('js-enabled');

console.log('Gradient Descent Visualization initialized successfully!'); 