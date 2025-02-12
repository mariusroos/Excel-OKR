import os
from flask import Flask, jsonify, request
from flask import send_file
from io import BytesIO
from werkzeug.utils import secure_filename
from functions import master_function
from flask_cors import CORS



# Configure the Flask app
app = Flask(__name__)

from flask_cors import CORS

CORS(app, resources={r"/*": {"origins": "*"}})



# Set the folder where uploaded files will be stored temporarily
# Set the folder where uploaded files will be stored temporarily
UPLOAD_FOLDER = 'uploads'  
if not os.path.exists(UPLOAD_FOLDER):  # Create folder if it doesn't exist
    os.makedirs(UPLOAD_FOLDER)

ALLOWED_EXTENSIONS = {'dxf'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Max file size of 16 MB

# Function to check if the file has a valid extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



    # Grid parameters
grid_origin = (0, 0)  # Bottom-left corner of the grid (adjust as needed)
cell_width = 1150      # Width of each grid cell
cell_height = 1150      # Height of each grid cell
grid_rows = 10000        # Total number of rows
grid_columns = 10000     # Total number of columns# Step 1: Read LWPOLYLINE entities from DXF
    


# Route to handle file uploads
@app.route('/upload', methods=['POST'])
def upload_file():
    print("Request received!")  # Debugging log

    if 'file' not in request.files:
        print("No file part in request")
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    print(f"File received: {file.filename}")  # Debugging log

    if file.filename == '':
        print("No file selected")
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        print(f"Saving file to {file_path}")  # Debugging log
        file.save(file_path)

        # Now call master_function with the predefined parameters
        excel_io = master_function(file_path, grid_origin, grid_rows, grid_columns)
        print(f"Received object from master_function: {type(excel_io)}")  # Debugging log
        print("Processing complete!")  # Debugging log

                # Send the in-memory file as a response for download
        # Ensure that we have a BytesIO object and return it using send_file
        if isinstance(excel_io, BytesIO):
            return send_file(
                excel_io,
                as_attachment=True,
                download_name="grid_cells_output.xlsx",
                mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
        else:
            print("Error: Expected a BytesIO object, but got something else.")
            return jsonify({"error": "Something went wrong, file could not be generated."}), 500

        return jsonify(result)
    
    print("Invalid file type")
    return jsonify({"error": "Invalid file type. Only DXF files are allowed."}), 400



@app.route('/')
def home():
    return "Flask server is running!"

if __name__ == '__main__':
    app.run(debug=True, port=5001)

