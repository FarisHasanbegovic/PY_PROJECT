let pyodide = null;
let model = null; // We'll store the loaded model here

async function loadPython() {
    pyodide = await loadPyodide();
    console.log("Pyodide loaded");

    // Load necessary packages
    await pyodide.loadPackage(["micropip"]);
    
    // Install joblib
    await pyodide.runPythonAsync(`
import micropip
await micropip.install('joblib')
print("Joblib installed")
`);
    
    // Load your model
    await loadModel();
}

async function loadModel() {
    try {
        // First, download your model file
        // ⚠️ IMPORTANT: Replace this URL with your GitHub raw URL!
        const MODEL_URL = "https://raw.githubusercontent.com/FarisHasanbegovic/PY_PROJECT/main/Spam_Detection.joblib";
        
        console.log("Downloading model...");
        const response = await fetch(MODEL_URL);
        const modelData = await response.arrayBuffer();
        
        // Save to Pyodide's filesystem
        pyodide.FS.writeFile('/Spam_Detection.joblib', new Uint8Array(modelData));
        console.log("Model saved to filesystem");
        
        // Load the model using joblib
        await pyodide.runPythonAsync(`
import joblib

# Load your model - EXACTLY what your friend said!
model = joblib.load('/Spam_Detection.joblib')
print("Model loaded successfully!")
print(f"Model type: {type(model)}")
`);
        
        console.log("✅ Model loaded!");
        
    } catch (error) {
        console.error("Failed to load model:", error);
        // Fall back to simple detection
        setupFallback();
    }
}

function setupFallback() {
    console.log("Using fallback detection");
    pyodide.runPython(`
def predict_sms(text):
    text = text.lower()
    if "free" in text or "win" in text or "money" in text:
        return "spam"
    return "ham"
`);
}

loadPython();

const button = document.getElementById("checkBtn");
const input = document.getElementById("smsInput");
const result = document.getElementById("result");

button.addEventListener("click", async () => {
    const text = input.value.trim();

    if (text === "") {
        result.textContent = "Please enter a message.";
        result.style.color = "orange";
        return;
    }

    if (!pyodide) {
        result.textContent = "Python is still loading...";
        result.style.color = "blue";
        return;
    }

    // Use the loaded model to predict
    try {
        const prediction = pyodide.runPython(`
import joblib

# Load model if not already loaded
try:
    model
except NameError:
    model = joblib.load('/Spam_Detection.joblib')

# Make prediction
text = """${text.replace(/"/g, '\\"')}"""
result = model.predict([text])[0]

# Convert to string if needed
if isinstance(result, (int, float)):
    if result == 1:
        "spam"
    else:
        "ham"
else:
    str(result).lower()
`);

        if (prediction === "spam" || prediction === "1") {
            result.textContent = "Prediction: SPAM ❌";
            result.style.color = "red";
        } else {
            result.textContent = "Prediction: HAM ✅";
            result.style.color = "green";
        }
        
    } catch (error) {
        console.error("Prediction error:", error);
        // Fallback to simple detection
        const fallbackPrediction = pyodide.runPython(`
predict_sms("""${text}""")
`);
        
        if (fallbackPrediction === "spam") {
            result.textContent = "Prediction: SPAM ❌ (fallback)";
            result.style.color = "red";
        } else {
            result.textContent = "Prediction: HAM ✅ (fallback)";
            result.style.color = "green";
        }
    }
});