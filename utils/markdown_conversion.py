from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.pipeline_options import PdfPipelineOptions, TableStructureOptions
from docling.datamodel.base_models import InputFormat
from docling.datamodel.accelerator_options import AcceleratorDevice, AcceleratorOptions
from pathlib import Path

def convert_to_markdown(input_file_path: Path, output_folder: Path) -> Path:
    """
    Converts PDF, DOC, or DOCX to Markdown using Docling.
    Returns the path to the generated .md file.
    """

    # 1) Configure PDF options
    pdf_pipeline_options = PdfPipelineOptions(
        do_ocr=True,
        do_table_structure=True,
        table_structure_options=TableStructureOptions(do_cell_matching=True),
        accelerator_options=AcceleratorOptions(
            num_threads=4,
            device=AcceleratorDevice.CUDA
        )
    )

    # 2) Prepare converter and support PDF + DOCX (also handles .doc)
    converter = DocumentConverter(
        format_options={
            InputFormat.PDF: PdfFormatOption(pipeline_options=pdf_pipeline_options)
        }
    )

    # 3) Perform conversion
    converted_doc = converter.convert(str(input_file_path))

    # 4) Save output
    output_folder.mkdir(exist_ok=True)
    output_path = output_folder / f"{input_file_path.stem}.md"
    output_path.write_text(converted_doc.document.export_to_markdown(), encoding="utf-8")

    return output_path
