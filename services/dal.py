import sys
import datetime
from sqlalchemy import *
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relation, sessionmaker

Base = declarative_base()

class Launch(Base):
	__tablename__ = 'Launch'
	LaunchKey = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
	InitTime = Column(DateTime, nullable=False)
	LaunchTime = Column(DateTime, nullable=True)
	EstimatedTotalFlightTimeInHours = Column(Integer, nullable=False)
	TemperatureAtZeroInCelsius = Column(Float, nullable=False)
	PressureAtSeaLevelInPascals = Column(Float, nullable=False)
    
	def __init__(self, TemperatureAtZeroInCelsius=None, PressureAtSeaLevelInPascals=None, EstimatedTotalFlightTimeInHours=None):
		self.InitTime = datetime.datetime.now()
		self.TemperatureAtZeroInCelsius = TemperatureAtZeroInCelsius
		self.PressureAtSeaLevelInPascals = PressureAtSeaLevelInPascals
		self.EstimatedTotalFlightTimeInHours = EstimatedTotalFlightTimeInHours

	def __repr__(self):
		return "Launch(LaunchKey=%r,InitTime=%r,LaunchTime=%r,EstimatedTotalFlightTimeInHours=%r,TemperatureAtZeroInCelsius=%r,PressureAtSeaLevelInPascals=%r)" % (self.LaunchKey, self.InitTime, self.LaunchTime, self.EstimatedTotalFlightTimeInHours, self.TemperatureAtZeroInCelsius, self.PressureAtSeaLevelInPascals)

class GpsReading(Base):
	__tablename__ = 'GpsReading'
	GpsReadingKey = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
	LaunchKey = Column(Integer, ForeignKey('Launch.LaunchKey', ondelete="CASCADE"), nullable=False, index=True)
	Launch = relation("Launch", backref='GpsReadings', lazy=True)
	ReadingTime = Column(DateTime, nullable=False)
	GnssRunStatus = Column(String(255), nullable=True)
	FixStatus = Column(String(255), nullable=True)
	DateAndTimeUtc = Column(String(255), nullable=True)
	Latitude = Column(String(255), nullable=True)
	Longitude = Column(String(255), nullable=True)
	MslAltitude = Column(String(255), nullable=True)
	SpeedOverGround = Column(String(255), nullable=True)
	CourseOverGround = Column(String(255), nullable=True)
	FixMode = Column(String(255), nullable=True)
	Reserved1 = Column(String(255), nullable=True)
	Hdop = Column(String(255), nullable=True)
	Pdop = Column(String(255), nullable=True)
	Vdop = Column(String(255), nullable=True)
	Reserved2 = Column(String(255), nullable=True)
	GnssSatellitesInView = Column(String(255), nullable=True)
	GnssSatellitesUsed = Column(String(255), nullable=True)
	GlonassSatellitesUsed = Column(String(255), nullable=True)
	Reserved3 = Column(String(255), nullable=True)
	CNoMax = Column(String(255), nullable=True)
	Hpa = Column(String(255), nullable=True)
	Vpa = Column(String(255), nullable=True)

	def __init__(self, LaunchKey=None, Sentence=None):
		self.ReadingTime = datetime.datetime.now()
		self.LaunchKey = LaunchKey

	def __repr__(self):
		return "GpsReading(%r, %r, %r)" % (self.GpsReadingKey, self.ReadingTime, self.Latitude, self.Longitude)

class CellNetworkReading(Base):
	__tablename__ = 'CellNetworkReading'
	CellNetworkReadingKey = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
	LaunchKey = Column(Integer, ForeignKey('Launch.LaunchKey', ondelete="CASCADE"), nullable=False, index=True)
	Launch = relation("Launch", backref='CellNetworkReadings', lazy=True)
	ReadingTime = Column(DateTime, nullable=False)
	IsConnected = Column(Boolean, nullable=False)
	SignalStrengthDecibals = Column(Float, nullable=False)
	BatteryPercentFull = Column(Float, nullable=False)
	VoltageMillivolts = Column(Float, nullable=False)
    
	def __init__(self, LaunchKey=None, IsConnected=None, SignalStrengthDecibals=None, BatteryPercentFull=None, VoltageMillivolts=None):
		self.ReadingTime = datetime.datetime.now()
		self.LaunchKey = LaunchKey
		self.IsConnected = IsConnected
		self.SignalStrengthDecibals = SignalStrengthDecibals
		self.BatteryPercentFull = BatteryPercentFull
		self.VoltageMillivolts = VoltageMillivolts

	def __repr__(self):
		return "CellNetworkReading(%r)" % (self.CellNetworkReadingKey)

