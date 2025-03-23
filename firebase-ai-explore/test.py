import google.generativeai as genai
import os

# Configure Gemini API Key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# List available models
models = genai.list_models()
for model in models:
    print(model.name)
