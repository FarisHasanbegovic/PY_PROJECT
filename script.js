let pyodide = null;

async function loadPython() {
    pyodide = await loadPyodide();
    console.log("Pyodide loaded");

    // Define Python function
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

button.addEventListener("click", () => {
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

    // Call Python function and get result
    const prediction = pyodide.runPython(`
predict_sms("""${text}""")
`);

    if (prediction === "spam") {
        result.textContent = "Prediction: SPAM ❌";
        result.style.color = "red";
    } else {
        result.textContent = "Prediction: HAM ✅";
        result.style.color = "green";
    }
});
