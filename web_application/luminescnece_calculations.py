import cv2
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime

# Function to calculate average luminescence of a frame
def calculate_luminescence(frame):
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    return np.mean(gray_frame)

# Read the video
video_path = '/Users/mihirkakkar/Desktop/CLIA_SECOND_TRY/25ngml.mp4'
cap = cv2.VideoCapture(video_path)

start = datetime.now()
frame_rate = cap.get(cv2.CAP_PROP_FPS)
luminescence_values = []
times = []

frame_count = 0
peak_luminescence = 0

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Process every frame (or every nth frame)
    luminescence = calculate_luminescence(frame)
    luminescence_values.append(luminescence)

    # Calculate time for each frame
    time = frame_count / frame_rate
    times.append(time)

    # Check for peak luminescence
    if luminescence > peak_luminescence:
        peak_luminescence = luminescence

    frame_count += 1

cap.release()
end = datetime.now()
print("Time taken: ", end - start)
# Plotting
plt.plot(times, luminescence_values)
plt.xlabel('Time (s)')
plt.ylabel('Luminescence')
plt.title('Luminescence vs Time')
plt.show()

print(f"Peak Luminescence: {peak_luminescence}")
