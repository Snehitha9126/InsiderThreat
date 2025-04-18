import pandas as pd
import numpy as np
import json
import logging
from datetime import datetime
import os

class DataProcessor:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    def process_file(self, file_path):
        """
        Process the uploaded file for analysis.
        
        Args:
            file_path: Path to the uploaded file
            
        Returns:
            processed_data: Data ready for model prediction
        """
        try:
            # Get file extension
            file_ext = os.path.splitext(file_path)[1].lower()
            
            # Load data based on file type
            if file_ext == '.csv':
                data = pd.read_csv(file_path)
            elif file_ext in ['.xlsx', '.xls']:
                data = pd.read_excel(file_path)
            elif file_ext == '.json':
                with open(file_path, 'r') as f:
                    data = pd.DataFrame(json.load(f))
            else:
                raise ValueError(f"Unsupported file format: {file_ext}")
            
            # Log data dimensions
            self.logger.info(f"Loaded data with shape: {data.shape}")
            
            # Apply preprocessing steps
            processed_data = self._preprocess_data(data)
            
            return processed_data
            
        except Exception as e:
            self.logger.error(f"Error processing file: {str(e)}")
            raise
    
    def _preprocess_data(self, data):
        """
        Preprocess the data to prepare it for model input.
        
        Args:
            data: Raw data loaded from the file
            
        Returns:
            processed_data: Data ready for model prediction
        """
        try:
            # For demonstration, we'll return the raw data
            # In a real application, this would include:
            # - Feature engineering
            # - Handling missing values
            # - Normalization/scaling
            # - Converting categorical variables
            # - Sequence creation for LSTM input
            
            # Sample preprocessing for demonstration
            # Handle missing values
            data = data.fillna(0)
            
            # Convert categorical columns if any
            for col in data.select_dtypes(include=['object']).columns:
                try:
                    # Try to convert to datetime first
                    data[col] = pd.to_datetime(data[col], errors='ignore')
                    # If still object type, convert to categorical
                    if data[col].dtype == 'object':
                        data[col] = data[col].astype('category').cat.codes
                except:
                    pass
            
            # Ensure all data is numeric
            numeric_data = data.select_dtypes(include=[np.number])
            
            # Return processed data
            return numeric_data
            
        except Exception as e:
            self.logger.error(f"Error preprocessing data: {str(e)}")
            raise
