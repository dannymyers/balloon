CREATE TABLE IF NOT EXISTS Session
(
	SessionKey INTEGER PRIMARY KEY NOT NULL,
	StartTime INTEGER NOT NULL DEFAULT (strftime('%s','now')),
	LaunchTime INTEGER NULL,
	EstimatedTotalFlightTimeInHours INTEGER NULL,
	TemperatureAtZeroInCelsius REAL NOT NULL,
	PressureAtSeaLevelInPascals REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS GpsReading
(
	GpsReadingKey INTEGER PRIMARY KEY NOT NULL,
	SessionKey INTEGER NOT NULL,
	ReadingTime INTEGER NOT NULL DEFAULT (strftime('%s','now')),
	GnssRunStatus TEXT NULL,
	FixStatus TEXT NULL,
	DateAndTimeUtc TEXT NULL,
	Latitude TEXT NULL,
	Longitude TEXT NULL,
	MslAltitude TEXT NULL,
	SpeedOverGround TEXT NULL,
	CourseOverGround TEXT NULL,
	FixMode TEXT NULL,
	Reserved1 TEXT NULL,
	Hdop TEXT NULL,
	Pdop TEXT NULL,
	Vdop TEXT NULL,
	Reserved2 TEXT NULL,
	GnssSatellitesInView TEXT NULL,
	GnssSatellitesUsed TEXT NULL,
	GlonassSatellitesUsed TEXT NULL,
	Reserved3 TEXT NULL,
	CNoMax TEXT NULL,
	Hpa TEXT NULL,
	Vpa TEXT NULL,
	FOREIGN KEY(SessionKey) REFERENCES Session(SessionKey) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS ix_GpsReading ON GpsReading (SessionKey, ReadingTime);

CREATE TABLE IF NOT EXISTS CellNetworkReading
(
	CellReadingKey INTEGER PRIMARY KEY NOT NULL,
	SessionKey INTEGER NOT NULL,
	ReadingTime INTEGER NOT NULL DEFAULT (strftime('%s','now')),
	IsConnected INTEGER NOT NULL,
	SignalStrengthDecibals REAL NOT NULL,
	BatteryPercentFull REAL NOT NULL,
	VoltageMillivolts REAL NOT NULL,
	FOREIGN KEY(SessionKey) REFERENCES Session(SessionKey) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS ix_CellNetworkReading ON CellNetworkReading (SessionKey, ReadingTime);

CREATE TABLE IF NOT EXISTS ExternalTemperatureReading
(
	ExternalTemperatureReadingKey INTEGER PRIMARY KEY NOT NULL,
	SessionKey INTEGER NOT NULL,
	ReadingTime INTEGER NOT NULL DEFAULT (strftime('%s','now')),
	TemperatureInFahrenheit REAL NOT NULL,
	FOREIGN KEY(SessionKey) REFERENCES Session(SessionKey) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS ix_ExternalTemperatureReading ON ExternalTemperatureReading (SessionKey, ReadingTime);

CREATE TABLE IF NOT EXISTS AltitudeReading
(
	AltitudeReadingKey INTEGER PRIMARY KEY NOT NULL,
	SessionKey INTEGER NOT NULL,
	ReadingTime INTEGER NOT NULL DEFAULT (strftime('%s','now')),
	TemperatureInFahrenheit REAL NOT NULL,
	PressureInPascals REAL NOT NULL,
	AltitudeInFeet REAL NOT NULL,
	FOREIGN KEY(SessionKey) REFERENCES Session(SessionKey) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS ix_AltitudeReading ON AltitudeReading (SessionKey, ReadingTime);

CREATE TABLE IF NOT EXISTS GyroReading
(
	GyroReadingKey INTEGER PRIMARY KEY NOT NULL,
	SessionKey INTEGER NOT NULL,
	ReadingTime INTEGER NOT NULL DEFAULT (strftime('%s','now')),
	GyroX REAL NOT NULL,
	GyroY REAL NOT NULL,
	GyroZ REAL NOT NULL,
	AccelX REAL NOT NULL,
	AccelY REAL NOT NULL,
	AccelZ REAL NOT NULL,
	MagX REAL NOT NULL,
	MagY REAL NOT NULL,
	MagZ REAL NOT NULL,
	FOREIGN KEY(SessionKey) REFERENCES Session(SessionKey) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS ix_GyroReading ON GyroReading (SessionKey, ReadingTime);

CREATE TABLE IF NOT EXISTS CameraReading
(
	CameraReadingKey INTEGER PRIMARY KEY NOT NULL,
	SessionKey INTEGER NOT NULL,
	ReadingTime INTEGER NOT NULL DEFAULT (strftime('%s','now')),
	ImageName TEXT NOT NULL,
	IsSent INTEGER NOT NULL,
	FOREIGN KEY(SessionKey) REFERENCES Session(SessionKey) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS ix_CameraReading ON CameraReading (SessionKey, ReadingTime);

CREATE TABLE IF NOT EXISTS IncomingMessage
(
	IncomingMessageKey INTEGER PRIMARY KEY NOT NULL,
	SessionKey INTEGER NOT NULL,
	MessageTime INTEGER NOT NULL DEFAULT (strftime('%s','now')),
	Source TEXT NOT NULL,
	Message TEXT NOT NULL,
	IsHandled INTEGER NOT NULL,
	FOREIGN KEY(SessionKey) REFERENCES Session(SessionKey) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS ix_IncomingMessage ON IncomingMessage (SessionKey, MessageTime);

CREATE TABLE IF NOT EXISTS OutgoingMessage
(
	OutgoingMessageKey INTEGER PRIMARY KEY NOT NULL,
	SessionKey INTEGER NOT NULL,
	MessageTime INTEGER NOT NULL DEFAULT (strftime('%s','now')),
	Message TEXT NOT NULL,
	IsSendViaLora INTEGER NOT NULL,
	IsHandledByLora INTEGER NOT NULL,
	IsSendViaSms INTEGER NOT NULL,
	IsHandledBySms INTEGER NOT NULL,
	FOREIGN KEY(SessionKey) REFERENCES Session(SessionKey) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS ix_OutgoingMessage ON OutgoingMessage (SessionKey, MessageTime);

CREATE TABLE IF NOT EXISTS ErrorMessage
(
	ErrorMessageKey INTEGER PRIMARY KEY NOT NULL,
	SessionKey INTEGER NOT NULL,
	ErrorTime INTEGER NOT NULL DEFAULT (strftime('%s','now')),
	Module TEXT NOT NULL,
	Message TEXT NOT NULL,
	FOREIGN KEY(SessionKey) REFERENCES Session(SessionKey) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS ix_ErrorMessage ON ErrorMessage (SessionKey, ErrorTime);

/*
AT+COPS? Check that you're connected to the network, in this case T-Mobile
AT+CSQ - Check the 'signal strength' - the first # is dB strength, it should be higher than around 5. Higher is better. Of course it depends on your antenna and location!
AT+CBC - will return the lipo battery state. The second number is the % full (in this case its 92%) and the third number is the actual voltage in mV (in this case, 3.877 V)
*/
