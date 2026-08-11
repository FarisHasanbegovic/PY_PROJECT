# 📱 SMS Spam Detector

A lightweight browser-based machine learning application that classifies SMS messages as Spam or Ham. The project was developed as a university course project and designed to allow students to test messages interactively through a simple web interface.

**🌐 Try it out:** [SMS Spam Detector](https://farishasanbegovic.github.io/PY_PROJECT/)

---

## 🔍 Overview

The application provides a simple interface where users can:

- Enter an SMS message
- Submit the message for analysis
- Receive a Spam or Ham classification
- Test the model with real or example SMS messages

---

## 🛠 Technologies

| Technology | Purpose |
|------------|---------|
| HTML | Webpage structure |
| CSS | User interface and styling |
| JavaScript | Application logic and interaction |
| Python | Machine learning model execution |
| Pyodide | Runs Python directly in the browser |
| scikit-learn | Machine learning framework used by the trained model |
| Joblib | Loading the trained machine learning model |
| GitHub Pages | Web application hosting |

---

## 📊 Model & Dataset

### Dataset

The model was trained on the **SMS Spam Collection** dataset, a publicly available dataset commonly used for spam detection research. It contains over 5,500 SMS messages, each labeled as either:

- **Spam** — Unwanted or unsolicited messages
- **Ham** — Legitimate messages

The dataset provides a realistic mix of message types, making it suitable for training a classification model.

### Model Training

The classification model was built using **scikit-learn**, a popular machine learning library for Python. Key steps in the training process included:

1. **Text Preprocessing** — Converting raw SMS text into numerical features using techniques like TF-IDF vectorization
2. **Model Selection** — Training and evaluating multiple classifiers to find the best performing one
3. **Hyperparameter Tuning** — Optimizing model parameters for better accuracy

---

### Model File

The trained model is saved as `Spam_Detection.joblib` using the **Joblib** library. This file is loaded directly in the browser via Pyodide, allowing for real-time classification without any server-side processing.

---

## ⚙️ How It Works

1. User enters an SMS message into the input field
2. The message is sent to the trained model running in the browser via Pyodide
3. The model processes the message and returns a classification
4. The application displays the result as either **Spam** or **Ham**

The trained `Spam_Detection.joblib` model is loaded directly in the browser, allowing for real-time classification without any server-side processing.


