import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Target } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import Page from "./Page";
import * as dbService from "@/lib/db-service";
import { GoalStats } from "@/components/goals/GoalStats";
import { TrophyCollection } from "@/components/goals/TrophyCollection";
import { GoalCard } from "@/components/goals/GoalCard";
import { CompletedGoalCard } from "@/components/goals/CompletedGoalCard";
import { AddGoalModal } from "@/components/goals/AddGoalModal";
import { EditGoalModal } from "@/components/goals/EditGoalModal";
import { ContributeModal } from "@/components/goals/ContributeModal";

interface Goal {
  id: string;
  name: string;
  current: number;
  target: number;
  category: "emergency" | "savings" | "fun" | "investment" | "debt" | "other";
  targetDate?: string;
  color: string;
  isDebt?: boolean;
  originalDebt?: number;
  completedAt?: string;
  linkedCategories?: string[];
  linkedBillNames?: string[];
}

const CATEGORY_CONFIG = {
  emergency: { label: "Emergency", color: "#ef4444" },
  savings: { label: "Savings", color: "#3b82f6" },
  fun: { label: "Fun", color: "#a855f7" },
  investment: { label: "Investment", color: "#10b981" },
  debt: { label: "Debt Payoff", color: "#f97316" },
  other: { label: "Other", color: "#6b7280" },
};

