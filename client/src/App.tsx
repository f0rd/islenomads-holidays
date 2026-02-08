import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import AdminBlog from "./pages/AdminBlog";
import AdminPackages from "./pages/AdminPackages";
import Packages from "./pages/Packages";
import MaldivesMap from "./pages/MaldivesMap";
import BoatRoutes from "./pages/BoatRoutes";
import TripPlanner from "./pages/TripPlanner";
import AdminBoatRoutes from "./pages/AdminBoatRoutes";
import AdminIslandGuides from "./pages/AdminIslandGuides";
import IslandGuide from "./pages/IslandGuide";
import StaffLogin from "./pages/StaffLogin";
import CMSDashboard from "./pages/CMSDashboard";
import AdminSEOOptimizer from "./pages/AdminSEOOptimizer";
import StaffDashboard from "./pages/StaffDashboard";
import AdminStaff from "./pages/AdminStaff";
import AdminActivity from "./pages/AdminActivity";
import AdminRoles from "./pages/AdminRoles";
import AdminCRM from "./pages/AdminCRM";
import AdminCRMDetail from "./pages/AdminCRMDetail";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/:slug"} component={BlogDetail} />
      <Route path={"/packages"} component={Packages} />
      <Route path={"/admin/blog"} component={AdminBlog} />
      <Route path={"/admin/packages"} component={AdminPackages} />
      <Route path={"/map"} component={MaldivesMap} />
      <Route path={"/boat-routes"} component={BoatRoutes} />
      <Route path={"/trip-planner"} component={TripPlanner} />
      <Route path={"/admin/boat-routes"} component={AdminBoatRoutes} />
      <Route path={"/admin/island-guides"} component={AdminIslandGuides} />
      <Route path={"\island-guide/:islandId"} component={IslandGuide} />
      <Route path={"/staff-login"} component={StaffLogin} />
      <Route path={"/cms/dashboard"} component={CMSDashboard} />
      <Route path={"/admin/seo-optimizer"} component={AdminSEOOptimizer} />
      <Route path={"/admin/dashboard"} component={StaffDashboard} />
      <Route path={"/admin/staff"} component={AdminStaff} />
      <Route path={"/admin/activity"} component={AdminActivity} />
      <Route path={"/admin/roles"} component={AdminRoles} />
      <Route path={"/admin/crm/:id"} component={AdminCRMDetail} />
      <Route path={"/admin/crm"} component={AdminCRM} />
      <Route path={"/admin"} component={StaffDashboard} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
