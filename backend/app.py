import os
from flask import Flask, jsonify, request
from werkzeug.utils import secure_filename
from functions import read_lwpolylines_from_dxf
from flask_cors import CORS



# Configure the Flask app
app = Flask(__name__)

CORS(app)

# Set the folder where uploaded files will be stored temporarily
UPLOAD_FOLDER = 'uploads'  # You can change this to your preferred folder
ALLOWED_EXTENSIONS = {'dxf'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Max file size of 16 MB

# Function to check if the file has a valid extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route to handle file uploads
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save the file temporarily
        file.save(file_path)
        
        # Process the DXF file using the helper function from functions.py
        lwpolylines = read_lwpolylines_from_dxf(file_path)
        
        # Return the extracted LWPOLYLINE data as JSON
        return jsonify(lwpolylines)
    
    return jsonify({"error": "Invalid file type. Only DXF files are allowed."}), 400

if __name__ == '__main__':
    app.run(debug=True)
