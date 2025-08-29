import tensorflow as tf
import numpy as np

# === Load Model ===
model = tf.keras.models.load_model("model/trained_model.keras")

# === Class Names (must match training order) ===
class_names = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Cashew_anthracnose', 'Cashew_gumosis', 'Cashew_healthy', 'Cashew_leaf_miner', 'Cashew_red_rust',
    'Cassava_bacterial_blight', 'Cassava_brown_spot', 'Cassava_green_mite', 'Cassava_healthy',
    'Cassava_mosaic', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy',
    'Insects_pest_ants', 'Insects_pest_bees', 'Insects_pest_beetle', 'Insects_pest_catterpillar',
    'Insects_pest_earthworms', 'Insects_pest_earwig', 'Insects_pest_grasshopper', 'Insects_pest_moth',
    'Insects_pest_slug', 'Insects_pest_snail', 'Insects_pest_wasp', 'Insects_pest_weevil',
    'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight',
    'Potato___Late_blight', 'Potato___healthy', 'Rice_bacterial_leaf_blight', 'Rice_brown_spot',
    'Rice_healthy', 'Rice_leaf_blast', 'Rice_leaf_scald', 'Rice_narrow_brown_spot',
    'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight',
    'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]

# === IMAGE PROCESSING ===
def preprocess_image(img_path):
    image = tf.keras.preprocessing.image.load_img(img_path, target_size=(128, 128))
    input_arr = tf.keras.preprocessing.image.img_to_array(image)
    return np.array([input_arr])  # batch dimension

# === PREDICTION ===
def predict_label(image_path):
    img_tensor = preprocess_image(image_path)
    preds = model.predict(img_tensor)[0]
    predicted_idx = np.argmax(preds)
    predicted_label = class_names[predicted_idx]
    confidence = preds[predicted_idx]
    return predicted_label, confidence
