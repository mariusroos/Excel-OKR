import ezdxf

def read_lwpolylines_from_dxf(file_path):
    """
    Reads all LWPOLYLINE entities from a DXF file provided as file_path.

    :param file_path: Path to the DXF file
    :return: A list of dictionaries containing information about each LWPOLYLINE
    """
    try:
        # Load the DXF document
        doc = ezdxf.readfile(file_path)
        # Access the modelspace where entities are typically stored
        msp = doc.modelspace()
        
        # Initialize a list to hold information about all LWPOLYLINEs
        lwpolyline_data = []
        
        # Iterate over all LWPOLYLINE entities in the modelspace
        for lwpolyline in msp.query("LWPOLYLINE"):
            # Extract vertex data as tuples of (x, y, start_width, end_width, bulge)
            points = [(float(x), float(y)) for x, y, _, _, _ in lwpolyline]
            
            # Store the extracted information
            data = {
                "points": points,  # List of vertex tuples
                "is_closed": lwpolyline.is_closed,  # Whether the polyline is closed
                "layer": lwpolyline.dxf.layer,  # Layer of the polyline
            }
            lwpolyline_data.append(data)
        
        return lwpolyline_data
    except IOError:
        print("Could not read the DXF file. Please check the file path.")
        return []
    except ezdxf.DXFStructureError:
        print("Invalid DXF file structure.")
        return []
