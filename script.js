let pyodide = null;
let pythonReady = false;

// Load Pyodide and Python environment
async function initPyodide() {
    console.log("⏳ Loading Pyodide...");

    pyodide = await loadPyodide();
    console.log("✅ Pyodide loaded");

    await pyodide.loadPackage("micropip");

    console.log("⏳ Installing Python packages...");
    await pyodide.runPythonAsync(`
import micropip
await micropip.install("joblib")
await micropip.install("scikit-learn")
    `);

    console.log("✅ Python packages installed");

    await loadModel();
}

// Load ML model
async function loadModel() {
    console.log("⏳ Fetching ML model...");

    const response = await fetch("Spam_Detection.joblib");
    if (!response.ok) {
        throw new Error("Model file not found");
    }

    const buffer = await response.arrayBuffer();
    pyodide.FS.writeFile(
        "Spam_Detection.joblib",
        new Uint8Array(buffer)
    );

    console.log("✅ Model file written to Pyodide FS");

    await pyodide.runPythonAsync(`
import joblib

model = joblib.load("Spam_Detection.joblib")
print("✅ MODEL LOADED:", type(model))

def predict_sms(text):
    pred = model.predict([text])[0]
    return "spam" if pred else "ham"
    `);

    pythonReady = true;
    console.log("🚀 ML model ready");
}

// Start everything
initPyodide();

// UI logic
const button = document.getElementById("checkBtn");
const input = document.getElementById("smsInput");
const result = document.getElementById("result");

button.addEventListener("click", async () => {
    const text = input.value.trim();

    if (!text) {
        result.textContent = "Please enter a message.";
        return;
    }

    if (!pythonReady) {
        result.textContent = "Model is still loading...";
        return;
    }

    result.textContent = "Analyzing...";

    try {
        const prediction = await pyodide.runPythonAsync(
            `predict_sms("""${text.replace(/"/g, '\\"')}""")`
        );

        if (prediction === "spam") {
            result.textContent = "Prediction: SPAM ❌";
        } else {
            result.textContent = "Prediction: HAM ✅";
        }
    } catch (err) {
        console.error(err);
        result.textContent = "Prediction error";
    }
});
