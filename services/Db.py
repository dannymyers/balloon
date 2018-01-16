import sqlite3
from Dal import *

# store the temperature in the database
def log_temperature(temp):

    conn=sqlite3.connect("/share/balloon.db")
    curs=conn.cursor()

    curs.execute("INSERT INTO temps values(datetime('now'), (?))", (temp,))

    # commit the changes
    conn.commit()

    conn.close()



sk1 = createSession(1, 2)
sk2 = getLatestSession()
print sk1
print sk2

#temp = raw_input('What is the temp? ')
#log_temperature(temp);
#print 'Hi, %s.' % temp

#conn=sqlite3.connect('/share/balloon.db')
#curs=conn.cursor()
#for row in curs.execute("SELECT * FROM temps"):
#    print row
#conn.close()