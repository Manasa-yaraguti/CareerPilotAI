import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("AIzaSyDp06WZEsLSfq9VWHzkBJ1aKI8klKbaq1g"))

for model in genai.list_models():
    print(model.name)