import base64
import requests
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

client = OpenAI()

topic_input =  "# Harnessing the Future: Exploring the Pioneering Renewable Energy Innovations Shaping Climate Change in 2025"

prompt = f'''
Create a high-resolution illustration of '{topic_input}' in a minimalist flat-vector style with an earth-tone palette and subtle geometric accents for an optimistic, eco-friendly feel.
'''

img = client.images.generate(
    model="dall-e-3",
    prompt=prompt,
    n=1,
    size="1536x1024"
)

print(img.data[0].url)