import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Receipt, Target } from "lucide-react";
import { Link } from "react-router-dom";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Link to="/add" className="block">
          <Button className="w-full justify-start bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </Link>
        <Link to="/recurring" className="block">
          <Button variant="outline" className="w-full justify-start">
            <Receipt className="h-4 w-4 mr-2" />
            Pay Bill
          </Button>
        </Link>
        <Link to="/goals" className="block">
          <Button variant="outline" className="w-full justify-start">
            <Target className="h-4 w-4 mr-2" />
            Update Goal
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
