from langgraph.graph import StateGraph, START, END
from src.llms.openai_llm import OpenAILLM

from src.states.blog_state import BlogState

from src.nodes.blog_node import BlogNode

class GraphBuilder:

    def __init__(self, llm):
        self.llm = llm
        self.graph = StateGraph(BlogState)
        
    def build_topic_graph(self):
        """
            Build a graph to generate bolgs based on topic
        """
        ## defining the blog node
        self.blog_node = BlogNode(self.llm)

        ## Adding the nodes 
        self.graph.add_node("title_creation", self.blog_node.title_creation)
        self.graph.add_node("content_generation", self.blog_node.content_generation)
        self.graph.add_node("image_generation", self.blog_node.image_generation)

        ## Defining the Graph Edges
        self.graph.add_edge(START, "title_creation")
        self.graph.add_edge("title_creation", "content_generation")
        self.graph.add_edge("content_generation", "image_generation")
        self.graph.add_edge("image_generation", END)
    
    def multi_lang_blog_graph(self):
        """
            Building a blog in multi langauge taking topic and language input
        """

        ## defining the blog node
        self.blog_node = BlogNode(self.llm)

        ## Adding the nodes 
        self.graph.add_node("title_creation", self.blog_node.title_creation)
        self.graph.add_node("content_generation", self.blog_node.content_generation)
        self.graph.add_node("hindi_translation", lambda state: self.blog_node.translation({**state, "current_language": "hindi"}))
        self.graph.add_node("french_translation", lambda state: self.blog_node.translation({**state, "current_language": "french"}))
        self.graph.add_node("route", self.blog_node.route)

        ## Defining the Graph Edges
        self.graph.add_edge(START, "title_creation")
        self.graph.add_edge("title_creation", "content_generation")
        self.graph.add_edge("content_generation", "route")
        self.graph.add_conditional_edges(
            "route",
            self.blog_node.route_decision,
            {
                "hindi":"hindi_translation",
                "french":"french_translation"
            }
        )
        self.graph.add_edge("hindi_translation", END)
        self.graph.add_edge("french_translation", END)




    def setup_graph(self, trans = False):

        if trans:
            self.multi_lang_blog_graph()
        else:
            self.build_topic_graph()

        return self.graph.compile()
    

    
# ## Define the llm
# llm = OpenAILLM().get_llm_model()

# ## Get the Graph
# graph_builder = GraphBuilder(llm)
# graph = graph_builder.setup_graph()