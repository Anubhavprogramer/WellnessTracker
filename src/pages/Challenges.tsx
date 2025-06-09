import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Challenge, UserChallenge } from "@/types";
import { availableChallenges, getChallengeById } from "@/lib/challenges";
import { loadUserChallenges, saveUserChallenges } from "@/lib/storage";
import ChallengeCard from "@/components/ChallengeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Search,
  Filter,
  Trophy,
  Users,
  Clock,
  Target,
} from "lucide-react";

const Challenges = () => {
  const navigate = useNavigate();
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("browse");

  useEffect(() => {
    const challenges = loadUserChallenges();
    setUserChallenges(challenges);
  }, []);

  const joinChallenge = (challengeId: string) => {
    const newUserChallenge: UserChallenge = {
      challengeId,
      startDate: new Date(),
      progress: [],
      completed: false,
      streak: 0,
    };

    const updatedChallenges = [...userChallenges, newUserChallenge];
    setUserChallenges(updatedChallenges);
    saveUserChallenges(updatedChallenges);

    // Navigate to challenge detail
    navigate(`/challenge/${challengeId}`);
  };

  const filteredChallenges = availableChallenges.filter((challenge) => {
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDifficulty =
      difficultyFilter === "all" || challenge.difficulty === difficultyFilter;

    const matchesCategory =
      categoryFilter === "all" || challenge.category === categoryFilter;

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const myChallenges = userChallenges
    .map((uc) => ({
      userChallenge: uc,
      challenge: getChallengeById(uc.challengeId),
    }))
    .filter((item) => item.challenge);

  const activeChallenges = myChallenges.filter(
    (item) => !item.userChallenge.completed,
  );
  const completedChallenges = myChallenges.filter(
    (item) => item.userChallenge.completed,
  );

  const stats = {
    totalChallenges: availableChallenges.length,
    activeChallenges: activeChallenges.length,
    completedChallenges: completedChallenges.length,
    totalParticipants: availableChallenges.reduce(
      (sum, c) => sum + c.participants,
      0,
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-purple-600" />
                <span className="text-xl font-bold text-gray-900">
                  Challenges
                </span>
              </div>
            </div>
            <Link
              to="/profile"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Profile
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.totalChallenges}
              </div>
              <div className="text-sm text-gray-600">Available</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.activeChallenges}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {stats.completedChallenges}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">
                {stats.totalParticipants.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Participants</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Challenges</TabsTrigger>
            <TabsTrigger value="active">
              My Active ({activeChallenges.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedChallenges.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg border"
            >
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search challenges..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select
                value={difficultyFilter}
                onValueChange={setDifficultyFilter}
              >
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="hydration">Hydration</SelectItem>
                  <SelectItem value="exercise">Exercise</SelectItem>
                  <SelectItem value="mindfulness">Mindfulness</SelectItem>
                  <SelectItem value="productivity">Productivity</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Challenge Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge, index) => {
                const isJoined = userChallenges.some(
                  (uc) => uc.challengeId === challenge.id,
                );
                const userChallenge = userChallenges.find(
                  (uc) => uc.challengeId === challenge.id,
                );

                return (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ChallengeCard
                      challenge={challenge}
                      userChallenge={userChallenge}
                      onJoinChallenge={isJoined ? undefined : joinChallenge}
                      onViewChallenge={(id) => navigate(`/challenge/${id}`)}
                    />
                  </motion.div>
                );
              })}
            </div>

            {filteredChallenges.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No challenges found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            {activeChallenges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeChallenges.map(({ challenge, userChallenge }, index) => (
                  <motion.div
                    key={challenge!.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ChallengeCard
                      challenge={challenge!}
                      userChallenge={userChallenge}
                      onViewChallenge={(id) => navigate(`/challenge/${id}`)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No active challenges
                </h3>
                <p className="text-gray-600 mb-4">
                  Browse available challenges to start your wellness journey
                </p>
                <Button onClick={() => setActiveTab("browse")}>
                  Browse Challenges
                </Button>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedChallenges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedChallenges.map(
                  ({ challenge, userChallenge }, index) => (
                    <motion.div
                      key={challenge!.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ChallengeCard
                        challenge={challenge!}
                        userChallenge={userChallenge}
                        onViewChallenge={(id) => navigate(`/challenge/${id}`)}
                      />
                    </motion.div>
                  ),
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No completed challenges yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Complete some challenges to earn badges and see them here
                </p>
                <Button onClick={() => setActiveTab("browse")}>
                  Browse Challenges
                </Button>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Challenges;
