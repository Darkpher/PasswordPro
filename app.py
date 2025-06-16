from flask import Flask, jsonify, request, session # type: ignore
import random
import string
import time

app = Flask(__name__)
app.secret_key = "memory_training_secret"

# Generate password function
def generate_password(level):
    levels = {
        "E3": (4, string.digits),
        "E2": (6, string.digits),
        "E1": (8, string.digits),
        "D3": (4, string.ascii_lowercase),
        "D2": (6, string.ascii_lowercase),
        "D1": (8, string.ascii_lowercase),
        "C3": (4, string.ascii_letters),
        "C2": (6, string.ascii_letters),
        "C1": (8, string.ascii_letters),
        "B3": (4, string.digits + string.ascii_letters),
        "B2": (6, string.digits + string.ascii_letters),
        "B1": (8, string.digits + string.ascii_letters),
        "A3": (4, string.digits + string.ascii_letters + string.punctuation),
        "A2": (6, string.digits + string.ascii_letters + string.punctuation),
        "A1": (8, string.digits + string.ascii_letters + string.punctuation),
    }
    length, chars = levels.get(level, (4, string.digits))
    return "".join(random.choices(chars, k=length))

# Difficulty levels
levels = ["E3", "E2", "E1", "D3", "D2", "D1", "C3", "C2", "C1", "B3", "B2", "B1", "A3", "A2", "A1"]

@app.route("/get-password", methods=["GET"])
def get_password():
    level_index = session.get("level_index", 0)
    level = levels[level_index]
    password = generate_password(level)

    session["password"] = password
    session["show_time"] = time.time()

    return jsonify({"password": password, "level": level})

@app.route("/verify-password", methods=["POST"])
def verify_password():
    user_input = request.json.get("user_input", "")
    correct_password = session.get("password", "")

    if user_input == correct_password:
        session["level_index"] = session.get("level_index", 0) + 1
        if session["level_index"] >= len(levels):
            return jsonify({"message": "Congratulations! You completed all levels!"})
        return jsonify({"message": "Correct! Proceeding to next level."})
    
    return jsonify({"message": "Incorrect! Try again."})

if __name__ == "__main__":
    app.run(debug=True)
