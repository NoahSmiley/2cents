// src/pages/Help.tsx
import Page from "./Page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Wallet, 
  List, 
  Repeat, 
  Target, 
  Settings, 
  Plus,
  TrendingUp,
  PiggyBank,
  Calendar,
  DollarSign,
  BarChart3,
  Users,
  Lock,
  Palette,
  Download,
  Upload
} from "lucide-react";

export default function Help() {
  return (
    <Page title="Help & Documentation" className="max-w-5xl mx-auto">
      <div className="space-y-6">
        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Welcome to 2Cents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              2Cents is your personal finance companion designed to help you track spending, 
              manage budgets, set financial goals, and gain insights into your money habits. 
              This guide will walk you through all the features and how to use them effectively.
            </p>
          </CardContent>
        </Card>

        {/* Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your financial overview at a glance. The dashboard provides a comprehensive view 
              of your current month's financial health.
            </p>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                <TrendingUp className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Monthly Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    View your income, spending, net savings, and savings rate for the current month. 
                    The savings rate shows what percentage of your income you're keeping.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <BarChart3 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Spending Trends & Category Charts</h4>
                  <p className="text-sm text-muted-foreground">
                    Visual charts showing your spending patterns over time and breakdown by category. 
                    Helps identify where your money is going.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Calendar className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Upcoming Bills</h4>
                  <p className="text-sm text-muted-foreground">
                    Quick view of your next recurring bills to help you plan ahead and avoid surprises.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Target className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Goals Overview</h4>
                  <p className="text-sm text-muted-foreground">
                    Track progress on your active financial goals at a glance.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <DollarSign className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Budget Details</h4>
                  <p className="text-sm text-muted-foreground">
                    See how much you've spent vs. your budget limit for each category. 
                    Progress bars show percentage used, with color coding (green = safe, yellow = warning, red = over budget).
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <List className="h-5 w-5 text-gray-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Recent Transactions</h4>
                  <p className="text-sm text-muted-foreground">
                    Your 5 most recent transactions for quick reference.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 mt-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Quick Action
              </h4>
              <p className="text-sm text-muted-foreground">
                Use the <strong>+ Add</strong> button (bottom right) to quickly record a new transaction from anywhere.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              View, search, filter, and manage all your financial transactions in one place.
            </p>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-1">Adding Transactions</h4>
                <p className="text-sm text-muted-foreground">
                  Click the <strong>+ Add Transaction</strong> button or use the floating action button. 
                  Fill in the amount (positive for income, negative for expenses), category, date, and optional notes.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-1">Editing & Deleting</h4>
                <p className="text-sm text-muted-foreground">
                  Click the edit icon on any transaction to modify it, or the trash icon to delete it. 
                  Changes are saved automatically.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-1">Search & Filter</h4>
                <p className="text-sm text-muted-foreground">
                  Use the search bar to find transactions by note or category. 
                  Filter by specific categories or date ranges to analyze your spending patterns.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-1">Sorting</h4>
                <p className="text-sm text-muted-foreground">
                  Click column headers to sort by date, amount, or category. 
                  Click again to reverse the sort order.
                </p>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
              <h4 className="font-medium mb-2 text-blue-600">💡 Pro Tip</h4>
              <p className="text-sm text-muted-foreground">
                Add detailed notes to your transactions to remember context later. 
                This is especially helpful for unusual expenses or when reviewing your spending habits.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recurring Bills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Repeat className="h-5 w-5" />
              Recurring Bills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Manage subscriptions and recurring expenses to never miss a payment.
            </p>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-1">Adding Recurring Bills</h4>
                <p className="text-sm text-muted-foreground">
                  Click <strong>+ Add Bill</strong> and enter the name, amount, category, and frequency 
                  (weekly, monthly, quarterly, or yearly). Set the next due date to start tracking.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-1">Bill Status</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• <strong className="text-green-600">Paid</strong> - Bill has been paid for this period</li>
                  <li>• <strong className="text-yellow-600">Due Soon</strong> - Bill is due within 7 days</li>
                  <li>• <strong className="text-red-600">Overdue</strong> - Bill is past its due date</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-1">Marking as Paid</h4>
                <p className="text-sm text-muted-foreground">
                  Click the checkmark icon to mark a bill as paid. This automatically creates a transaction 
                  and updates the next due date based on the frequency.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-1">Managing Bills</h4>
                <p className="text-sm text-muted-foreground">
                  Edit bills to update amounts or frequencies. Delete bills you no longer need. 
                  The system will remind you of upcoming bills on your dashboard.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Financial Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Set and track savings goals to achieve your financial dreams.
            </p>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-1">Creating Goals</h4>
                <p className="text-sm text-muted-foreground">
                  Click <strong>+ New Goal</strong> and define your goal name, target amount, 
                  optional deadline, and category. Add a description to remind yourself why this goal matters.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-1">Contributing to Goals</h4>
                <p className="text-sm text-muted-foreground">
                  Click <strong>Add Funds</strong> on any goal to contribute money. 
                  Enter the amount and optional note. Your progress updates automatically.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-1">Withdrawing from Goals</h4>
                <p className="text-sm text-muted-foreground">
                  Need to use some saved funds? Click <strong>Withdraw</strong> to remove money from a goal. 
                  This is tracked in your goal history.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-1">Goal Progress</h4>
                <p className="text-sm text-muted-foreground">
                  Visual progress bars show how close you are to your target. 
                  The percentage and remaining amount help you stay motivated.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-1">Goal Statistics</h4>
                <p className="text-sm text-muted-foreground">
                  View total saved across all goals, total targets, completed goals, 
                  and overall progress at the top of the page.
                </p>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mt-4">
              <h4 className="font-medium mb-2 text-emerald-600">🎯 Success Tip</h4>
              <p className="text-sm text-muted-foreground">
                Set realistic deadlines and contribute regularly, even small amounts. 
                Consistency is key to achieving your financial goals!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Household Sharing & Couple Mode */}
        <Card className="border-2 border-pink-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Household Sharing & Couple Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Two powerful features for managing finances with your partner.
            </p>

            <div className="space-y-4">
              <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Household Sharing
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Share the same financial data across two separate user accounts. Perfect for couples who want independent logins but shared finances.
                </p>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Setting Up (First Partner):</strong>
                    <ol className="list-decimal list-inside ml-2 mt-1 text-muted-foreground">
                      <li>Go to Settings → Household Sharing</li>
                      <li>Click "Create Household" and enter a name</li>
                      <li>Copy the invite code that appears</li>
                      <li>Share the code with your partner</li>
                    </ol>
                  </div>

                  <div className="mt-3">
                    <strong>Joining (Second Partner):</strong>
                    <ol className="list-decimal list-inside ml-2 mt-1 text-muted-foreground">
                      <li>Create your own account (different email)</li>
                      <li>Go to Settings → Household Sharing</li>
                      <li>Enter the invite code</li>
                      <li>Click "Join Household"</li>
                    </ol>
                  </div>

                  <div className="mt-3">
                    <strong>What Gets Shared:</strong>
                    <ul className="list-disc list-inside ml-2 mt-1 text-muted-foreground">
                      <li>All transactions, goals, and bills</li>
                      <li>Budget categories and settings</li>
                      <li>Changes sync every 30 seconds</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Couple Mode
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Track individual spending and see who owes whom. Works on a single account OR combined with Household Sharing.
                </p>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Enabling Couple Mode:</strong>
                    <ol className="list-decimal list-inside ml-2 mt-1 text-muted-foreground">
                      <li>Go to Settings → Couple Mode</li>
                      <li>Toggle "Enable Couple Mode"</li>
                      <li>Set Partner 1 and Partner 2 names</li>
                      <li>If using Household Sharing, both partners should use the same names</li>
                    </ol>
                  </div>

                  <div className="mt-3">
                    <strong>Using Couple Mode:</strong>
                    <ul className="list-disc list-inside ml-2 mt-1 text-muted-foreground">
                      <li>When adding transactions, select who paid/received</li>
                      <li>View the "Couple View" page to see individual balances</li>
                      <li>See who owes whom and by how much</li>
                      <li>Filter transactions by partner</li>
                    </ul>
                  </div>

                  <div className="mt-3">
                    <strong>Use Cases:</strong>
                    <ul className="list-disc list-inside ml-2 mt-1 text-muted-foreground">
                      <li><strong>Single Account:</strong> Track split expenses on one login</li>
                      <li><strong>With Household Sharing:</strong> Full partner finance tracking with separate logins</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="font-medium mb-2 text-blue-600">💡 Which Should I Use?</h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Household Sharing Only:</strong> Fully merged finances, no individual tracking needed</p>
                  <p><strong>Couple Mode Only:</strong> One person manages everything, but tracks who paid what</p>
                  <p><strong>Both Together:</strong> Separate logins + individual spending tracking = Complete solution!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Customize 2Cents to match your preferences and financial setup.
            </p>

            <div className="space-y-3">
              <div className="flex gap-3">
                <DollarSign className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Currency</h4>
                  <p className="text-sm text-muted-foreground">
                    Set your preferred currency symbol (e.g., $, €, £, ¥). 
                    This appears throughout the app for all monetary values.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <List className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Budget Categories</h4>
                  <p className="text-sm text-muted-foreground">
                    Create custom categories for your spending (e.g., Groceries, Entertainment, Transport). 
                    Set monthly budget limits for each category to track your spending goals.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Add:</strong> Click "+ Add Category" to create new ones.<br />
                    <strong>Edit:</strong> Modify category names or budget limits anytime.<br />
                    <strong>Delete:</strong> Remove categories you no longer need.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Palette className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">UI Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose between <strong>Standard</strong> (full-featured with charts and widgets) 
                    or <strong>Minimalist</strong> (clean, simple lists) view modes.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Users className="h-5 w-5 text-pink-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Household Sharing</h4>
                  <p className="text-sm text-muted-foreground">
                    Share financial data with your partner using separate accounts. 
                    Create a household, get an invite code, and your partner can join to see the same transactions, goals, and bills in real-time.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong>How it works:</strong> One person creates a household and shares the invite code. 
                    The other person joins using that code. Both accounts now see and can edit the same data.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Users className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Couple Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    Track individual spending within shared finances. 
                    Label each transaction by who paid/received to see individual balances and who owes whom.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong>Works with or without Household Sharing:</strong> Use it alone on a single account, 
                    or combine it with Household Sharing for complete partner finance tracking.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Lock className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Security</h4>
                  <p className="text-sm text-muted-foreground">
                    Set up authentication to protect your financial data. 
                    Sign out when needed to keep your information secure.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Download className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Export Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Download your financial data as JSON for backup or migration purposes. 
                    Keep regular backups of your important financial information.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Upload className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Import Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Restore data from a previous export or migrate from another device. 
                    Upload your JSON backup file to restore all transactions, goals, and settings.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="text-2xl shrink-0">📝</div>
                <div>
                  <h4 className="font-medium">Record Transactions Immediately</h4>
                  <p className="text-sm text-muted-foreground">
                    Log expenses as soon as they happen to maintain accurate records and avoid forgetting.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-2xl shrink-0">🎯</div>
                <div>
                  <h4 className="font-medium">Set Realistic Budgets</h4>
                  <p className="text-sm text-muted-foreground">
                    Review your past spending to set achievable category limits. 
                    Adjust as needed based on your actual habits.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-2xl shrink-0">📊</div>
                <div>
                  <h4 className="font-medium">Review Regularly</h4>
                  <p className="text-sm text-muted-foreground">
                    Check your dashboard weekly to stay aware of your spending patterns and progress toward goals.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-2xl shrink-0">💾</div>
                <div>
                  <h4 className="font-medium">Backup Your Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Export your data monthly to keep a backup of your financial history.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-2xl shrink-0">🏷️</div>
                <div>
                  <h4 className="font-medium">Use Categories Consistently</h4>
                  <p className="text-sm text-muted-foreground">
                    Assign the same category to similar expenses for accurate tracking and meaningful insights.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5" />
              Quick Start Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 list-decimal list-inside">
              <li className="text-sm">
                <strong>Set up your categories</strong> - Go to Settings and create budget categories that match your spending habits
              </li>
              <li className="text-sm">
                <strong>Add recurring bills</strong> - Enter your subscriptions and regular expenses in the Recurring Bills page
              </li>
              <li className="text-sm">
                <strong>Record transactions</strong> - Start logging your income and expenses as they happen
              </li>
              <li className="text-sm">
                <strong>Create financial goals</strong> - Set up savings goals for things you want to achieve
              </li>
              <li className="text-sm">
                <strong>Monitor your dashboard</strong> - Check your financial overview regularly to stay on track
              </li>
              <li className="text-sm">
                <strong>Adjust as needed</strong> - Refine your budgets and goals based on your actual spending patterns
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pb-4">
          <p>Need more help? Your financial data is stored locally and privately on your device.</p>
          <p className="mt-2">Happy budgeting! 💰</p>
        </div>
      </div>
    </Page>
  );
}
