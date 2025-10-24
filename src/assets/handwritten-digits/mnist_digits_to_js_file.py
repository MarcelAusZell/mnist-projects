import tensorflow as tf
import tensorflow_datasets as tfds
import numpy as np

# Load the MNIST dataset
ds = tfds.load('mnist', split='train', shuffle_files=True)
ds = ds.as_numpy_iterator()

# Define digit names
digit_names = {
    0: "zero", 1: "one", 2: "two", 3: "three", 4: "four",
    5: "five", 6: "six", 7: "seven", 8: "eight", 9: "nine"
}

with open("handwritten-digits.js", "w") as f:
    for i in range(200):
        sample = next(ds)
        
        # Extract image and label
        image = sample['image']  # Shape is (28, 28, 1)
        label = int(sample['label'])
        
        # Flatten the grayscale values and convert to a list of integers
        pixel_values = image.reshape(-1).tolist()
        
        # Write to file - using your naming convention
        f.write(f"export const mnist{i} = ")
        f.write("[")
        # First value is the label
        f.write(f"{label}, ")
        # Then include all pixel values
        f.write(", ".join(map(str, pixel_values)))
        f.write("];\n\n")
        