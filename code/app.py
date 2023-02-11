import os
from flask import Flask, request, render_template
import cv2 as cv
import numpy as np
from matplotlib import pyplot as plt
import json
import os
from PIL import Image, ImageChops


app = Flask(__name__)


class input:

    def __init__(self, path):
        self.img_read = cv.imread(path, 0)
        self.img_shape = self.img_read.shape

        self.fourier = np.fft.fft2(self.img_read)
        self.fourier_shift = np.fft.fftshift(self.fourier)

        self.magnitude = np.abs(self.fourier_shift)
        self.phase = np.angle(self.fourier_shift)

        self.magnitude_spectrum = 20*np.log(np.abs(self.fourier_shift))
        self.phase_spectrum = ((self.phase - self.phase.min()) *
                               (1/(self.phase.max() - self.phase.min()) * 255)).astype('uint8')
        self.scaled_phase = self.scale(self.phase)

    def partSelect(self, list1, x1, x2, y1, y2, filterType):
        selected_part = list1
        for i in range(selected_part.shape[0]):
            for j in range(selected_part.shape[1]):
                if(filterType == 0):
                    if ((i < x1 or i > x2) or (j < y1 or j > y2)):
                        selected_part[i][j] = 0
                else:
                    if not((i < x1 or i > x2) or (j < y1 or j > y2)):
                        selected_part[i][j] = 0
        return selected_part

    def resizeFunc(self, img1, img2):
        newImageShape = img1.shape
        newImageShape = (newImageShape[1], newImageShape[0])
        img2 = cv.resize(img2, newImageShape)

        return img2

    def scale(self, image_array):
        image = ((image_array - image_array.min()) *
                 (1/(image_array.max() - image_array.min()) * 255)).astype('uint8')
        return image

    def processing(self, img_2: 'input', mode, x1=0, x2=6000, y1=0, y2=6000, x11=0, x22=6000, y11=0, y22=6000, filterType=0):

        img_2.img_read = self.resizeFunc(self.img_read, img_2.img_read)

        magUni = np.ones(self.img_shape)
        phaseUni = np.zeros(self.img_shape)

        if(mode == "Mag1-Phase2"):
            self.magnitude = self.partSelect(
                self.magnitude, x1, x2, y1, y2, filterType)
            img_2.phase = img_2.partSelect(
                img_2.phase, x11, x22, y11, y22, filterType)
            self.plot(self.magnitude_spectrum, "1")
            img_2.plot(img_2.scaled_phase, "2")
            combined = np.multiply(self.magnitude, np.exp(1j * img_2.phase))

        elif(mode == "Phase1-Mag2"):
            self.phase = self.partSelect(
                self.phase, x1, x2, y1, y2, filterType)
            img_2.magnitude = img_2.partSelect(
                img_2.magnitude, x11, x22, y11, y22, filterType)
            self.plot(self.scaled_phase, "1")
            img_2.plot(img_2.magnitude_spectrum, "2")
            combined = np.multiply(img_2.magnitude, np.exp(1j * self.phase))

        elif(mode == "Phase1-Uni2"):
            self.phase = self.partSelect(self.phase, x1, x2, y1, filterType)
            img_2.magnitude = img_2.partSelect(
                magUni, x11, x22, y11, y22, filterType)
            self.plot(self.scaled_phase, "1")
            img_2.plot(img_2.magnitude_spectrum, "2")
            combined = np.multiply(img_2.magnitude, np.exp(1j * self.phase))

        elif(mode == "Uni1-Mag2"):
            self.phase = self.partSelect(phaseUni, x1, x2, y1, y2, filterType)
            img_2.magnitude = img_2.partSelect(
                img_2.magnitude, x11, x22, y11, y22, filterType)
            self.plot(self.scaled_phase, "1")
            img_2.plot(img_2.magnitude_spectrum, "2")
            combined = np.multiply(img_2.magnitude, np.exp(1j * self.phase))

        elif(mode == "Uni1-Phase2"):
            self.magnitude = self.partSelect(
                magUni, x1, x2, y1, y2, filterType)
            img_2.phase = img_2.partSelect(
                img_2.phase, x11, x22, y11, y22, filterType)
            self.plot(self.magnitude_spectrum, "1")
            img_2.plot(img_2.scaled_phase, "2")
            combined = np.multiply(self.magnitude, np.exp(1j * img_2.phase))

        elif(mode == "Mag1-Uni2"):
            self.magnitude = self.partSelect(
                self.magnitude, x1, x2, y1, y2, filterType)
            img_2.phase = img_2.partSelect(
                phaseUni, x11, x22, y11, y22, filterType)
            self.plot(self.magnitude_spectrum, "1")
            img_2.plot(img_2.scaled_phase, "2")
            combined = np.multiply(self.magnitude, np.exp(1j * img_2.phase))

        mixInverse = np.real(np.fft.ifft2(combined))
        self.plot(mixInverse, "output")

    def plot(self, x, s):
        if(s == "1"):
            cv.imwrite('static/uploads/1.png', x)

        elif(s == "2"):
            cv.imwrite('static/uploads/2.png', x)

        elif(s == "output"):
            cv.imwrite('static/uploads/output.png', x)


