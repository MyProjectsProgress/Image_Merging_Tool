from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

UPLOAD_FOLDER = 'static/uploads'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
   
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
   
def allowed_file(filename):
 return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/create_file', methods=['POST',"GET"])
def create_file():
    if request.method == 'POST':
        file = request.files['file']
        filename = secure_filename(file.filename)
          
        if file and allowed_file(file.filename):
           file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
           print('File successfully uploaded ' + file.filename + ' to static/upload')
        else:
           print('Invalid Uplaod only png, jpg, jpeg, gif')   
    return jsonify(filename)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)