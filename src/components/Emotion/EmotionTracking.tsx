import { useState, useRef, useEffect } from "react";
import { Camera, Smile, Frown, Meh, Heart, ArrowLeft, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface EmotionTrackingProps {
  onBack: () => void;
}

interface EmotionReading {
  emotion: string;
  confidence: number;
  timestamp: Date;
  icon: React.ReactNode;
  color: string;
}

const emotions = [
  { name: "Happy", icon: <Smile className="w-6 h-6" />, color: "text-success" },
  { name: "Neutral", icon: <Meh className="w-6 h-6" />, color: "text-muted-foreground" },
  { name: "Sad", icon: <Frown className="w-6 h-6" />, color: "text-primary" },
  { name: "Anxious", icon: <Heart className="w-6 h-6" />, color: "text-warning" },
];

export const EmotionTracking = ({ onBack }: EmotionTrackingProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionReading | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionReading[]>([]);
  const [weeklyAverage, setWeeklyAverage] = useState(7.2);
  const [cameraPermission, setCameraPermission] = useState<PermissionState | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkCameraPermission();
    
    // Simulate loading recent emotion history
    const mockHistory: EmotionReading[] = [
      {
        emotion: "Happy",
        confidence: 85,
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        icon: <Smile className="w-4 h-4" />,
        color: "text-success"
      },
      {
        emotion: "Neutral", 
        confidence: 75,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        icon: <Meh className="w-4 h-4" />,
        color: "text-muted-foreground"
      },
      {
        emotion: "Happy",
        confidence: 92,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        icon: <Smile className="w-4 h-4" />,
        color: "text-success"
      }
    ];
    setEmotionHistory(mockHistory);
  }, []);

  const checkCameraPermission = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setCameraPermission(permission.state);
    } catch (error) {
      console.log('Camera permission check not supported');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      
      setCameraPermission('granted');
      toast({
        title: "Camera started",
        description: "Position your face in the camera for emotion analysis",
      });
    } catch (error) {
      console.error('Error starting camera:', error);
      setCameraPermission('denied');
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use emotion recognition",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const analyzeEmotion = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsAnalyzing(true);
    
    // Simulate emotion analysis (in real implementation, this would use TensorFlow.js or similar)
    setTimeout(() => {
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const confidence = Math.floor(Math.random() * 30) + 70; // 70-100% confidence
      
      const newReading: EmotionReading = {
        emotion: randomEmotion.name,
        confidence,
        timestamp: new Date(),
        icon: randomEmotion.icon,
        color: randomEmotion.color
      };
      
      setCurrentEmotion(newReading);
      setEmotionHistory(prev => [newReading, ...prev.slice(0, 9)]); // Keep last 10 readings
      setIsAnalyzing(false);
      
      // Provide feedback based on emotion
      if (newReading.emotion === 'Sad' || newReading.emotion === 'Anxious') {
        toast({
          title: "We notice you might need support",
          description: "Consider trying our breathing exercises or reaching out to a support contact",
          variant: "destructive"
        });
      } else if (newReading.emotion === 'Happy') {
        toast({
          title: "Great to see you happy! 😊",
          description: "Keep up the positive energy!",
        });
      }
    }, 2000);
  };

  const manualEmotionLog = (emotionName: string) => {
    const selectedEmotion = emotions.find(e => e.name === emotionName);
    if (!selectedEmotion) return;

    const newReading: EmotionReading = {
      emotion: emotionName,
      confidence: 100, // Manual entries are 100% confidence
      timestamp: new Date(),
      icon: selectedEmotion.icon,
      color: selectedEmotion.color
    };

    setCurrentEmotion(newReading);
    setEmotionHistory(prev => [newReading, ...prev.slice(0, 9)]);
    
    toast({
      title: "Emotion logged",
      description: `Your ${emotionName.toLowerCase()} mood has been recorded`,
    });
  };

  const getEmotionScore = (emotion: string) => {
    const scores = { Happy: 9, Neutral: 6, Sad: 3, Anxious: 4 };
    return scores[emotion as keyof typeof scores] || 5;
  };

  const calculateTrend = () => {
    if (emotionHistory.length < 2) return 0;
    const recent = emotionHistory.slice(0, 3);
    const older = emotionHistory.slice(3, 6);
    
    const recentAvg = recent.reduce((sum, reading) => sum + getEmotionScore(reading.emotion), 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((sum, reading) => sum + getEmotionScore(reading.emotion), 0) / older.length : recentAvg;
    
    return recentAvg - olderAvg;
  };

  const trend = calculateTrend();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>
          
          <Badge variant="outline" className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Emotional Wellness</span>
          </Badge>
        </div>

        {/* Weekly Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{weeklyAverage}</div>
              <p className="text-sm text-muted-foreground">Weekly Average</p>
              <p className="text-xs text-muted-foreground mt-1">Out of 10</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className={`text-3xl font-bold mb-2 ${trend > 0 ? 'text-success' : trend < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {trend > 0 ? '+' : ''}{trend.toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground">Mood Trend</p>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp className={`w-4 h-4 ${trend > 0 ? 'text-success' : 'text-muted-foreground'}`} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-secondary mb-2">{emotionHistory.length}</div>
              <p className="text-sm text-muted-foreground">Entries Today</p>
              <p className="text-xs text-muted-foreground mt-1">Keep tracking!</p>
            </CardContent>
          </Card>
        </div>

        {/* Emotion Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Real-time Emotion Analysis</CardTitle>
            <CardDescription>Use your camera to detect your current emotional state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Camera Feed */}
            <div className="relative bg-muted rounded-lg overflow-hidden aspect-video max-w-md mx-auto">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ display: 'none' }}
              />
              
              {!streamRef.current && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Camera not started</p>
                  </div>
                </div>
              )}
            </div>

            {/* Camera Controls */}
            <div className="flex justify-center space-x-4">
              {!streamRef.current ? (
                <Button onClick={startCamera} size="lg">
                  <Camera className="w-4 h-4 mr-2" />
                  Start Camera
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={analyzeEmotion} 
                    disabled={isAnalyzing}
                    size="lg"
                    className="bg-gradient-secondary"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Emotion'}
                  </Button>
                  <Button onClick={stopCamera} variant="outline">
                    Stop Camera
                  </Button>
                </>
              )}
            </div>

            {/* Current Emotion Result */}
            {currentEmotion && (
              <div className="p-6 border rounded-lg bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={currentEmotion.color}>
                      {currentEmotion.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{currentEmotion.emotion}</h3>
                      <p className="text-sm text-muted-foreground">
                        Confidence: {currentEmotion.confidence}%
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {currentEmotion.timestamp.toLocaleTimeString()}
                  </Badge>
                </div>
                <Progress value={currentEmotion.confidence} className="mt-4" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Emotion Logging */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Mood Check</CardTitle>
            <CardDescription>Manually log how you're feeling right now</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {emotions.map((emotion) => (
                <Button
                  key={emotion.name}
                  variant="outline"
                  onClick={() => manualEmotionLog(emotion.name)}
                  className="flex flex-col items-center space-y-2 h-20 hover:border-primary"
                >
                  <div className={emotion.color}>
                    {emotion.icon}
                  </div>
                  <span className="text-sm">{emotion.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emotion History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Emotion History</CardTitle>
            <CardDescription>Track your emotional patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emotionHistory.map((reading, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={reading.color}>
                      {reading.icon}
                    </div>
                    <div>
                      <p className="font-medium">{reading.emotion}</p>
                      <p className="text-sm text-muted-foreground">
                        {reading.confidence}% confidence
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {reading.timestamp.toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {reading.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {emotionHistory.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4" />
                  <p>No emotion data recorded yet</p>
                  <p className="text-sm">Start by using the camera or manual logging above</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};