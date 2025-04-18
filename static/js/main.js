// main.js - Main JavaScript functionality for the application

document.addEventListener('DOMContentLoaded', function() {
    // Initialize file upload functionality
    initFileUpload();
    
    // Initialize flash message dismissal
    initFlashMessages();
    
    // Initialize any tooltips
    initTooltips();
});

// Initialize the file upload functionality
function initFileUpload() {
    const fileInput = document.getElementById('file-input');
    const fileLabel = document.getElementById('file-label');
    const fileName = document.getElementById('file-name');
    
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            if (fileInput.files.length > 0) {
                fileName.textContent = fileInput.files[0].name;
                fileName.style.display = 'block';
            } else {
                fileName.textContent = '';
                fileName.style.display = 'none';
            }
        });
        
        // Add drag and drop functionality
        const fileUpload = document.querySelector('.file-upload');
        
        if (fileUpload) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                fileUpload.addEventListener(eventName, preventDefaults, false);
            });
            
            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            ['dragenter', 'dragover'].forEach(eventName => {
                fileUpload.addEventListener(eventName, highlight, false);
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                fileUpload.addEventListener(eventName, unhighlight, false);
            });
            
            function highlight() {
                fileUpload.classList.add('highlighted');
            }
            
            function unhighlight() {
                fileUpload.classList.remove('highlighted');
            }
            
            fileUpload.addEventListener('drop', handleDrop, false);
            
            function handleDrop(e) {
                const dt = e.dataTransfer;
                const files = dt.files;
                
                if (files.length > 0) {
                    fileInput.files = files;
                    fileName.textContent = files[0].name;
                    fileName.style.display = 'block';
                }
            }
        }
    }
}

// Initialize flash message dismissal
function initFlashMessages() {
    const flashMessages = document.querySelectorAll('.alert');
    
    flashMessages.forEach(message => {
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.className = 'close-btn';
        closeButton.onclick = function() {
            message.style.display = 'none';
        };
        
        message.appendChild(closeButton);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => {
                message.style.display = 'none';
            }, 500);
        }, 5000);
    });
}

// Initialize tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            
            const tooltipElement = document.createElement('div');
            tooltipElement.className = 'tooltip';
            tooltipElement.textContent = tooltipText;
            
            document.body.appendChild(tooltipElement);
            
            const rect = this.getBoundingClientRect();
            tooltipElement.style.left = rect.left + (rect.width / 2) - (tooltipElement.offsetWidth / 2) + 'px';
            tooltipElement.style.top = rect.top - tooltipElement.offsetHeight - 10 + 'px';
            
            tooltipElement.style.opacity = '1';
        });
        
        tooltip.addEventListener('mouseleave', function() {
            const tooltipElement = document.querySelector('.tooltip');
            if (tooltipElement) {
                tooltipElement.style.opacity = '0';
                setTimeout(() => {
                    tooltipElement.parentNode.removeChild(tooltipElement);
                }, 300);
            }
        });
    });
}

// Add active class to current tab
function setActiveTab() {
    const path = window.location.pathname;
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        const href = tab.getAttribute('href');
        if (href === path) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}
