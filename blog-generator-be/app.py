import uvicorn
from fastapi import FastAPI, Request

from src.graph.graph_builder import GraphBuilder
from src.llms.openai_llm import OpenAILLM

import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

### Langsmith tracking
os.environ['LANGCHAIN_API_KEY'] = os.getenv("LANGCHAIN_API_KEY")
os.environ['LANGCHAIN_TRACING_V2'] = "true"
os.environ['LANGCHAIN_PROJECT'] = os.getenv("LANGCHAIN_PROJECT")

## Start of API endpoints

## status api
@app.get("/")
def hello_world():
    return "Hello World"

## Create a blog post 
@app.post("/blog")
async def create_blogs(request: Request):
    data = await request.json()
    topic = data.get('topic', "")
    language = data.get('language', "")

    ## Get the LLM object
    openai_llm = OpenAILLM()
    llm = openai_llm.get_llm_model()

    ## Get the graph
    graph_builder = GraphBuilder(llm)

    if language and topic:
        graph = graph_builder.setup_graph(trans=True)
        state = graph.invoke({"topic": topic, "current_language": language})

        return {"data":state}

    if topic:
        graph = graph_builder.setup_graph()
        state = graph.invoke({"topic": topic})

        return {"data":state}
    
    return {"error":"Topic not found"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)