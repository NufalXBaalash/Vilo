from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.pipeline_options import PdfPipelineOptions, TableStructureOptions
from docling.datamodel.base_models import InputFormat
from docling.datamodel.accelerator_options import AcceleratorDevice, AcceleratorOptions
from pathlib import Path

def convert_pdf_to_markdown(input_file_path: Path, output_folder: Path) -> Path:
    """
    Converts a PDF file to Markdown using Docling and returns the path of the output file.
    """
    pipeline_options = PdfPipelineOptions(
        do_ocr=True,
        do_table_structure=True,
        table_structure_options=TableStructureOptions(do_cell_matching=True),
        accelerator_options=AcceleratorOptions(
            num_threads=4,
            device=AcceleratorDevice.CUDA
        )
    )

    doc_converter = DocumentConverter(
        format_options={
            InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)
        }
    )

    converted_doc = doc_converter.convert(input_file_path)

    output_folder.mkdir(exist_ok=True)
    file_stem = input_file_path.stem
    output_file_path = output_folder / f"{file_stem}.md"

    output_file_path.write_text(converted_doc.document.export_to_markdown(), encoding="utf-8")

    return output_file_path