export default function GoalBuckets() {
  const { currency = "$", uiMode } = useSettings();
  const isMinimalist = uiMode === "minimalist";
  const [goals, setGoals] = useState<Goal[]>([]);
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
    dbService.getAllGoals().then(data => {
      setGoals(data);
    });
  }, []);

  async function addGoal() {
    if (!name || !target) return;
    
    const config = CATEGORY_CONFIG[category];
    const isDebt = category === "debt";
    const targetNum = Number(target);
    
    const newGoal = await dbService.addGoal({
      name: name.trim(),
      current: isDebt ? targetNum : 0,
      target: isDebt ? 0 : targetNum,
      category,
      targetDate: targetDate || undefined,
      color: config.color,
      isDebt,
      originalDebt: isDebt ? targetNum : undefined,
    });
    
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
    setTarget(goal.isDebt ? String(goal.originalDebt || 0) : String(goal.target));
    setCategory(goal.category);
    setTargetDate(goal.targetDate || "");
    setLinkedCategories(goal.linkedCategories || []);
    setLinkedBillNames(goal.linkedBillNames || []);
    setShowEditModal(true);
  }

  async function updateGoal() {
    if (!selectedGoal || !name || !target) return;
    
    const config = CATEGORY_CONFIG[category];
    const isDebt = category === "debt";
    const targetNum = Number(target);
    
    await dbService.updateGoal(selectedGoal.id, {
      name: name.trim(), 
      target: isDebt ? 0 : targetNum,
      category,
      targetDate: targetDate || undefined,
      color: config.color,
      isDebt,
      originalDebt: isDebt ? targetNum : undefined,
      linkedCategories,
      linkedBillNames,
    });
    
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

  async function deleteGoal(id: string) {
    if (!confirm("Delete this goal?")) return;
    await dbService.removeGoal(id);
    setGoals(goals.filter(g => g.id !== id));
  }

  async function contribute(id: string, amount: number) {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    
    const newCurrent = goal.isDebt 
      ? goal.current - amount
      : goal.current + amount;
    
    const wasIncomplete = goal.isDebt 
      ? goal.current > 0 
      : goal.current < goal.target;
    const isNowComplete = goal.isDebt 
      ? newCurrent <= 0 
      : newCurrent >= goal.target;
    
    const updates: any = { current: Math.max(0, newCurrent) };
    
    if (wasIncomplete && isNowComplete) {
      triggerGoalConfetti();
      updates.completedAt = new Date().toISOString();
    }
    
    await dbService.updateGoal(id, updates);
    
    setGoals(goals.map(g => {
      if (g.id === id) {
        return { ...g, ...updates };
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

  const totalSaved = goals.reduce((sum, g) => {
    if (g.isDebt) return sum;
    return sum + g.current;
  }, 0);
  
  const totalTarget = goals.reduce((sum, g) => {
    if (g.isDebt) return sum + (g.originalDebt || 0);
    return sum + g.target;
  }, 0);
  
  const completedGoals = goals.filter(g => g.completedAt).length;
  
  const sortedGoals = [...goals].sort((a, b) => {
    const aComplete = !!a.completedAt;
    const bComplete = !!b.completedAt;
    
    if (aComplete && !bComplete) return 1;
    if (!aComplete && bComplete) return -1;
    if (aComplete && bComplete) {
      return new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime();
    }
    return 0;
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

        <AddGoalModal
          open={showAddModal}
          onOpenChange={setShowAddModal}
          name={name}
          setName={setName}
          target={target}
          setTarget={setTarget}
          category={category}
          setCategory={setCategory}
          targetDate={targetDate}
          setTargetDate={setTargetDate}
          currency={currency}
          onAdd={addGoal}
        />

        <EditGoalModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          name={name}
          setName={setName}
          target={target}
          setTarget={setTarget}
          category={category}
          setCategory={setCategory}
          targetDate={targetDate}
          setTargetDate={setTargetDate}
          linkedCategories={linkedCategories}
          setLinkedCategories={setLinkedCategories}
          newLinkInput={newLinkInput}
          setNewLinkInput={setNewLinkInput}
          currency={currency}
          onUpdate={updateGoal}
        />

        <ContributeModal
          open={showContributeModal}
          onOpenChange={setShowContributeModal}
          goal={selectedGoal}
          amount={contributeAmount}
          setAmount={setContributeAmount}
          currency={currency}
          onContribute={handleContribute}
        />
      </Page>
    );
  }

  return (
    <Page title="Goals" padding="md">
      <div className="mx-auto space-y-6">
        <GoalStats
          totalSaved={totalSaved}
          totalTarget={totalTarget}
          completedGoals={completedGoals}
          totalGoals={goals.length}
          currency={currency}
        />

        <TrophyCollection completedGoals={goals.filter(g => g.completedAt)} />

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
          </Dialog>
        </div>

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
            {sortedGoals.filter(g => !g.completedAt).length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sortedGoals.filter(g => !g.completedAt).map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    currency={currency}
                    categoryLabel={CATEGORY_CONFIG[goal.category].label}
                    onEdit={openEditModal}
                    onContribute={openContributeModal}
                    onDelete={deleteGoal}
                  />
                ))}
              </div>
            )}

            {sortedGoals.filter(g => g.completedAt).length > 0 && (
              <>
                <div className="flex items-center gap-3 pt-4">
                  <h3 className="text-xl font-bold text-muted-foreground">Completed Goals</h3>
                  <div className="h-px flex-1 bg-border"></div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 opacity-60">
                  {sortedGoals.filter(g => g.completedAt).map((goal) => (
                    <CompletedGoalCard
                      key={goal.id}
                      goal={goal}
                      currency={currency}
                      onDelete={deleteGoal}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        <AddGoalModal
          open={showAddModal}
          onOpenChange={setShowAddModal}
          name={name}
          setName={setName}
          target={target}
          setTarget={setTarget}
          category={category}
          setCategory={setCategory}
          targetDate={targetDate}
          setTargetDate={setTargetDate}
          currency={currency}
          onAdd={addGoal}
        />

        <EditGoalModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          name={name}
          setName={setName}
          target={target}
          setTarget={setTarget}
          category={category}
          setCategory={setCategory}
          targetDate={targetDate}
          setTargetDate={setTargetDate}
          linkedCategories={linkedCategories}
          setLinkedCategories={setLinkedCategories}
          newLinkInput={newLinkInput}
          setNewLinkInput={setNewLinkInput}
          currency={currency}
          onUpdate={updateGoal}
        />

        <ContributeModal
          open={showContributeModal}
          onOpenChange={setShowContributeModal}
          goal={selectedGoal}
          amount={contributeAmount}
          setAmount={setContributeAmount}
          currency={currency}
          onContribute={handleContribute}
        />
      </div>
    </Page>
  );
}
