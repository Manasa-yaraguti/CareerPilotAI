import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load the .env file from the backend folder
load_dotenv(dotenv_path=".env")

api_key = os.getenv("AIzaSyDp06WZEsLSfq9VWHzkBJ1aKI8klKbaq1g")
print("API Key:", api_key)

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-2.5-flash")

response = model.generate_content("Say Hello")

print(response.text)