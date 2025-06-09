import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HabitsData } from "@/types";
import { saveHabitsData, loadHabitsData, saveScoreData } from "@/lib/storage";
import { calculateTotalScore } from "@/lib/scoring";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Moon,
  Dumbbell,
  Apple,
  Brain,
  Zap,
} from "lucide-react";

const HabitsForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<HabitsData>({
    sleep: { hours: 7, quality: "good" },
    exercise: { frequency: 3, intensity: "moderate", duration: 30 },
    nutrition: { mealsPerDay: 3, waterGlasses: 6, fruits: 2, vegetables: 3 },
    mentalHealth: {
      stressLevel: 5,
      mindfulnessMinutes: 10,
      socialConnections: 5,
    },
    productivity: { focusHours: 4, goalsCompleted: 2, screenTimeHours: 6 },
  });

  useEffect(() => {
    // Load existing data if available
    const existingData = loadHabitsData();
    if (existingData) {
      setFormData(existingData);
    }
  }, []);

  const steps = [
    {
      title: "Sleep & Recovery",
      icon: <Moon className="w-6 h-6" />,
      description: "How well are you resting?",
      color: "blue",
    },
    {
      title: "Physical Activity",
      icon: <Dumbbell className="w-6 h-6" />,
      description: "Track your exercise habits",
      color: "green",
    },
    {
      title: "Nutrition",
      icon: <Apple className="w-6 h-6" />,
      description: "What fuels your body?",
      color: "amber",
    },
    {
      title: "Mental Wellness",
      icon: <Brain className="w-6 h-6" />,
      description: "Mind and emotional health",
      color: "purple",
    },
    {
      title: "Productivity",
      icon: <Zap className="w-6 h-6" />,
      description: "Focus and goal achievement",
      color: "rose",
    },
  ];

  const updateFormData = (
    section: keyof HabitsData,
    field: string,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const score = calculateTotalScore(formData);
    saveHabitsData(formData);
    saveScoreData(score);
    navigate("/");
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const step = steps[currentStep];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Sleep
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">
                How many hours do you typically sleep per night?
              </Label>
              <div className="px-3">
                <Slider
                  value={[formData.sleep.hours]}
                  onValueChange={(value) =>
                    updateFormData("sleep", "hours", value[0])
                  }
                  max={12}
                  min={3}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>3h</span>
                  <span className="font-medium">{formData.sleep.hours}h</span>
                  <span>12h</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">
                How would you rate your sleep quality?
              </Label>
              <RadioGroup
                value={formData.sleep.quality}
                onValueChange={(value) =>
                  updateFormData("sleep", "quality", value)
                }
                className="grid grid-cols-2 gap-3"
              >
                {[
                  { value: "poor", label: "Poor", emoji: "😴" },
                  { value: "fair", label: "Fair", emoji: "😐" },
                  { value: "good", label: "Good", emoji: "😊" },
                  { value: "excellent", label: "Excellent", emoji: "🌟" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label
                      htmlFor={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span>{option.emoji}</span>
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 1: // Exercise
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">
                How many days per week do you exercise?
              </Label>
              <div className="px-3">
                <Slider
                  value={[formData.exercise.frequency]}
                  onValueChange={(value) =>
                    updateFormData("exercise", "frequency", value[0])
                  }
                  max={7}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0 days</span>
                  <span className="font-medium">
                    {formData.exercise.frequency} days
                  </span>
                  <span>7 days</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">
                What's your typical exercise intensity?
              </Label>
              <RadioGroup
                value={formData.exercise.intensity}
                onValueChange={(value) =>
                  updateFormData("exercise", "intensity", value)
                }
                className="space-y-3"
              >
                {[
                  {
                    value: "light",
                    label: "Light",
                    desc: "Walking, gentle yoga",
                  },
                  {
                    value: "moderate",
                    label: "Moderate",
                    desc: "Jogging, cycling",
                  },
                  {
                    value: "vigorous",
                    label: "Vigorous",
                    desc: "Running, HIIT",
                  },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="cursor-pointer">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.desc}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">
                Average workout duration (minutes)
              </Label>
              <div className="px-3">
                <Slider
                  value={[formData.exercise.duration]}
                  onValueChange={(value) =>
                    updateFormData("exercise", "duration", value[0])
                  }
                  max={120}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>10 min</span>
                  <span className="font-medium">
                    {formData.exercise.duration} min
                  </span>
                  <span>120 min</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Nutrition
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">
                How many meals do you eat per day?
              </Label>
              <div className="px-3">
                <Slider
                  value={[formData.nutrition.mealsPerDay]}
                  onValueChange={(value) =>
                    updateFormData("nutrition", "mealsPerDay", value[0])
                  }
                  max={6}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1 meal</span>
                  <span className="font-medium">
                    {formData.nutrition.mealsPerDay} meals
                  </span>
                  <span>6 meals</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">
                Glasses of water per day
              </Label>
              <div className="px-3">
                <Slider
                  value={[formData.nutrition.waterGlasses]}
                  onValueChange={(value) =>
                    updateFormData("nutrition", "waterGlasses", value[0])
                  }
                  max={12}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1 glass</span>
                  <span className="font-medium">
                    {formData.nutrition.waterGlasses} glasses
                  </span>
                  <span>12 glasses</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-medium mb-3 block">
                  Fruits per day
                </Label>
                <div className="px-3">
                  <Slider
                    value={[formData.nutrition.fruits]}
                    onValueChange={(value) =>
                      updateFormData("nutrition", "fruits", value[0])
                    }
                    max={6}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-center text-sm font-medium mt-1">
                    {formData.nutrition.fruits}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">
                  Vegetables per day
                </Label>
                <div className="px-3">
                  <Slider
                    value={[formData.nutrition.vegetables]}
                    onValueChange={(value) =>
                      updateFormData("nutrition", "vegetables", value[0])
                    }
                    max={6}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-center text-sm font-medium mt-1">
                    {formData.nutrition.vegetables}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Mental Health
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">
                How would you rate your stress level? (1 = Very Low, 10 = Very
                High)
              </Label>
              <div className="px-3">
                <Slider
                  value={[formData.mentalHealth.stressLevel]}
                  onValueChange={(value) =>
                    updateFormData("mentalHealth", "stressLevel", value[0])
                  }
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>Very Low</span>
                  <span className="font-medium">
                    {formData.mentalHealth.stressLevel}/10
                  </span>
                  <span>Very High</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">
                Minutes of mindfulness/meditation per day
              </Label>
              <div className="px-3">
                <Slider
                  value={[formData.mentalHealth.mindfulnessMinutes]}
                  onValueChange={(value) =>
                    updateFormData(
                      "mentalHealth",
                      "mindfulnessMinutes",
                      value[0],
                    )
                  }
                  max={60}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0 min</span>
                  <span className="font-medium">
                    {formData.mentalHealth.mindfulnessMinutes} min
                  </span>
                  <span>60 min</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">
                Meaningful social interactions per week
              </Label>
              <div className="px-3">
                <Slider
                  value={[formData.mentalHealth.socialConnections]}
                  onValueChange={(value) =>
                    updateFormData(
                      "mentalHealth",
                      "socialConnections",
                      value[0],
                    )
                  }
                  max={15}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0</span>
                  <span className="font-medium">
                    {formData.mentalHealth.socialConnections}
                  </span>
                  <span>15+</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Productivity
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">
                Hours of focused work per day
              </Label>
              <div className="px-3">
                <Slider
                  value={[formData.productivity.focusHours]}
                  onValueChange={(value) =>
                    updateFormData("productivity", "focusHours", value[0])
                  }
                  max={12}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0h</span>
                  <span className="font-medium">
                    {formData.productivity.focusHours}h
                  </span>
                  <span>12h</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">
                Goals completed per day
              </Label>
              <div className="px-3">
                <Slider
                  value={[formData.productivity.goalsCompleted]}
                  onValueChange={(value) =>
                    updateFormData("productivity", "goalsCompleted", value[0])
                  }
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0</span>
                  <span className="font-medium">
                    {formData.productivity.goalsCompleted}
                  </span>
                  <span>10</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">
                Screen time hours per day (non-work)
              </Label>
              <div className="px-3">
                <Slider
                  value={[formData.productivity.screenTimeHours]}
                  onValueChange={(value) =>
                    updateFormData("productivity", "screenTimeHours", value[0])
                  }
                  max={12}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0h</span>
                  <span className="font-medium">
                    {formData.productivity.screenTimeHours}h
                  </span>
                  <span>12h</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Wellness Assessment
          </h1>
          <p className="text-gray-600">
            Help us understand your current habits to generate your personalized
            wellness score
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>
              Step {currentStep + 1} of {steps.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg bg-${step.color}-100 text-${step.color}-600`}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <div className="text-xl">{step.title}</div>
                    <div className="text-sm font-normal text-gray-600">
                      {step.description}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">{renderStepContent()}</CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-between"
        >
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button onClick={handleNext} className="flex items-center gap-2">
            {currentStep === steps.length - 1 ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Complete Assessment
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default HabitsForm;
