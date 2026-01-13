import streamlit as st
import pandas as pd
import barcode
from barcode.writer import ImageWriter
from io import BytesIO
import base64
import os

# Page Config
st.set_page_config(page_title="Office Inventory System", layout="wide")

# Ensure the barcodes folder exists locally (for temporary storage)
if not os.path.exists("barcodes"):
    os.makedirs("barcodes")

# Load Database
DB_FILE = "inventory_db.csv"
if os.path.exists(DB_FILE):
    df = pd.read_csv(DB_FILE)
else:
    df = pd.DataFrame(columns=["ID", "Category", "Model", "Owner"])

# --- HEADER ---
st.title("📦 Office Asset Management System")
st.markdown("---")

# --- SIDEBAR: REGISTRATION ---
with st.sidebar:
    st.header("Register New Asset")
    asset_id = st.text_input("Asset ID (e.g., LAP-001)")
    category = st.selectbox("Category", ["Laptop", "Monitor", "Smartphone", "Tablet", "Peripheral"])
    model = st.text_input("Model Name (e.g., MacBook Air)")
    owner = st.text_input("Assign to Employee")
    
    if st.button("Register & Generate Barcode"):
        if asset_id and model:
            # 1. Generate Barcode in memory
            CODE = barcode.get_barcode_class('code128')
            my_barcode = CODE(asset_id, writer=ImageWriter())
            
            # Save to buffer to show on screen
            buffer = BytesIO()
            my_barcode.write(buffer)
            
            # 2. Update Database
            new_entry = pd.DataFrame([[asset_id, category, model, owner]], 
                                     columns=["ID", "Category", "Model", "Owner"])
            df = pd.concat([df, new_entry], ignore_index=True)
            df.to_csv(DB_FILE, index=False)
            
            st.success(f"Asset {asset_id} Registered!")
            st.image(buffer, caption=f"Barcode for {asset_id}")
            
            # Provide Download Link for the Barcode Image
            btn = st.download_button(
                label="Download Barcode Image",
                data=buffer.getvalue(),
                file_name=f"{asset_id}.png",
                mime="image/png"
            )
        else:
            st.error("Please provide both ID and Model.")

# --- MAIN AREA: SEARCH & VIEW ---
col1, col2 = st.columns([1, 2])

with col1:
    st.header("🔍 Scan / Search")
    search_query = st.text_input("Click here and SCAN barcode", placeholder="Search by ID...")
    
    if search_query:
        # Filter dataframe
        result = df[df['ID'].astype(str) == search_query]
        
        if not result.empty:
            st.success("Item Found!")
            st.write(f"**Model:** {result.iloc[0]['Model']}")
            st.write(f"**Category:** {result.iloc[0]['Category']}")
            st.write(f"**Assigned to:** {result.iloc[0]['Owner']}")
        else:
            st.warning("No asset found with that ID.")

with col2:
    st.header("📊 Current Inventory")
    st.dataframe(df, use_container_width=True)
    
    # Export Button
    csv = df.to_csv(index=False).encode('utf-8')
    st.download_button(
        label="Download Full Inventory as CSV",
        data=csv,
        file_name='office_inventory_report.csv',
        mime='text/csv',
    )