from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.docstore.document import Document
from app.config import Config


def load_and_split_document(file_path: str) -> list[Document]:
    """
    텍스트 파일을 읽어 전체 내용을 로드한 후,
    지정한 크기로 chunk 단위로 분할하여 Document 객체 리스트를 생성
    """
    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=Config.CHUNK_SIZE,
        chunk_overlap=Config.CHUNK_OVERLAP,
        separators=["\n\n", "\n", " "]
    )
    chunks = text_splitter.split_text(text)
    documents = [Document(page_content=chunk) for chunk in chunks]
    
    return documents


def create_vector_store(file_path: str = Config.DOCUMENT_PATH):
    """
    문서를 로드하고, OpenAI 임베딩을 적용해 FAISS 벡터스토어를 생성
    """
    documents = load_and_split_document(file_path)
    embeddings = OpenAIEmbeddings(openai_api_key=Config.OPENAI_API_KEY)
    vector_store = FAISS.from_documents(documents, embeddings)

    return vector_store
