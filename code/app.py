import os
from flask import Flask, request, render_template
import cv2 as cv
import numpy as np
from matplotlib import pyplot as plt
import json
import os
from PIL import Image, ImageChops


app = Flask(__name__)


def update(arr, x1, x2, y1, y2):
    for i in range(arr.shape[0]):
        for j in range(arr.shape[1]):
            if (i < x1 or i > x2) or (j <= y1 or j > y2):
                arr[i][j] = 1
    return arr


def scale(image_array):
    image = ((image_array - image_array.min()) *
             (1/(image_array.max() - image_array.min()) * 255)).astype('uint8')
    return image


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

    if(s == "1"):
        cv.imwrite('static/uploads/1.png', x)

    elif(s == "2"):
        cv.imwrite('static/uploads/2.png', x)

    elif(s == "output"):
        cv.imwrite('static/uploads/output.png', x)


def combine(mag, phase):
    combined = np.multiply(mag, np.exp(1j * phase))

    return combined


def mixInverse(combined):
    mixInverse = np.real(np.fft.ifft2(combined))
    return mixInverse


def processing(path1, path2, mode, x1=0, x2=6000, y1=0, y2=6000, x11=0, x22=6000, y11=0, y22=6000):

    # READ & RESIZE
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
        mag1 = update(mag1, x1, x2, y1, y2)
        mag_spectrum = magnitudeSpectrum(fourierShift1)
        phase2 = phaseFunc(fourier2)
        phase2Show = scale(phase2)
        plotFunc(mag_spectrum, "1")
        plotFunc(phase2Show, "2")
        phase2 = update(phase2, x11, x22, y11, y22)

        combined_image = combine(mag1, phase2)
        outputImage = mixInverse(combined_image)
        plotFunc(outputImage, "output")

    elif(mode == "Phase1-Mag2"):
        mag2 = magnitudeFunc(fourier2)
        mag2 = update(mag2, x11, x22, y11, y22)
        mag_spectrum = magnitudeSpectrum(fourierShift2)
        phase1 = phaseFunc(fourier1)
        plotFunc(mag_spectrum, "2")
        phase1Show = scale(phase1)
        plotFunc(phase1Show, "1")
        phase1 = update(phase1, x1, x2, y1, y2)

        combined_image = combine(mag2, phase1)
        outputImage = mixInverse(combined_image)
        plotFunc(outputImage, "output")

    elif(mode == "Phase1-Uni2"):
        phase1 = phaseFunc(fourier1)
        magSpectrum = magnitudeSpectrum(magUni2)
        plotFunc(magSpectrum, "2")
        phase1Show = scale(phase1)
        plotFunc(phase1Show, "1")
        phase1 = update(phase1, x1, x2, y1, y2)
        magUni2 = update(magUni2, x11, x22, y11, y22)
        combined_image = combine(magUni2, phase1)
        outputImage = mixInverse(combined_image)
        plotFunc(outputImage, "output")

    elif(mode == "Uni1-Mag2"):
        mag2 = magnitudeFunc(fourier2)
        magSpectrum = magnitudeSpectrum(mag2)
        plotFunc(magSpectrum, "2")
        phaseUni1Show = scale(phaseUni1)
        plotFunc(phaseUni1Show, "1")
        mag2 = update(mag2, x11, x22, y11, y22)
        phaseUni1 = update(phaseUni1, x1, x2, y1, y2)

        combined_image = combine(mag2, phaseUni1)
        outputImage = mixInverse(combined_image)
        plotFunc(outputImage, "output")

    elif(mode == "Uni1-Phase2"):
        phase2 = phaseFunc(fourier2)
        magSpectrum = magnitudeSpectrum(magUni1)
        plotFunc(magSpectrum, "1")
        phase2Show = scale(phase2)
        plotFunc(phase2Show, "2")
        phase2 = update(phase2, x11, x22, y11, y22)
        magUni1 = update(magUni1, x1, x2, y1, y2)
        combined_image = combine(magUni1, phase2)
        outputImage = mixInverse(combined_image)
        plotFunc(outputImage, "output")

    elif(mode == "Mag1-Uni2"):
        mag1 = magnitudeFunc(fourier1)
        magSpectrum = magnitudeSpectrum(mag1)
        plotFunc(magSpectrum, "1")
        phaseUni2Show = scale(phaseUni2)
        plotFunc(phaseUni2Show, "2")
        mag1 = update(mag1, x1, x2, y1, y2)
        phaseUni2 = update(phaseUni2, x11, x22, y11, y22)

        combined_image = combine(mag1, phaseUni2)
        outputImage = mixInverse(combined_image)
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
mode = ["Mag1-Uni2"]


@app.route('/selected-items', methods=['GET', 'POST'])
def select():

    data1 = request.values.get('select1')
    data2 = request.values.get('select2')

    if data1 != None:
        values1.append(data1)

    if data2 != None:
        values2.append(data2)

    mode.append(values1[-1]+"-"+values2[-1])

    processing('assets\image.png', 'assets\image2.png', mode[-1])

    return []


left1 = [0]
right1 = [6000]
top1 = [0]
bottom1 = [6000]
left2 = [0]
right2 = [6000]
top2 = [0]
bottom2 = [6000]


@app.route('/Shapes', methods=['GET', 'POST'])
def Shapes():

    data = request.get_json()

    if(len(data[0]) == 0):
        left1.append(0)
        right1.append(6000)
        top1.append(0)
        bottom1.append(6000)
        processing('assets\image.png', 'assets\image2.png', mode[-1])

    else:
        for item in data[0]:
            x1 = item["x"]
            x2 = item["x"] + item["width"]
            y1 = item["y"]
            y2 = item["y"] + item["height"]
            left1.append(min(x1, x2))
            right1.append(max(x1, x2))
            top1.append(min(y1, y2))
            bottom1.append(max(y1, y2))
            processing('assets\image.png', 'assets\image2.png',
                       mode[-1], left1[-1], right1[-1], top1[-1], bottom1[-1], left2[-1], right2[-1], top2[-1], bottom2[-1])

    if(len(data[1]) == 0):
        left2.append(0)
        right2.append(6000)
        top2.append(0)
        bottom2.append(6000)
        processing('assets\image.png', 'assets\image2.png',
                   mode[-1], left1[-1], right1[-1], top1[-1], bottom1[-1], left2[-1], right2[-1], top2[-1], bottom2[-1])

    else:
        for item in data[1]:
            x1 = item["x"]
            x2 = item["x"] + item["width"]
            y1 = item["y"]
            y2 = item["y"] + item["height"]
            left2.append(min(x1, x2))
            right2.append(max(x1, x2))
            top2.append(min(y1, y2))
            bottom2.append(max(y1, y2))
            processing('assets\image.png', 'assets\image2.png',
                       mode[-1], left1[-1], right1[-1], top1[-1], bottom1[-1], left2[-1], right2[-1], top2[-1], bottom2[-1])

    return []


if __name__ == '__main__':
    app.run(debug=True, threaded=True)
