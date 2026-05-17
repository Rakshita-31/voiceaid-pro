import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, RotateCcw, Award, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface SpeechTherapyProps {
  onBack: () => void;
}

interface Exercise {
  id: string;
  text: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
}

const exercises: Exercise[] = [
  {
    id: "1",
    text: "The quick brown fox jumps over the lazy dog",
    difficulty: "beginner",
    category: "Pronunciation"
  },
  {
    id: "2", 
    text: "She sells seashells by the seashore",
    difficulty: "intermediate",
    category: "Tongue Twisters"
  },
  {
    id: "3",
    text: "Peter Piper picked a peck of pickled peppers",
    difficulty: "advanced",
    category: "Advanced Practice"
  }
];

export const SpeechTherapy = ({ onBack }: SpeechTherapyProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [accuracy, setAccuracy] = useState(0);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [completedExercises, setCompletedExercises] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const result = event.results[event.results.length - 1];
        if (result.isFinal) {
          setTranscript(result[0].transcript);
          calculateAccuracy(result[0].transcript, exercises[currentExercise].text);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Speech Recognition Error",
          description: "Please check your microphone permissions and try again.",
          variant: "destructive"
        });
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentExercise, toast]);

  const calculateAccuracy = (spoken: string, target: string) => {
    const spokenWords = spoken.toLowerCase().split(' ');
    const targetWords = target.toLowerCase().split(' ');
    const matches = spokenWords.filter(word => targetWords.includes(word));
    const accuracy = Math.round((matches.length / targetWords.length) * 100);
    setAccuracy(accuracy);
    
    if (accuracy > 70) {
      toast({
        title: "Great job! 🎉",
        description: `You achieved ${accuracy}% accuracy!`,
        variant: "default"
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setTranscript("");
      setAccuracy(0);

      // Start audio recording
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.start();

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      toast({
        title: "Recording started",
        description: "Speak clearly and try to match the text displayed",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Microphone Error",
        description: "Please allow microphone access to use speech therapy features.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    setIsRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Update session progress
    const newProgress = Math.min(sessionProgress + 25, 100);
    setSessionProgress(newProgress);
    
    if (accuracy > 70) {
      setCompletedExercises(prev => prev + 1);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setTranscript("");
      setAccuracy(0);
    }
  };

  const resetExercise = () => {
    setTranscript("");
    setAccuracy(0);
  };

  const exercise = exercises[currentExercise];
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-success";
      case "intermediate": return "bg-warning";
      case "advanced": return "bg-destructive";
      default: return "bg-muted";
    }
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
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>{completedExercises} exercises completed</span>
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Session Progress</CardTitle>
            <CardDescription>Keep practicing to improve your speech clarity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Session</span>
                <span>{sessionProgress}%</span>
              </div>
              <Progress value={sessionProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Exercise Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>Exercise {currentExercise + 1} of {exercises.length}</span>
                  <Badge className={getDifficultyColor(exercise.difficulty)}>
                    {exercise.difficulty}
                  </Badge>
                </CardTitle>
                <CardDescription>{exercise.category}</CardDescription>
              </div>
              <Button variant="outline" onClick={resetExercise}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Target Text */}
            <div className="p-6 bg-muted rounded-lg">
              <p className="text-lg font-medium text-center">{exercise.text}</p>
            </div>

            {/* Recording Controls */}
            <div className="flex justify-center">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  size="lg"
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-8 py-6"
                >
                  <Mic className="w-6 h-6 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  size="lg"
                  variant="destructive"
                  className="animate-pulse-soft px-8 py-6"
                >
                  <Square className="w-6 h-6 mr-2" />
                  Stop Recording
                </Button>
              )}
            </div>

            {/* Transcript */}
            {transcript && (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">What you said:</h4>
                  <p className="text-muted-foreground">{transcript}</p>
                </div>

                {accuracy > 0 && (
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium">Accuracy Score</h4>
                      <p className="text-sm text-muted-foreground">Based on word matching</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${accuracy > 70 ? 'text-success' : accuracy > 50 ? 'text-warning' : 'text-destructive'}`}>
                        {accuracy}%
                      </div>
                      {accuracy > 70 && <p className="text-sm text-success">Excellent!</p>}
                    </div>
                  </div>
                )}

                {accuracy > 70 && currentExercise < exercises.length - 1 && (
                  <Button onClick={nextExercise} className="w-full" size="lg">
                    Next Exercise
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exercise List */}
        <Card>
          <CardHeader>
            <CardTitle>All Exercises</CardTitle>
            <CardDescription>Practice different types of speech patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exercises.map((ex, index) => (
                <div 
                  key={ex.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    index === currentExercise ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                  }`}
                  onClick={() => setCurrentExercise(index)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{ex.category}</p>
                      <p className="text-sm text-muted-foreground truncate">{ex.text}</p>
                    </div>
                    <Badge className={getDifficultyColor(ex.difficulty)}>
                      {ex.difficulty}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};