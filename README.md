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

## ⚙️ How It Works

1. User enters an SMS message into the input field
2. The message is sent to the trained model running in the browser via Pyodide
3. The model processes the message and returns a classification
4. The application displays the result as either **Spam** or **Ham**

The trained `Spam_Detection.joblib` model is loaded directly in the browser, allowing for real-time classification without any server-side processing.


