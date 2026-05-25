import os
from pdf2image import convert_from_path
from PIL import Image

# Certificate files to convert
certificates = {
    'NPTEL CN certificate.pdf': 'nptel-networks.png',
    'simplilearn - HTML.pdf': 'simplilearn-html.png',
    'open source.pdf': 'opensource.png',
    'free_codecamp - JS.pdf': 'freecodecamp-js.png',
    'edureka - JS.pdf': 'edureka-js.png',
}

source_dir = r'c:\Users\DAKSH\OneDrive\Documents\cirtificates'
output_dir = r'assets\certificates'

for pdf_file, png_file in certificates.items():
    pdf_path = os.path.join(source_dir, pdf_file)
    output_path = os.path.join(output_dir, png_file)
    
    if os.path.exists(pdf_path):
        try:
            print(f"Converting {pdf_file}...")
            # Convert first page of PDF to image
            images = convert_from_path(pdf_path, first_page=1, last_page=1, dpi=150)
            
            if images:
                # Save the image
                images[0].save(output_path, 'PNG', quality=90)
                print(f"✓ Saved to {output_path}")
        except Exception as e:
            print(f"✗ Error converting {pdf_file}: {e}")
    else:
        print(f"✗ File not found: {pdf_file}")

print("\nConversion complete!")
