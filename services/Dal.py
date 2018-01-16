import sqlite3

def getConnection():
    return sqlite3.connect("/share/balloon/db/balloon.db")
    
def createSession(temperatureAtZeroInCelsius, pressureAtSeaLevelInPascals):
    conn=getConnection()
    curs=conn.cursor()
    curs.execute("INSERT INTO Session(TemperatureAtZeroInCelsius,PressureAtSeaLevelInPascals) values(?, ?)", (temperatureAtZeroInCelsius, pressureAtSeaLevelInPascals))
    conn.commit()
    conn.close()
    return getLatestSession()

def getLatestSession():
    conn=getConnection()
    curs=conn.cursor()
    sessionKey = None
    for row in curs.execute("SELECT SessionKey FROM Session ORDER BY SessionKey DESC LIMIT 1"):
        sessionKey = row[0]
    conn.commit()
    conn.close()
    return sessionKey