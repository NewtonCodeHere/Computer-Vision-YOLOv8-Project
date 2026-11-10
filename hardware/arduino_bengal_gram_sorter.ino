/*
 * Bengal Gram Impurity Sorter Firmware (Arduino Nano / ESP32)
 * 
 * Receives serial commands from YOLOv8 Backend:
 * "ACTUATE,<X>,<Y>,<CLASS_NAME>\n"
 * 
 * Actuates pneumatic solenoid valve / servo ejection arm
 * to separate foreign objects (stones, twigs, jute, plastic).
 */

#include <Arduino.h>

#ifdef ESP32
  #include <ESP32Servo.h>
#else
  #include <Servo.h>
#endif

// Pin Definitions
const int VALVE_PIN = 7;      // Pneumatic solenoid relay pin
const int BUZZER_PIN = 8;     // Alarm buzzer
const int SERVO_PIN = 9;      // Robotic diverter servo
const int STATUS_LED = 13;    // Activity LED

Servo ejectorServo;

void setup() {
  Serial.begin(115200);
  
  pinMode(VALVE_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(STATUS_LED, OUTPUT);
  
  digitalWrite(VALVE_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(STATUS_LED, HIGH);

  ejectorServo.attach(SERVO_PIN);
  ejectorServo.write(0); // Neutral conveyor position
  
  delay(500);
  digitalWrite(STATUS_LED, LOW);
  Serial.println("READY: Bengal Gram Sorter Online");
}

void loop() {
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n');
    input.trim();
    
    if (input.startsWith("ACTUATE,")) {
      // Command format: ACTUATE,X,Y,CLASS
      int firstComma = input.indexOf(',');
      int secondComma = input.indexOf(',', firstComma + 1);
      int thirdComma = input.indexOf(',', secondComma + 1);
      
      int targetX = input.substring(firstComma + 1, secondComma).toInt();
      int targetY = input.substring(secondComma + 1, thirdComma).toInt();
      String impurityClass = input.substring(thirdComma + 1);
      
      // Flash indicator
      digitalWrite(STATUS_LED, HIGH);
      
      // Fire pneumatic air pulse or sweep servo
      digitalWrite(VALVE_PIN, HIGH);
      ejectorServo.write(60); // Divert reject chute
      
      delay(80); // 80ms pneumatic pulse
      digitalWrite(VALVE_PIN, LOW);
      
      delay(120);
      ejectorServo.write(0); // Return to neutral
      digitalWrite(STATUS_LED, LOW);
      
      Serial.print("ACK: Ejected ");
      Serial.print(impurityClass);
      Serial.print(" at X=");
      Serial.print(targetX);
      Serial.print(" Y=");
      Serial.println(targetY);
    } 
    else if (input == "PING") {
      Serial.println("PONG: Sorter Active");
    }
  }
}