@app.route('/')
def home():
    return render_template('index.html')


# @app.route('/filterSelection', methods=['GET', 'POST'])
# def filterSelection():
#     filterData = request.values.get('filter')

#     filterType.append(filterData)
#     print(filterType)

#     return []


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

    img_1 = input('assets\image.png')
    img_2 = input('assets\image2.png')

    img_1.processing(img_2, mode[-1])

    return []


left1 = [0]
right1 = [6000]
top1 = [0]
bottom1 = [6000]
left2 = [0]
right2 = [6000]
top2 = [0]
bottom2 = [6000]
filterType = [0]


@app.route('/Shapes', methods=['GET', 'POST'])
def Shapes():

    img_1 = input('assets\image.png')
    img_2 = input('assets\image2.png')
    data = request.get_json()

    if(len(data[0]) == 0):
        left1.append(0)
        right1.append(6000)
        top1.append(0)
        bottom1.append(6000)
        img_1.processing(img_2, mode[-1])
    else:
        for item in data[0]:
            x1 = item["x"]
            x2 = item["x"] + item["width"]
            y1 = item["y"]
            y2 = item["y"] + item["height"]
            filter = item["inverseData"]
            # mode = item["select_mode"]
            filterType.append(filter)

            left1.append(min(x1, x2))
            right1.append(max(x1, x2))
            top1.append(min(y1, y2))
            bottom1.append(max(y1, y2))
            img_1.processing(img_2, mode[-1], left1[-1], right1[-1], top1[-1],
                             bottom1[-1], left2[-1], right2[-1], top2[-1], bottom2[-1], filterType[-1])

    if(len(data[1]) == 0):
        left2.append(0)
        right2.append(6000)
        top2.append(0)
        bottom2.append(6000)
        img_1.processing(img_2, mode[-1], left1[-1], right1[-1], top1[-1],
                         bottom1[-1], left2[-1], right2[-1], top2[-1], bottom2[-1], filterType[-1])

    else:
        for item in data[1]:
            x1 = item["x"]
            x2 = item["x"] + item["width"]
            y1 = item["y"]
            y2 = item["y"] + item["height"]
            filter = item["inverseData"]
            filterType.append(filter)
            left2.append(min(x1, x2))
            right2.append(max(x1, x2))
            top2.append(min(y1, y2))
            bottom2.append(max(y1, y2))
            img_1.processing(img_2, mode[-1], left1[-1], right1[-1], top1[-1],
                             bottom1[-1], left2[-1], right2[-1], top2[-1], bottom2[-1], filterType[-1])

    return []


if __name__ == '__main__':
    app.run(debug=True, threaded=True)
