import streamlit as st
import pandas as pd
import barcode
from barcode.writer import ImageWriter
from io import BytesIO
import base64

# Настройка страницы
st.set_page_config(page_title="Cloud Inventory", layout="wide")

# Загрузка базы данных (если файла нет, создаем пустой)
DB_FILE = "inventory_db.csv"
try:
    df = pd.read_csv(DB_FILE)
except FileNotFoundError:
    df = pd.DataFrame(columns=["ID", "Category", "Model", "Assigned_To"])

st.title("🌐 Cloud Office Inventory System")

# Боковая панель
with st.sidebar:
    st.header("Register New Asset")
    new_id = st.text_input("ID (e.g. LAP-101)")
    new_cat = st.selectbox("Category", ["Laptop", "Monitor", "Phone", "Other"])
    new_model = st.text_input("Model")
    new_user = st.text_input("User Name")
    
    if st.button("Generate & Save"):
        if new_id and new_model:
            # Создаем штрихкод в памяти (BytesIO)
            EAN = barcode.get_barcode_class('code128')
            my_barcode = EAN(new_id, writer=ImageWriter())
            buffer = BytesIO()
            my_barcode.write(buffer)
            
            # Показываем штрихкод пользователю
            st.image(buffer, caption=f"Barcode for {new_id}")
            
            # Добавляем в таблицу
            new_data = pd.DataFrame([[new_id, new_cat, new_model, new_user]], 
                                    columns=["ID", "Category", "Model", "Assigned_To"])
            df = pd.concat([df, new_data], ignore_index=True)
            df.to_csv(DB_FILE, index=False)
            st.success("Saved to Database!")
        else:
            st.warning("Fill all fields")

# Основная таблица
st.header("Current Inventory")
st.dataframe(df, use_container_width=True)

# Кнопка скачивания всей базы
csv = df.to_csv(index=False).encode('utf-8')
st.download_button("📥 Download Report (CSV)", csv, "inventory.csv", "text/csv")