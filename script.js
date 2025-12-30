let pyodide = null;
let modelLoaded = false;

async function loadPython() {
    try {
        pyodide = await loadPyodide();
        console.log("Pyodide loaded");

        // Load necessary packages
        await pyodide.loadPackage(["micropip"]);
        
        // Install joblib
        await pyodide.runPythonAsync(`
import micropip
await micropip.install('joblib')
await micropip.install('scikit-learn')
print("Joblib installed")
`);
        
        await loadModel();
        
    } catch (error) {
        console.error("Failed to load Python:", error);
    }
}

async function loadModel() {
    try {
        
        
        // Save to Pyodide's filesystem
        pyodide.FS.writeFile('./Spam_Detection.joblib', new Uint8Array(modelData));
        console.log("Model saved to filesystem");
        
        // ✅ FIXED: Actually load the model!
        await pyodide.runPythonAsync(`
import joblib

# Load the model
model = joblib.load('./Spam_Detection.joblib')
print("✅ Model loaded successfully!")

# Create prediction function
def predict_sms(text):
    result = model.predict([text])[0]
    # Convert to spam/ham
    return "spam" if result  else "ham"
`);
        
        modelLoaded = true;
        console.log("✅ Model setup complete!");
        
    } catch (error) {
        console.error("❌ Failed to load model:", error);
        modelLoaded = false;
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

// Start loading
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

    try {
        result.textContent = "🤖 Analyzing...";
        result.style.color = "gray";
        
        // ✅ SIMPLIFIED: Just call the predict_sms function
        const prediction = pyodide.runPython(`
predict_sms("""${text.replace(/"/g, '\\"')}""")
`);
        
        console.log("Prediction result:", prediction);
        
        if (prediction === "spam") {
            result.textContent = "Prediction: SPAM ❌";
            result.style.color = "red";
        } else {
            result.textContent = "Prediction: HAM ✅";
            result.style.color = "green";
        }
        
    } catch (error) {
        console.error("Prediction error:", error);
        result.textContent = "Error analyzing message";
        result.style.color = "orange";
    }
});

// Add loading state to button
button.addEventListener('click', function() {
    const originalText = button.textContent;
    button.textContent = "Analyzing...";
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 1500);
});
