import os
import logging
import pandas as pd
import numpy as np
import datetime
from flask import Flask, render_template, request, jsonify, flash, redirect, url_for, session
from werkzeug.utils import secure_filename
import uuid
import json
from model import InsiderThreatModel
from data_processor import DataProcessor

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_secret_key")

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Context processor to provide variables to all templates
@app.context_processor
def inject_now():
    return {'now': datetime.datetime.now()}

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv', 'json', 'xlsx', 'xls'}

# Create upload folder if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max-limit

# Initialize model and data processor
model = InsiderThreatModel()
data_processor = DataProcessor()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html', active_tab='home')

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # Check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part', 'error')
            return redirect(request.url)
        
        file = request.files['file']
        
        # If user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file', 'error')
            return redirect(request.url)
        
        if file and allowed_file(file.filename):
            # Generate unique filename to avoid conflicts
            unique_filename = str(uuid.uuid4()) + '_' + secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(filepath)
            
            try:
                # Process the file
                processed_data = data_processor.process_file(filepath)
                
                # Make predictions
                predictions, probabilities = model.predict(processed_data)
                
                # Get metrics
                metrics = model.get_metrics()
                
                # Store results in session
                session['predictions'] = predictions.tolist() if isinstance(predictions, np.ndarray) else predictions
                session['probabilities'] = probabilities.tolist() if isinstance(probabilities, np.ndarray) else probabilities
                session['metrics'] = metrics
                
                # Prepare summary data
                threat_count = sum(1 for p in predictions if p == 1)
                normal_count = sum(1 for p in predictions if p == 0)
                
                session['summary'] = {
                    'total_records': len(predictions),
                    'threat_count': threat_count,
                    'normal_count': normal_count,
                    'threat_percentage': (threat_count / len(predictions)) * 100 if len(predictions) > 0 else 0
                }
                
                flash('File successfully processed', 'success')
                return redirect(url_for('dashboard'))
            
            except Exception as e:
                logger.error(f"Error processing file: {str(e)}")
                flash(f'Error processing file: {str(e)}', 'error')
                return redirect(request.url)
    
    return render_template('index.html', active_tab='upload')

@app.route('/dashboard')
def dashboard():
    if 'predictions' not in session:
        flash('No analysis data available. Please upload a file first.', 'warning')
        return redirect(url_for('upload_file'))
    
    predictions = session.get('predictions', [])
    probabilities = session.get('probabilities', [])
    metrics = session.get('metrics', {})
    summary = session.get('summary', {})
    
    # Create sample data for visualization
    # Only taking first 20 entries for visualization to avoid cluttering
    viz_data = {
        'labels': [f"Record {i+1}" for i in range(min(20, len(predictions)))],
        'predictions': predictions[:20],
        'probabilities': probabilities[:20]
    }
    
    return render_template(
        'index.html', 
        active_tab='dashboard',
        viz_data=json.dumps(viz_data),
        metrics=metrics,
        summary=summary
    )

@app.route('/model')
def model_info():
    # Get model metrics for display
    metrics = model.get_metrics()
    return render_template('index.html', active_tab='model', metrics=metrics)

@app.route('/about')
def about():
    return render_template('index.html', active_tab='about')

@app.errorhandler(404)
def page_not_found(e):
    return render_template('index.html', active_tab='error', error="404 - Page not found"), 404

@app.errorhandler(500)
def server_error(e):
    return render_template('index.html', active_tab='error', error="500 - Server error"), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
