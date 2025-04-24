## Network dham network congestion 
 We are building a scalable solution for kainchi dham traffic congestion problem using Our core algorithm that is discussed betwo 
# Complete Archi: 
![complete](https://github.com/user-attachments/assets/f31356fb-7537-4340-88ad-2a3921789d37)

 # High level design [HLD]
 ![HLD](https://github.com/user-attachments/assets/020c83c8-f8e3-42ef-a938-e173bf57fcb0)
 # User Frontend 🙂

## 🎟️ Ticket Generation

The user will generate a ticket that includes:
- 🚗 Vehicle Type  
- 🧑 User Name  
- 👥 Number of People  
- 🛕 Visit Intent: Are you visiting the temple or just passing through?

---

## 📊 Congestion Prediction Algorithm


![coreAlgo](https://github.com/user-attachments/assets/0619cca0-4e4b-42df-bc39-719ab1675082)

We're developing an algorithm that integrates seamlessly with our model to **predict network congestion** over a **2-day window**, broken down into **30-minute intervals**.

### 📅 Time Window
- Each day is divided into **30-minute windows** from **7:00 AM to 8:00 PM**.

### 🚦 Vehicle Allocation
- Each window allows only **one type of vehicle**.
- Example distribution:
  - **Window 1**: 200 Two-Wheelers
  - **Window 2**: 150 Four-Wheelers
  - **Window 3**: 100 Heavy Vehicles

The algorithm ensures a fixed number of vehicles per window and aligns with our congestion prediction model to optimize flow and reduce traffic bottlenecks.

--- 
