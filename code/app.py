from flask import Flask, render_template, send_file, request, redirect
import os

app = Flask(__name__)

@app.route('/', methods=['GET', "POST", "PUT"])
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)