import sqlite3

# store the temperature in the database
def log_temperature(temp):

    conn=sqlite3.connect("/share/balloon.db")
    curs=conn.cursor()

    curs.execute("INSERT INTO temps values(datetime('now'), (?))", (temp,))

    # commit the changes
    conn.commit()

    conn.close()


temp = raw_input('What is the temp? ')
log_temperature(temp);
print 'Hi, %s.' % temp

conn=sqlite3.connect('/share/balloon.db')
curs=conn.cursor()
for row in curs.execute("SELECT * FROM temps"):
    print row

conn.close()
