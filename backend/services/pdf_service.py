import pymupdf as fitz

def extract_pdf_text(path):
    document = fitz.open(path)
    text = ""

    for page in document:
        text += page.get_text()

    document.close()
    return text