class ExternalTemperatureReading(Base):
	__tablename__ = 'ExternalTemperatureReading'
	ExternalTemperatureReadingKey = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
	LaunchKey = Column(Integer, ForeignKey('Launch.LaunchKey', ondelete="CASCADE"), nullable=False, index=True)
	Launch = relation("Launch", backref='ExternalTemperatureReadings', lazy=True)
	ReadingTime = Column(DateTime, nullable=False)
	TemperatureInFahrenheit = Column(Float, nullable=False)
    
	def __init__(self, LaunchKey=None, TemperatureInFahrenheit=None):
		self.ReadingTime = datetime.datetime.now()
		self.LaunchKey = LaunchKey
		self.TemperatureInFahrenheit = TemperatureInFahrenheit

	def __repr__(self):
		return "ExternalTemperatureReading(%r)" % (self.ExternalTemperatureReadingKey)

class AltitudeReading(Base):
	__tablename__ = 'AltitudeReading'
	AltitudeReadingKey = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
	LaunchKey = Column(Integer, ForeignKey('Launch.LaunchKey', ondelete="CASCADE"), nullable=False, index=True)
	Launch = relation("Launch", backref='AltitudeReadings', lazy=True)
	ReadingTime = Column(DateTime, nullable=False)
	TemperatureInFahrenheit = Column(Float, nullable=False)
	PressureInPascals = Column(Float, nullable=False)
	AltitudeInFeet = Column(Float, nullable=False)
    
	def __init__(self, LaunchKey=None, TemperatureInFahrenheit=None, PressureInPascals=None, AltitudeInFeet=None):
		self.ReadingTime = datetime.datetime.now()
		self.LaunchKey = LaunchKey
		self.TemperatureInFahrenheit = TemperatureInFahrenheit
		self.PressureInPascals = PressureInPascals
		self.AltitudeInFeet = AltitudeInFeet

	def __repr__(self):
		return "AltitudeReading(%r)" % (self.AltitudeReadingKey)

class GyroReading(Base):
	__tablename__ = 'GyroReading'
	GyroReadingKey = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
	LaunchKey = Column(Integer, ForeignKey('Launch.LaunchKey', ondelete="CASCADE"), nullable=False, index=True)
	Launch = relation("Launch", backref='GyroReadings', lazy=True)
	ReadingTime = Column(DateTime, nullable=False)
	TemperatureInFahrenheit = Column(Float, nullable=False)
	GyroX = Column(Float, nullable=False)
	GyroY = Column(Float, nullable=False)
	GyroZ = Column(Float, nullable=False)
	AccelX = Column(Float, nullable=False)
	AccelY = Column(Float, nullable=False)
	AccelZ = Column(Float, nullable=False)
	MagX = Column(Float, nullable=True)
	MagY = Column(Float, nullable=True)
	MagZ = Column(Float, nullable=True)
    
	def __init__(self, LaunchKey=None, TemperatureInFahrenheit=None, GyroX=None, GyroY=None, GyroZ=None, AccelX=None, AccelY=None, AccelZ=None, MagX=None, MagY=None, MagZ=None):
		self.ReadingTime = datetime.datetime.now()
		self.LaunchKey = LaunchKey
		self.TemperatureInFahrenheit = TemperatureInFahrenheit
		self.GyroX = GyroX
		self.GyroY = GyroY
		self.GyroZ = GyroZ
		self.AccelX = AccelX
		self.AccelY = AccelY
		self.AccelZ = AccelZ
		self.MagX = MagX
		self.MagY = MagY
		self.MagZ = MagZ

	def __repr__(self):
		return "GyroReading(%r)" % (self.GyroReadingKey)

