from flask import Flask, request

app = Flask(__name__)

@app.get("/")
def root():
    return f"Hello from Python app! Path: {request.path}\n"

@app.get("/health")
def health():
    return "ok", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
