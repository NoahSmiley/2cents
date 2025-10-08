import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, TrendingUp, TrendingDown, Target, Calendar, Trash2, Edit, Trophy, Award } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { NumberTicker } from "@/components/ui/number-ticker";
import { CategorySelector } from "@/components/goals/CategorySelector";
import Page from "./Page";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  name: string;
  current: number;
  target: number;
  category: "emergency" | "savings" | "fun" | "investment" | "debt" | "other";
  targetDate?: string;
  color: string;
  isDebt?: boolean;
  originalDebt?: number; // For debt goals: track starting amount
  completedAt?: string; // ISO date when goal was completed
  linkedCategories?: string[]; // Transaction categories that auto-contribute
  linkedBillNames?: string[]; // Recurring bill names that auto-contribute
}

const STORAGE_KEY = "twocents-goals";

const CATEGORY_CONFIG = {
  emergency: { label: "Emergency", color: "#ef4444" },
  savings: { label: "Savings", color: "#3b82f6" },
  fun: { label: "Fun", color: "#a855f7" },
  investment: { label: "Investment", color: "#10b981" },
  debt: { label: "Debt Payoff", color: "#f97316" },
  other: { label: "Other", color: "#6b7280" },
};

function loadGoals(): Goal[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}
function saveGoals(goals: Goal[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

export default function GoalBuckets() {
  const { currency = "$", uiMode } = useSettings();
  const isMinimalist = uiMode === "minimalist";
  const [goals, setGoals] = useState<Goal[]>(() => loadGoals());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  
  // Form states
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [category, setCategory] = useState<Goal["category"]>("savings");
  const [targetDate, setTargetDate] = useState("");
  const [contributeAmount, setContributeAmount] = useState("");
  const [linkedCategories, setLinkedCategories] = useState<string[]>([]);
  const [linkedBillNames, setLinkedBillNames] = useState<string[]>([]);
  const [newLinkInput, setNewLinkInput] = useState("");

  useEffect(() => {
    saveGoals(goals);
  }, [goals]);

  function addGoal() {
    if (!name || !target) return;
    
    const config = CATEGORY_CONFIG[category];
    const isDebt = category === "debt";
    const targetNum = Number(target);
    
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      name: name.trim(),
      current: isDebt ? targetNum : 0,        // Debt: starts at debt amount
      target: isDebt ? 0 : targetNum,         // Debt: target is $0
      category,
      targetDate: targetDate || undefined,
      color: config.color,
      isDebt,
      originalDebt: isDebt ? targetNum : undefined, // Store original debt amount
    };
    
    setGoals([...goals, newGoal]);
    setName("");
    setTarget("");
    setCategory("savings");
    setTargetDate("");
    setShowAddModal(false);
  }

  function openEditModal(goal: Goal) {
    setSelectedGoal(goal);
    setName(goal.name);
    // For debt, show original debt amount; for savings, show target
    setTarget(goal.isDebt ? String(goal.originalDebt || 0) : String(goal.target));
    setCategory(goal.category);
    setTargetDate(goal.targetDate || "");
    setLinkedCategories(goal.linkedCategories || []);
    setLinkedBillNames(goal.linkedBillNames || []);
    setShowEditModal(true);
  }

  function updateGoal() {
    if (!selectedGoal || !name || !target) return;
    
    const config = CATEGORY_CONFIG[category];
    const isDebt = category === "debt";
    const targetNum = Number(target);
    
    setGoals(goals.map(g => 
      g.id === selectedGoal.id 
        ? { 
            ...g, 
            name: name.trim(), 
            target: isDebt ? 0 : targetNum,
            category,
            targetDate: targetDate || undefined,
            color: config.color,
            isDebt,
            originalDebt: isDebt ? targetNum : undefined,
            linkedCategories,
            linkedBillNames,
          }
        : g
    ));
    
    setName("");
    setTarget("");
    setCategory("savings");
    setTargetDate("");
    setLinkedCategories([]);
    setLinkedBillNames([]);
    setSelectedGoal(null);
    setShowEditModal(false);
  }

  function deleteGoal(id: string) {
    if (!confirm("Delete this goal?")) return;
    setGoals(goals.filter(g => g.id !== id));
  }

  function contribute(id: string, amount: number) {
    setGoals(goals.map(g => {
      if (g.id === id) {
        // For debt: paying down decreases current (opposite of savings)
        const newCurrent = g.isDebt 
          ? g.current - amount  // Debt: subtract payment
          : g.current + amount; // Savings: add contribution
        
        // Check if goal just reached
        const wasIncomplete = g.isDebt 
          ? g.current > 0 
          : g.current < g.target;
        const isNowComplete = g.isDebt 
          ? newCurrent <= 0 
          : newCurrent >= g.target;
        
        if (wasIncomplete && isNowComplete) {
          triggerGoalConfetti();
          // Mark completion date
          return { 
            ...g, 
            current: Math.max(0, newCurrent),
            completedAt: new Date().toISOString(),
          };
        }
        
        return { ...g, current: Math.max(0, newCurrent) };
      }
      return g;
    }));
  }

  function triggerGoalConfetti() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }

  function openContributeModal(goal: Goal) {
    setSelectedGoal(goal);
    setContributeAmount("");
    setShowContributeModal(true);
  }

  function handleContribute(isWithdraw: boolean = false) {
    if (!selectedGoal || !contributeAmount) return;
    const amount = Number(contributeAmount);
    if (!Number.isFinite(amount) || amount <= 0) return;
    
    contribute(selectedGoal.id, isWithdraw ? -amount : amount);
    setShowContributeModal(false);
    setSelectedGoal(null);
    setContributeAmount("");
  }

  // Total saved: only count savings goals (not debt)
  const totalSaved = goals.reduce((sum, g) => {
    if (g.isDebt) return sum; // Don't count debt balances
    return sum + g.current;
  }, 0);
  
  // Total target: savings targets + debt amounts to pay off
  const totalTarget = goals.reduce((sum, g) => {
    if (g.isDebt) return sum + (g.originalDebt || 0); // Add original debt amount
    return sum + g.target;
  }, 0);
  
  const completedGoals = goals.filter(g => g.completedAt).length;
  
  // Sort: Active goals first, then completed goals (by completion date)
  const sortedGoals = [...goals].sort((a, b) => {
    const aComplete = !!a.completedAt;
    const bComplete = !!b.completedAt;
    
    if (aComplete && !bComplete) return 1;  // a complete, b active -> b first
    if (!aComplete && bComplete) return -1; // a active, b complete -> a first
    if (aComplete && bComplete) {
      // Both complete: sort by completion date (newest first)
      return new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime();
    }
    return 0; // Both active: keep original order
  });

  if (isMinimalist) {
    return (
      <Page title="Goals" padding="md">
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm">
              <span className="font-medium">{goals.filter(g => !g.completedAt).length}</span> active • <span className="font-medium">{completedGoals}</span> completed
            </div>
            <Button size="sm" onClick={() => setShowAddModal(true)}>
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>

          {sortedGoals.map((goal) => {
            const progress = goal.isDebt 
              ? ((goal.originalDebt! - goal.current) / goal.originalDebt!) * 100
              : (goal.current / goal.target) * 100;

            return (
              <div key={goal.id} className="border rounded p-2 text-sm">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{goal.name}</div>
                    <div className="text-xs text-muted-foreground">{CATEGORY_CONFIG[goal.category].label}</div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openContributeModal(goal)} className="h-6 px-2 text-xs">+</Button>
                    <Button size="sm" variant="ghost" onClick={() => openEditModal(goal)} className="h-6 px-2 text-xs">Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteGoal(goal.id)} className="h-6 px-2 text-xs">×</Button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono">
                    {currency}{goal.current.toFixed(0)} / {currency}{goal.target.toFixed(0)}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* All Modals - Same functionality, simpler styling */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base">Create Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              <div>
                <Label className="text-xs">Name</Label>
                <Input
                  placeholder="Emergency Fund"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Target</Label>
                <Input
                  type="number"
                  placeholder="5000"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Category</Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Goal["category"])}
                  className="w-full h-8 text-sm rounded border bg-background px-2"
                >
                  {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
              <Button onClick={addGoal} className="w-full h-8 text-sm">Create</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base">Edit Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              <div>
                <Label className="text-xs">Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Target</Label>
                <Input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <Button onClick={updateGoal} className="w-full h-8 text-sm">Save</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showContributeModal} onOpenChange={setShowContributeModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base">Contribute to {selectedGoal?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              <div>
                <Label className="text-xs">Amount</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={contributeAmount}
                  onChange={(e) => setContributeAmount(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleContribute(false)} className="flex-1 h-8 text-sm">Add</Button>
                <Button onClick={() => handleContribute(true)} variant="outline" className="flex-1 h-8 text-sm">Withdraw</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Page>
    );
  }

  return (
    <Page title="Goals" padding="md">
      <div className=" mx-auto space-y-6">
        {/* Header Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currency}<NumberTicker value={totalSaved} decimalPlaces={2} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Target</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currency}<NumberTicker value={totalTarget} decimalPlaces={2} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedGoals} / {goals.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trophy Collection */}
        {completedGoals > 0 && (
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-600" />
                Trophy Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="flex gap-2">
                  {goals.filter(g => g.completedAt).slice(0, 10).map((goal) => (
                    <div
                      key={goal.id}
                      className="relative group"
                      title={`${goal.name} - Completed ${new Date(goal.completedAt!).toLocaleDateString()}`}
                    >
                      <Trophy 
                        className="h-12 w-12 text-amber-500 hover:text-amber-600 transition-all hover:scale-110" 
                        fill="currentColor"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full h-4 w-4 flex items-center justify-center">
                        <Award className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <div className="font-semibold text-lg text-amber-600">{completedGoals} Goals Completed!</div>
                  <div>Keep up the amazing work! You're doing great!</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Goal Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {sortedGoals.filter(g => !g.completedAt).length > 0 ? "Active Goals" : "Your Goals"}
          </h2>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Select Category</Label>
                  <CategorySelector 
                    value={category} 
                    onChange={(val) => setCategory(val)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Goal Name</Label>
                  <Input
                    placeholder={category === "debt" ? "e.g., Student Loan" : "e.g., Emergency Fund"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{category === "debt" ? "Current Debt Amount" : "Target Amount"}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {currency}
                    </span>
                    <Input
                      type="number"
                      placeholder={category === "debt" ? "25000" : "5000"}
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  {category === "debt" && (
                    <p className="text-xs text-muted-foreground">
                      Enter your current debt balance. Goal is to pay it down to $0.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Target Date (Optional)</Label>
                  <Input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />
                </div>
                <Button onClick={addGoal} className="w-full text-white bg-emerald-600 hover:bg-emerald-700">
                  Create Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <Target className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
                <p className="text-muted-foreground">
                  Create your first savings goal to start tracking your progress
                </p>
              </div>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Goal
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Active Goals */}
            {sortedGoals.filter(g => !g.completedAt).length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sortedGoals.filter(g => !g.completedAt).map((goal) => {
              // For debt: progress = (originalDebt - current) / originalDebt * 100
              // For savings: progress = current / target * 100
              let percentage = 0;
              let displayAmount = "";
              
              if (goal.isDebt && goal.originalDebt) {
                const paidOff = goal.originalDebt - goal.current;
                percentage = Math.min(100, Math.max(0, (paidOff / goal.originalDebt) * 100));
                displayAmount = `${currency}${paidOff.toFixed(0)}`; // Show amount paid off
              } else {
                percentage = Math.min(100, (goal.current / goal.target) * 100);
                displayAmount = `${currency}${goal.current.toFixed(0)}`; // Show current amount
              }
              
              // Dynamic color based on progress
              let progressColor = goal.color;
              if (percentage < 25) {
                progressColor = "#ef4444"; // Red - just started
              } else if (percentage < 50) {
                progressColor = "#f97316"; // Orange - making progress
              } else if (percentage < 75) {
                progressColor = "#eab308"; // Yellow - halfway there
              } else if (percentage < 100) {
                progressColor = "#10b981"; // Green - almost done
              } else {
                progressColor = "#059669"; // Dark green - complete!
              }
              
              const isComplete = goal.isDebt 
                ? goal.current <= 0 
                : goal.current >= goal.target;
              
              const remaining = goal.isDebt 
                ? goal.current 
                : goal.target - goal.current;
              
              return (
                <Card key={goal.id} className={cn(
                  "relative overflow-hidden transition-all hover:shadow-lg",
                  isComplete && "ring-2 ring-emerald-500"
                )}>
                  {isComplete && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      ✓ Complete
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{goal.name}</CardTitle>
                        <div className="text-xs text-muted-foreground mt-1">
                          {CATEGORY_CONFIG[goal.category].label}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => openEditModal(goal)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Circular Progress */}
                    <div className="flex justify-center">
                      <AnimatedCircularProgressBar
                        max={100}
                        min={0}
                        value={percentage}
                        gaugePrimaryColor={progressColor}
                        gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
                        className="w-32 h-32"
                        displayValue={displayAmount}
                      />
                    </div>
                    
                    {/* Amounts */}
                    <div className="space-y-2">
                      {goal.isDebt ? (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Original Debt</span>
                            <span className="font-semibold">{currency}{(goal.originalDebt || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Paid Off</span>
                            <span className="font-semibold text-emerald-600">
                              {currency}{((goal.originalDebt || 0) - goal.current).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Remaining</span>
                            <span className="font-semibold text-orange-600">{currency}{goal.current.toFixed(2)}</span>
                          </div>
                          {/* Debt Payoff Timeline */}
                          {goal.current > 0 && goal.originalDebt && (
                            <div className="pt-2 border-t">
                              <div className="text-xs text-muted-foreground">
                                {(() => {
                                  const paidOff = (goal.originalDebt || 0) - goal.current;
                                  const monthsElapsed = 1; // Simplified - could track actual time
                                  const avgPayment = paidOff / monthsElapsed;
                                  
                                  if (avgPayment > 0) {
                                    const monthsRemaining = Math.ceil(goal.current / avgPayment);
                                    const payoffDate = new Date();
                                    payoffDate.setMonth(payoffDate.getMonth() + monthsRemaining);
                                    
                                    return (
                                      <div>
                                        <div className="font-medium text-blue-600">Payoff Timeline</div>
                                        <div>At current rate: {payoffDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                                        <div className="text-xs">~{monthsRemaining} months ({currency}{avgPayment.toFixed(0)}/mo)</div>
                                      </div>
                                    );
                                  }
                                  return <div className="text-xs">Make payments to see timeline</div>;
                                })()}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Current</span>
                            <span className="font-semibold">{currency}{goal.current.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Target</span>
                            <span className="font-semibold">{currency}{goal.target.toFixed(2)}</span>
                          </div>
                          {!isComplete && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Remaining</span>
                              <span className="font-semibold text-amber-600">{currency}{remaining.toFixed(2)}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* Target Date */}
                    {goal.targetDate && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {/* Linked Items */}
                    {(goal.linkedCategories?.length || goal.linkedBillNames?.length) ? (
                      <div className="text-xs space-y-1">
                        <div className="font-medium text-muted-foreground">Auto-linked:</div>
                        {goal.linkedCategories?.map((cat) => (
                          <div key={cat} className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded mr-1">
                            📊 {cat}
                          </div>
                        ))}
                        {goal.linkedBillNames?.map((bill) => (
                          <div key={bill} className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded mr-1">
                            🔄 {bill}
                          </div>
                        ))}
                      </div>
                    ) : null}
                    
                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => openContributeModal(goal)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {goal.isDebt ? "Pay Down" : "Add"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedGoal(goal);
                          setContributeAmount("");
                          setShowContributeModal(true);
                        }}
                      >
                        <TrendingDown className="h-4 w-4 mr-1" />
                        {goal.isDebt ? "Increase" : "Withdraw"}
                      </Button>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteGoal(goal.id)}
                      className="w-full text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete Goal
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
              </div>
            )}

            {/* Completed Goals */}
            {sortedGoals.filter(g => g.completedAt).length > 0 && (
              <>
                <div className="flex items-center gap-3 pt-4">
                  <h3 className="text-xl font-bold text-muted-foreground">Completed Goals</h3>
                  <div className="h-px flex-1 bg-border"></div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 opacity-60">
                  {sortedGoals.filter(g => g.completedAt).map((goal) => {
                    const displayAmount = goal.isDebt 
                      ? `${currency}${(goal.originalDebt || 0).toFixed(0)}`
                      : `${currency}${goal.current.toFixed(0)}`;
                    
                    return (
                      <Card key={goal.id} className="relative overflow-hidden ring-2 ring-emerald-500/50">
                        <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                          <Trophy className="h-3 w-3" fill="currentColor" />
                          Complete
                        </div>
                        
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{goal.name}</CardTitle>
                              <div className="text-xs text-muted-foreground mt-1">
                                Completed {new Date(goal.completedAt!).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="flex justify-center">
                            <AnimatedCircularProgressBar
                              max={100}
                              min={0}
                              value={100}
                              gaugePrimaryColor="#059669"
                              gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
                              className="w-32 h-32"
                              displayValue={displayAmount}
                            />
                          </div>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteGoal(goal.id)}
                            className="w-full text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete Goal
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {/* Edit Goal Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Goal Name</Label>
                <Input
                  placeholder="e.g., Emergency Fund"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Target Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {currency}
                  </span>
                  <Input
                    type="number"
                    placeholder="5000"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Select Category</Label>
                <CategorySelector 
                  value={category} 
                  onChange={(val) => setCategory(val)}
                />
              </div>
              <div className="space-y-2">
                <Label>Target Date (Optional)</Label>
                <Input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
              </div>
              
              {/* Linked Items */}
              <div className="space-y-2 pt-2 border-t">
                <Label>Link to Transactions/Bills</Label>
                <p className="text-xs text-muted-foreground">
                  Link transaction categories or recurring bill names to auto-contribute
                </p>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Student Loan or Groceries"
                    value={newLinkInput}
                    onChange={(e) => setNewLinkInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newLinkInput.trim()) {
                        e.preventDefault();
                        const input = newLinkInput.trim();
                        if (!linkedCategories.includes(input)) {
                          setLinkedCategories([...linkedCategories, input]);
                        }
                        setNewLinkInput("");
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      if (newLinkInput.trim()) {
                        const input = newLinkInput.trim();
                        if (!linkedCategories.includes(input)) {
                          setLinkedCategories([...linkedCategories, input]);
                        }
                        setNewLinkInput("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                
                {/* Show linked items */}
                {linkedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {linkedCategories.map((cat) => (
                      <div key={cat} className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs">
                        {cat}
                        <button
                          onClick={() => setLinkedCategories(linkedCategories.filter(c => c !== cat))}
                          className="hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Button onClick={updateGoal} className="w-full text-white">
                Update Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Contribute/Withdraw Modal */}
        <Dialog open={showContributeModal} onOpenChange={setShowContributeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedGoal?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {currency}
                  </span>
                  <Input
                    type="number"
                    placeholder="100"
                    value={contributeAmount}
                    onChange={(e) => setContributeAmount(e.target.value)}
                    className="pl-8"
                    autoFocus
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleContribute(false)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {selectedGoal?.isDebt ? "Pay Down" : "Add Money"}
                </Button>
                <Button
                  onClick={() => handleContribute(true)}
                  variant="outline"
                  className="text-amber-600 hover:text-amber-700"
                >
                  <TrendingDown className="h-4 w-4 mr-2" />
                  {selectedGoal?.isDebt ? "Increase Debt" : "Withdraw"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Page>
  );
}
