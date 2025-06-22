import os 
from dotenv import load_dotenv
from openai import OpenAI

class OpenaiImage:
    def __init__(self):
        load_dotenv()        
        self.model_name = "gpt-4o"
    
    def get_image_url(self, topic):

        os.environ["OPENAI_API_KEY"] = self.api_key = os.getenv("OPENAI_API_KEY")

        if not self.api_key:
            raise ValueError("API key is required to call OpenAI.")

        try:
            prompt = f'''
            Create a high-resolution illustration of '{topic}' in a minimalist flat-vector style with an earth-tone palette and subtle 
            geometric accents for an optimistic, eco-friendly feel.
            '''

            self.client = OpenAI()

            img = self.client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                n=1,
                size="1792x1024"
            )

            url = img.data[0].url

            return url
        
        except Exception as e:
            error_msg = f"Error in Generating Image: {e}"
            raise ValueError(error_msg)