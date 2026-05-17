import { useState, useEffect } from "react";
import { Phone, MapPin, User, Clock, ArrowLeft, AlertTriangle, Heart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface EmergencyAlertProps {
  onBack: () => void;
}

interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  priority: number;
  available: boolean;
}

interface MedicalInfo {
  bloodType: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  emergencyNotes: string;
}

const emergencyContacts: EmergencyContact[] = [
  {
    id: "1",
    name: "Dr. Priya Sharma",
    relation: "Primary Doctor",
    phone: "+91-9876543210",
    priority: 1,
    available: true
  },
  {
    id: "2", 
    name: "Rajesh Kumar (Father)",
    relation: "Family",
    phone: "+91-9876543211",
    priority: 2,
    available: true
  },
  {
    id: "3",
    name: "Meera Devi (Mother)",
    relation: "Family", 
    phone: "+91-9876543212",
    priority: 3,
    available: false
  },
  {
    id: "4",
    name: "Local Emergency Services",
    relation: "Emergency",
    phone: "108",
    priority: 4,
    available: true
  }
];

const medicalInfo: MedicalInfo = {
  bloodType: "B+",
  allergies: ["Penicillin", "Peanuts"],
  medications: ["Vitamin D3", "Speech therapy supplements"],
  conditions: ["Speech impairment", "Mild anxiety"],
  emergencyNotes: "Patient has speech difficulties. Please be patient with communication. Caregiver contact: +91-9876543211"
};

export const EmergencyAlert = ({ onBack }: EmergencyAlertProps) => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [emergencyStartTime, setEmergencyStartTime] = useState<Date | null>(null);
  const [contactedCount, setContactedCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(position);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Location access denied",
            description: "Please enable location services for emergency features",
            variant: "destructive"
          });
        }
      );
    }
  };

  const triggerEmergency = async () => {
    setIsEmergencyActive(true);
    setEmergencyStartTime(new Date());
    setContactedCount(0);

    // Get current location
    getCurrentLocation();

    // Start contacting emergency contacts
    contactEmergencyContacts();

    toast({
      title: "🚨 EMERGENCY ALERT ACTIVATED",
      description: "Contacting your emergency contacts and sharing your location",
      variant: "destructive"
    });
  };

  const contactEmergencyContacts = async () => {
    const availableContacts = emergencyContacts
      .filter(contact => contact.available)
      .sort((a, b) => a.priority - b.priority);

    for (let i = 0; i < availableContacts.length; i++) {
      const contact = availableContacts[i];
      
      // Simulate contacting (in real app, this would send SMS/call)
      setTimeout(() => {
        setContactedCount(i + 1);
        toast({
          title: `Contacting ${contact.name}`,
          description: `${contact.relation} - ${contact.phone}`,
        });
      }, i * 2000);
    }
  };

  const cancelEmergency = () => {
    setIsEmergencyActive(false);
    setEmergencyStartTime(null);
    setContactedCount(0);
    
    toast({
      title: "Emergency alert cancelled",
      description: "All contacts will be notified that the emergency is resolved",
    });
  };

  const callContact = (contact: EmergencyContact) => {
    // In a real app, this would initiate a phone call
    window.open(`tel:${contact.phone}`);
    
    toast({
      title: `Calling ${contact.name}`,
      description: contact.relation,
    });
  };

  const shareLocation = () => {
    if (currentLocation) {
      const { latitude, longitude } = currentLocation.coords;
      const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Emergency Location',
          text: 'I need help. My current location:',
          url: locationUrl
        });
      } else {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(`Emergency Location: ${locationUrl}`);
        toast({
          title: "Location copied",
          description: "Location link copied to clipboard",
        });
      }
    }
  };

  const getElapsedTime = () => {
    if (!emergencyStartTime) return "0:00";
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - emergencyStartTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center space-x-2"
            disabled={isEmergencyActive}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>
          
          <Badge variant="outline" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Emergency System</span>
          </Badge>
        </div>

        {/* Emergency Status */}
        {isEmergencyActive && (
          <Card className="mb-8 border-destructive bg-destructive/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-6 h-6 text-destructive animate-bounce-gentle" />
                  <CardTitle className="text-destructive">EMERGENCY ACTIVE</CardTitle>
                </div>
                <Badge variant="destructive">
                  <Clock className="w-4 h-4 mr-1" />
                  {getElapsedTime()}
                </Badge>
              </div>
              <CardDescription>
                Emergency contacts are being notified. Help is on the way.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-card rounded-lg">
                <div>
                  <p className="font-medium">Contacts Notified</p>
                  <p className="text-sm text-muted-foreground">
                    {contactedCount} of {emergencyContacts.filter(c => c.available).length} contacts reached
                  </p>
                </div>
                <div className="text-2xl font-bold text-destructive">
                  {contactedCount}/{emergencyContacts.filter(c => c.available).length}
                </div>
              </div>
              
              <Button 
                onClick={cancelEmergency}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Cancel Emergency Alert
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Emergency Button */}
        {!isEmergencyActive && (
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-destructive mb-2">Emergency Alert</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Press this button only in case of real emergency. It will immediately contact 
                all your emergency contacts and share your location.
              </p>
              
              <Button
                onClick={triggerEmergency}
                size="lg"
                className="bg-gradient-emergency hover:shadow-glow text-white font-bold px-12 py-8 text-xl rounded-2xl"
              >
                🚨 EMERGENCY ALERT
              </Button>
              
              <p className="text-xs text-muted-foreground mt-4">
                Press only in case of real emergency
              </p>
            </CardContent>
          </Card>
        )}

        {/* Location Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Location Services</span>
            </CardTitle>
            <CardDescription>Current location for emergency sharing</CardDescription>
          </CardHeader>
          <CardContent>
            {currentLocation ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div>
                    <p className="font-medium text-success">Location Available</p>
                    <p className="text-sm text-muted-foreground">
                      Coordinates: {currentLocation.coords.latitude.toFixed(6)}, {currentLocation.coords.longitude.toFixed(6)}
                    </p>
                  </div>
                  <Button onClick={shareLocation} variant="outline">
                    Share Location
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div>
                  <p className="font-medium text-warning">Location Not Available</p>
                  <p className="text-sm text-muted-foreground">Please enable location services</p>
                </div>
                <Button onClick={getCurrentLocation} variant="outline">
                  Enable Location
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Emergency Contacts</CardTitle>
            <CardDescription>Your emergency contacts in order of priority</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emergencyContacts.map((contact) => (
                <div 
                  key={contact.id}
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    contact.available ? 'bg-card' : 'bg-muted opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <User className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.relation}</p>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={contact.available ? "default" : "secondary"}>
                      Priority {contact.priority}
                    </Badge>
                    
                    {contact.available && (
                      <Button
                        onClick={() => callContact(contact)}
                        size="sm"
                        variant="outline"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Medical Information</span>
            </CardTitle>
            <CardDescription>Critical medical details for emergency responders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Blood Type</h4>
                  <Badge variant="outline" className="text-base px-3 py-1">
                    {medicalInfo.bloodType}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Allergies</h4>
                  <div className="flex flex-wrap gap-2">
                    {medicalInfo.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Current Medications</h4>
                  <div className="flex flex-wrap gap-2">
                    {medicalInfo.medications.map((medication, index) => (
                      <Badge key={index} variant="secondary">
                        {medication}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Medical Conditions</h4>
                  <div className="flex flex-wrap gap-2">
                    {medicalInfo.conditions.map((condition, index) => (
                      <Badge key={index} variant="outline">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Emergency Notes</h4>
              <p className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
                {medicalInfo.emergencyNotes}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};