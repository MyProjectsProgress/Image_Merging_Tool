import os
from flask import Flask, request, render_template
import cv2 as cv
import numpy as np
from matplotlib import pyplot as plt
import json

app = Flask(__name__)


def fourierFunc(img):
    fourier = np.fft.fft2(img)
    fourierShift = np.fft.fftshift(fourier)
    return fourier, fourierShift


def magnitudeSpectrum(fourierShift):
    return 20*np.log(np.abs(fourierShift))


def phaseFunc(fourier):
    phase = np.angle(fourier)
    return phase


def resizeFunc(img1, img2):
    newImageShape = img1.shape
    newImageShape = (newImageShape[1], newImageShape[0])
    img2 = cv.resize(img2, newImageShape)
    return img2


def magnitudeFunc(fourier):
    return np.abs(fourier)


def plotFunc(x, s):
    plt.figure(figsize=(8, 6), dpi=80, frameon=False)
    plt.axis('off')

    plt.imshow(x, cmap='gray')
    if(s == "1"):

        plt.savefig('static/uploads/1.png', bbox_inches='tight')

    elif(s == "2"):

        plt.savefig('static/uploads/2.png', bbox_inches='tight')
    elif(s == "output"):
        plt.savefig('static/uploads/output.png', bbox_inches='tight')


def combine(mag, phase):
    combined = np.multiply(mag, np.exp(1j * phase))
    mixInverse = np.real(np.fft.ifft2(combined))

    return mixInverse


def processing(path1, path2, mode):
    # read & resize

    img1 = cv.imread(path1, 0)
    img2 = cv.imread(path2, 0)
    img2 = resizeFunc(img1, img2)
    # IMAGE ONE FOURIER
    fourier1, fourierShift1 = fourierFunc(img1)

   # IMAGE TWO FOURIER
    fourier2, fourierShift2 = fourierFunc(img2)

    magUni1 = np.ones(img1.shape)
    magUni2 = np.ones(img2.shape)
    phaseUni1 = np.zeros(img1.shape)
    phaseUni2 = np.zeros(img2.shape)

    if(mode == "Mag1-Phase2"):
        mag1 = magnitudeFunc(fourier1)
        mag_spectrum = magnitudeSpectrum(fourierShift1)
        phase2 = phaseFunc(fourier2)
        plotFunc(mag_spectrum, "1")
        print("a7a")

        plotFunc(phase2, "2")
        print("a7a2")

        outputImage = combine(mag1, phase2)
        plotFunc(outputImage, "output")
        print("a7a3")

    elif(mode == "Phase1-Mag2"):
        mag2 = magnitudeFunc(fourier2)
        mag_spectrum = magnitudeSpectrum(fourierShift2)

        phase1 = phaseFunc(fourier1)
        plotFunc(mag_spectrum, "2")
        plotFunc(phase1, "1")
        outputImage = combine(mag2, phase1)
        plotFunc(outputImage, "output")

    elif(mode == "Phase1-Uni2"):
        phase1 = phaseFunc(fourier1)
        magSpectrum = magnitudeSpectrum(magUni2)
        plotFunc(magSpectrum, "2")
        plotFunc(phase1, "1")
        outputImage = combine(magUni2, phase1)
        plotFunc(outputImage, "output")

    elif(mode == "Uni1-Mag2"):
        mag2 = magnitudeFunc(fourier2)
        magSpectrum = magnitudeSpectrum(mag2)
        plotFunc(magSpectrum, "2")
        plotFunc(phaseUni1, "1")
        outputImage = combine(mag2, phaseUni1)
        plotFunc(outputImage, "output")

    elif(mode == "Uni1-Phase2"):
        phase2 = phaseFunc(fourier2)
        magSpectrum = magnitudeSpectrum(magUni1)
        plotFunc(magSpectrum, "1")
        plotFunc(phase2, "2")
        outputImage = combine(magUni1, phase2)
        plotFunc(outputImage, "output")

    elif(mode == "Mag1-Uni2"):
        mag1 = magnitudeFunc(fourier1)
        magSpectrum = magnitudeSpectrum(mag1)
        plotFunc(magSpectrum, "1")
        plotFunc(phaseUni2, "2")
        outputImage = combine(mag1, phaseUni2)
        plotFunc(outputImage, "output")
    else:
        pass


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


values1 = ["Uni1"]
values2 = ["Uni2"]


@app.route('/selected-items', methods=['GET', 'POST'])
def select():

    data1 = request.values.get('select1')
    data2 = request.values.get('select2')

    if data1 != None:
        values1.append(data1)

    if data2 != None:
        values2.append(data2)

    mode = values1[-1]+"-"+values2[-1]
    print(mode)
    processing('assets\image.png', 'assets\image2.png', mode)

    return []


if __name__ == '__main__':
    app.run(debug=True, threaded=True)