class CameraReading(Base):
	__tablename__ = 'CameraReading'
	CameraReadingKey = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
	LaunchKey = Column(Integer, ForeignKey('Launch.LaunchKey', ondelete="CASCADE"), nullable=False, index=True)
	Launch = relation("Launch", backref='CameraReadings', lazy=True)
	ReadingTime = Column(DateTime, nullable=False)
	ImageName = Column(String(255), nullable=False)
	IsSent = Column(Boolean, nullable=False)
    
	def __init__(self, LaunchKey=None, ImageName=None):
		self.ReadingTime = datetime.datetime.now()
		self.LaunchKey = LaunchKey
		self.ImageName = ImageName
		self.IsSent = False

	def __repr__(self):
		return "CameraReading(%r)" % (self.CameraReadingKey)

class IncomingMessage(Base):
	__tablename__ = 'IncomingMessage'
	IncomingMessageKey = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
	LaunchKey = Column(Integer, ForeignKey('Launch.LaunchKey', ondelete="CASCADE"), nullable=False, index=True)
	Launch = relation("Launch", backref='IncomingMessages', lazy=True)
	MessageTime = Column(DateTime, nullable=False)
	Source = Column(String(255), nullable=False)
	Message = Column(String(255), nullable=False)
	IsHandled = Column(Boolean, nullable=False)
    
	def __init__(self, LaunchKey=None, Source=None, Message=None):
		self.MessageTime = datetime.datetime.now()
		self.LaunchKey = LaunchKey
		self.Source = Source
		self.Message = Message
		self.IsHandled = False

	def __repr__(self):
		return "IncomingMessage(%r)" % (self.IncomingMessageKey)

class OutgoingMessage(Base):
	__tablename__ = 'OutgoingMessage'
	OutgoingMessageKey = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
	LaunchKey = Column(Integer, ForeignKey('Launch.LaunchKey', ondelete="CASCADE"), nullable=False, index=True)
	Launch = relation("Launch", backref='OutgoingMessages', lazy=True)
	MessageTime = Column(DateTime, nullable=False)
	Message = Column(String(255), nullable=False)
	IsSendViaLora = Column(Boolean, nullable=False)
	IsHandledByLora = Column(Boolean, nullable=False)
	IsSendViaSms = Column(Boolean, nullable=False)
	IsHandledBySms = Column(Boolean, nullable=False)
    
	def __init__(self, LaunchKey=None, Message=None, IsSendViaLora=None, IsSendViaSms=None):
		self.MessageTime = datetime.datetime.now()
		self.LaunchKey = LaunchKey
		self.Message = Message
		self.IsSendViaLora = IsSendViaLora
		self.IsHandledByLora = False
		self.IsSendViaSms = IsSendViaSms
		self.IsHandledBySms = False

	def __repr__(self):
		return "OutgoingMessage(%r)" % (self.OutgoingMessageKey)

class ErrorMessage(Base):
	__tablename__ = 'ErrorMessage'
	ErrorMessageKey = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
	LaunchKey = Column(Integer, ForeignKey('Launch.LaunchKey', ondelete="CASCADE"), nullable=False, index=True)
	Launch = relation("Launch", backref='ErrorMessages', lazy=True)
	ErrorTime = Column(DateTime, nullable=False)
	Module = Column(String(255), nullable=False)
	Message = Column(String(255), nullable=False)
	    
	def __init__(self, LaunchKey=None, Module=None, Message=None):
		self.ErrorTime = datetime.datetime.now()
		self.LaunchKey = LaunchKey
		self.Module = Module
		self.Message = Message

	def __repr__(self):
		return "ErrorMessage(%r, %r, %r, %r, %r)" % (self.ErrorMessageKey, self.LaunchKey, self.ErrorTime, self.Module, self.Message)

def GetSession():
	engine = create_engine('sqlite:////share/balloon.db')
	Base.metadata.create_all(engine)
	Session = sessionmaker(bind=engine)
	session = Session()
	return session

def SaveSession(session):
	try:
		session.commit()
	except:
		session.rollback()
		print(sys.exc_info()[0])

def GetCurrentLaunchKey(session):
	launchKey = session.query(func.max(Launch.LaunchKey)).one_or_none()[0]
	if not launchKey:
		#print("Adding New Launch")
		launch = Launch(1, 1, 1)
		try:
			session.add(launch)
			session.commit()
		except:
			session.rollback()
			print(sys.exc_info()[0])
		return launch.LaunchKey
	else:
		#print("Found Launch")
		#print(launchKey)
		return launchKey