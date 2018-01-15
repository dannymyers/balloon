from mpu6050 import mpu6050

mpu = mpu6050(0x68)

temp = mpu.get_temp()
accel_data = mpu.get_accel_data()
gyro_data = mpu.get_gyro_data()

print("Accelerometer data")
print("x: " + str(accel_data['x']))
print("y: " + str(accel_data['y']))
print("z: " + str(accel_data['z']))

print("Gyroscope data")
print("x: " + str(gyro_data['x']))
print("y: " + str(gyro_data['y']))
print("z: " + str(gyro_data['z']))

print("Temp: " + str(temp) + " C")