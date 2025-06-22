from src.states.blog_state import BlogState, Blog
from langchain_core.messages import HumanMessage

from src.image_llm.openai_image import OpenaiImage

class BlogNode:
    
    def __init__(self, llm):
        self.llm = llm 

    def title_creation(self, state:BlogState):
        """
            Create the title for the blog
        """

        if "topic" in state and state["topic"]:
            prompt = """
                You are an expert blog content writer. Use Markdown formatting. Generate a blog
                title for the {topic}. This title should be creative and SEO friendly
            """

            system_message = prompt.format(topic=state['topic'])
            response = self.llm.invoke(system_message)

            return {"blog": {"title": response.content}}
        
    def content_generation(self, state:BlogState):
        if "topic" in state and state["topic"]:
            system_prompt = """
                You are expert blog writer. Use Markdown formatting.
                Generate a detailed blog content with detailed breakdown for the {topic}.  
            """
            system_message = system_prompt.format(topic=state['topic'])
            response = self.llm.invoke(system_message)
            return {"blog": {"title": state['blog']['title'], "content": response.content}}
        
    def image_generation(self, state:BlogState):
        """
            Generate the image using the topic. 
        """
        if "blog" in state and state["blog"]["title"]:
            # Get the class instance
            openai_image = OpenaiImage()

            # generate the image
            url = openai_image.get_image_url(state["blog"]["title"])

            # return the image
            return {"blog": {"title": state["blog"]["title"], "content": state["blog"]["content"], "image": url}}
        
    def translation(self, state:BlogState):
        """
            Translate the content to the specified language.
        """

        translation_prompt = """
            Translate the following content into {current_language}.
            - Maintain the original tone, style, and formatting.
            - Adapt cultural references and idioms to be appropriate for {current_language}.

            ORIGINAL CONTENT:
            {blog_content}
        """

        blog_content = state["blog"]["content"]
        messages = [
            HumanMessage(translation_prompt.format(current_language = state["current_language"], blog_content=blog_content))
        ]

        translation_content = self.llm.with_structured_output(Blog).invoke(messages)

        return {"blog": { "content": translation_content}}
        
    def route(self, state: BlogState):
        return {"current_language": state['current_language']}
    
    def route_decision(self, state:BlogState):
        """
            Route the content to the respective translation function
        """

        if state["current_language"] == "hindi":
            return "hindi"
        
        return "french"