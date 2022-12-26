import os
from flask import Flask, request, render_template


app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/image', methods=['GET', 'POST'])
def upload_file():

    file1 = request.files['file']
    Image = file1.save(os.path.join('assets/image.png'))

    return []


@app.route('/image2', methods=['GET', 'POST'])
def upload_file2():

    file2 = request.files['file']
    Image = file2.save(os.path.join('assets/image2.png'))

    return []


if __name__ == '__main__':
    app.run(debug=True, threaded=True)
