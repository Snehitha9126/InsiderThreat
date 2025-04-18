// charts.js - Responsible for rendering charts and visualizations

// Function to set up charts when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the dashboard page and have visualization data
    const dashboardTab = document.getElementById('dashboard-tab');
    const vizDataElement = document.getElementById('viz-data');
    
    if (dashboardTab && dashboardTab.classList.contains('active') && vizDataElement) {
        const vizData = JSON.parse(vizDataElement.textContent);
        setupCharts(vizData);
    }
    
    // Check if we're on the model page
    const modelTab = document.getElementById('model-tab');
    const metricsElement = document.getElementById('metrics-data');
    
    if (modelTab && modelTab.classList.contains('active') && metricsElement) {
        const metricsData = JSON.parse(metricsElement.textContent);
        setupMetricsCharts(metricsData);
    }
});

// Function to set up dashboard charts
function setupCharts(data) {
    // Create prediction results chart
    createPredictionChart(data);
    
    // Create probability distribution chart
    createProbabilityChart(data);
}

// Function to create the prediction results chart
function createPredictionChart(data) {
    const ctx = document.getElementById('prediction-chart').getContext('2d');
    
    // Count predictions
    const counts = [0, 0]; // [normal, threat]
    data.predictions.forEach(pred => {
        counts[pred]++;
    });
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Normal Activity', 'Threat Detected'],
            datasets: [{
                data: counts,
                backgroundColor: [
                    'rgba(77, 208, 225, 0.8)',
                    'rgba(255, 99, 132, 0.8)'
                ],
                borderColor: [
                    'rgba(77, 208, 225, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#f5f5f5'
                    }
                },
                title: {
                    display: true,
                    text: 'Prediction Results Distribution',
                    color: '#f5f5f5',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

// Function to create the probability distribution chart
function createProbabilityChart(data) {
    const ctx = document.getElementById('probability-chart').getContext('2d');
    
    const backgroundColors = data.predictions.map(pred => 
        pred === 1 ? 'rgba(255, 99, 132, 0.8)' : 'rgba(77, 208, 225, 0.8)'
    );
    
    const borderColors = data.predictions.map(pred => 
        pred === 1 ? 'rgba(255, 99, 132, 1)' : 'rgba(77, 208, 225, 1)'
    );
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Threat Probability',
                data: data.probabilities,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                        color: '#f5f5f5'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#f5f5f5',
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#f5f5f5'
                    }
                },
                title: {
                    display: true,
                    text: 'Threat Probability by Record',
                    color: '#f5f5f5',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

// Function to create the metrics visualization chart
function setupMetricsCharts(metrics) {
    const ctx = document.getElementById('metrics-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Accuracy', 'Precision', 'Recall', 'F1 Score', 'AUC'],
            datasets: [{
                label: 'Model Performance',
                data: [
                    metrics.accuracy, 
                    metrics.precision, 
                    metrics.recall, 
                    metrics.f1_score, 
                    metrics.auc
                ],
                backgroundColor: 'rgba(79, 195, 247, 0.3)',
                borderColor: 'rgba(79, 195, 247, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(79, 195, 247, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(79, 195, 247, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    min: 0,
                    max: 1,
                    ticks: {
                        color: '#f5f5f5',
                        backdropColor: 'transparent'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    },
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    },
                    pointLabels: {
                        color: '#f5f5f5',
                        font: {
                            size: 14
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#f5f5f5'
                    }
                },
                title: {
                    display: true,
                    text: 'BiLSTM+Attention Model Performance Metrics',
                    color: '#f5f5f5',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
    
    // Create performance comparison chart
    const ctxBar = document.getElementById('comparison-chart').getContext('2d');
    
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['BiLSTM+Attention', 'LSTM', 'Random Forest', 'SVM'],
            datasets: [{
                label: 'Accuracy',
                data: [metrics.accuracy, 0.87, 0.84, 0.81],
                backgroundColor: 'rgba(79, 195, 247, 0.8)',
                borderColor: 'rgba(79, 195, 247, 1)',
                borderWidth: 1
            }, {
                label: 'F1 Score',
                data: [metrics.f1_score, 0.86, 0.83, 0.79],
                backgroundColor: 'rgba(255, 183, 77, 0.8)',
                borderColor: 'rgba(255, 183, 77, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                        color: '#f5f5f5'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#f5f5f5'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#f5f5f5'
                    }
                },
                title: {
                    display: true,
                    text: 'Performance Comparison with Other Models',
                    color: '#f5f5f5',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}
